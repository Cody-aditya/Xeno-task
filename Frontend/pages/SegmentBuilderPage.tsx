import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useCustomerStore } from '../stores/customerStore';
import { useSegmentStore, RuleGroup } from '../stores/segmentStore';
import { useCampaignStore } from '../stores/campaignStore';
import { 
  ArrowLeft, 
  Plus, 
  Trash2, 
  Users, 
  Target, 
  MessageSquare,
  Sparkles,
  Send
} from 'lucide-react';
import { convertNaturalLanguageToRules, generateMessageSuggestions } from '../services/aiService';

const fieldOptions = [
  { value: 'totalSpend', label: 'Total Spend' },
  { value: 'visitCount', label: 'Visit Count' },
  { value: 'lastOrderDate', label: 'Last Order Date' },
  { value: 'status', label: 'Status' },
  { value: 'tags', label: 'Tags' },
];

const operatorOptions = {
  totalSpend: [
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
  ],
  visitCount: [
    { value: 'greaterThan', label: 'Greater than' },
    { value: 'lessThan', label: 'Less than' },
    { value: 'equals', label: 'Equals' },
  ],
  lastOrderDate: [
    { value: 'before', label: 'Before' },
    { value: 'after', label: 'After' },
  ],
  status: [
    { value: 'equals', label: 'Is' },
    { value: 'notEquals', label: 'Is not' },
  ],
  tags: [
    { value: 'contains', label: 'Contains' },
    { value: 'notContains', label: 'Does not contain' },
  ],
};

const valueOptions = {
  status: [
    { value: 'active', label: 'Active' },
    { value: 'inactive', label: 'Inactive' },
    { value: 'new', label: 'New' },
  ],
  tags: [
    { value: 'premium', label: 'Premium' },
    { value: 'loyal', label: 'Loyal' },
    { value: 'high-value', label: 'High Value' },
    { value: 'new', label: 'New' },
    { value: 'regular', label: 'Regular' },
  ],
};

const SegmentBuilderPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { segments, createSegment, previewSegment } = useSegmentStore();
  const { fetchCustomers } = useCustomerStore();
  const { createCampaign } = useCampaignStore();
  
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [naturalLanguage, setNaturalLanguage] = useState('');
  const [ruleGroup, setRuleGroup] = useState<RuleGroup>({
    id: 'root',
    combinator: 'and',
    rules: [],
  });
  const [previewResults, setPreviewResults] = useState<{
    count: number;
    sampleCustomers: any[];
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [campaignMessage, setCampaignMessage] = useState('');
  const [campaignObjective, setCampaignObjective] = useState('');
  const [suggestedMessages, setSuggestedMessages] = useState<string[]>([]);
  const [isGeneratingMessages, setIsGeneratingMessages] = useState(false);
  const [saving, setSaving] = useState(false);
  
  // Load segment data if editing
  useEffect(() => {
    if (id && segments.length > 0) {
      const segment = segments.find(s => s.id === id);
      if (segment) {
        setName(segment.name);
        setDescription(segment.description);
        setRuleGroup(segment.ruleGroup);
      }
    }
  }, [id, segments]);
  
  useEffect(() => {
    // Make sure customers are loaded for preview
    fetchCustomers();
  }, [fetchCustomers]);
  
  const handleAddRule = () => {
    const newRule = {
      id: `rule-${Date.now()}`,
      field: 'totalSpend',
      operator: 'greaterThan',
      value: 5000,
    };
    
    setRuleGroup(prev => ({
      ...prev,
      rules: [...prev.rules, newRule],
    }));
  };
  
  const handleRemoveRule = (ruleId: string) => {
    setRuleGroup(prev => ({
      ...prev,
      rules: prev.rules.filter(rule => 'id' in rule && rule.id !== ruleId),
    }));
  };
  
  const handleRuleChange = (ruleId: string, field: string, value: any) => {
    setRuleGroup(prev => ({
      ...prev,
      rules: prev.rules.map(rule => {
        if ('id' in rule && rule.id === ruleId) {
          return { ...rule, [field]: value };
        }
        return rule;
      }),
    }));
  };
  
  const handleCombinatorChange = (value: 'and' | 'or') => {
    setRuleGroup(prev => ({
      ...prev,
      combinator: value,
    }));
  };
  
  const handlePreview = async () => {
    if (ruleGroup.rules.length === 0) return;
    
    setPreviewLoading(true);
    try {
      const results = await previewSegment(ruleGroup);
      setPreviewResults(results);
    } catch (error) {
      console.error('Error previewing segment:', error);
    } finally {
      setPreviewLoading(false);
    }
  };
  
  const handleNaturalLanguageToRules = async () => {
    if (!naturalLanguage.trim()) return;
    
    setPreviewLoading(true);
    try {
      const generatedRules = await convertNaturalLanguageToRules(naturalLanguage);
      setRuleGroup(generatedRules);
      
      // Automatically run preview after setting rules
      setTimeout(async () => {
        const results = await previewSegment(generatedRules);
        setPreviewResults(results);
        setPreviewLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error converting natural language to rules:', error);
      setPreviewLoading(false);
    }
  };
  
  const handleGenerateMessageSuggestions = async () => {
    if (!campaignObjective.trim()) return;
    
    setIsGeneratingMessages(true);
    try {
      const messages = await generateMessageSuggestions(
        campaignObjective,
        name // Pass segment name as audience type
      );
      setSuggestedMessages(messages);
    } catch (error) {
      console.error('Error generating message suggestions:', error);
    } finally {
      setIsGeneratingMessages(false);
    }
  };
  
  const handleCreateCampaign = async () => {
    if (!name || !campaignMessage || !previewResults) return;
    
    setSaving(true);
    try {
      // First save the segment if it's new
      let segmentId = id;
      let segmentName = name;
      
      if (!id) {
        const newSegment = await createSegment({
          name,
          description,
          ruleGroup,
          createdBy: 'Demo User',
        });
        segmentId = newSegment.id;
        segmentName = newSegment.name;
      }
      
      // Then create the campaign
      const campaign = await createCampaign({
        name: `${name} Campaign`,
        segmentId,
        segmentName,
        message: campaignMessage,
        audienceSize: previewResults.count,
      });
      
      // Navigate to the campaign detail page
      navigate(`/campaigns/${campaign.id}`);
    } catch (error) {
      console.error('Error creating campaign:', error);
      setSaving(false);
    }
  };
  
  const handleNextStep = () => {
    if (step === 1 && (!name || ruleGroup.rules.length === 0)) {
      return;
    }
    
    if (step < 3) {
      setStep(step + 1);
      
      // If moving to campaign step and we have an audience but no message suggestions,
      // auto-trigger message generation
      if (step === 1 && previewResults && !suggestedMessages.length) {
        setTimeout(() => {
          handleGenerateMessageSuggestions();
        }, 500);
      }
    }
  };
  
  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    } else {
      navigate('/segments');
    }
  };
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={handlePrevStep} 
          className="p-1 mr-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {id ? 'Edit Segment' : step === 1 ? 'Create Segment' : step === 2 ? 'Create Campaign' : 'Review & Launch'}
          </h1>
          <p className="text-sm text-gray-500">
            {step === 1 ? 'Define your audience with targeting rules' : 
             step === 2 ? 'Craft your message for the selected audience' :
             'Review your campaign before sending'}
          </p>
        </div>
      </div>
      
      {/* Progress Steps */}
      <div className="mb-8">
        <div className="flex items-center">
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 1 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            <Target className="h-4 w-4" />
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 2 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 2 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            <MessageSquare className="h-4 w-4" />
          </div>
          <div className={`flex-1 h-1 mx-2 ${step >= 3 ? 'bg-primary-600' : 'bg-gray-200'}`}></div>
          <div className={`flex items-center justify-center w-8 h-8 rounded-full ${step >= 3 ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-600'}`}>
            <Send className="h-4 w-4" />
          </div>
        </div>
        <div className="flex text-xs justify-between mt-1">
          <span className={step >= 1 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Define Audience</span>
          <span className={step >= 2 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Create Message</span>
          <span className={step >= 3 ? 'text-primary-600 font-medium' : 'text-gray-500'}>Review & Launch</span>
        </div>
      </div>
      
      {step === 1 && (
        <>
          {/* Segment Builder */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Segment Details</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Segment Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="input mt-1"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="High Value Customers, Inactive Users, etc."
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  id="description"
                  className="input mt-1"
                  rows={2}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe this audience segment"
                />
              </div>
            </div>
          </div>
          
          {/* Natural Language Input */}
          <div className="card mb-6">
            <div className="card-header flex justify-between items-center">
              <div className="flex items-center">
                <Sparkles className="h-5 w-5 text-accent-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">AI-Powered Rule Generation</h2>
              </div>
            </div>
            <div className="card-body">
              <div>
                <label htmlFor="naturalLanguage" className="block text-sm font-medium text-gray-700">
                  Describe your target audience in plain language
                </label>
                <div className="mt-1 flex">
                  <input
                    type="text"
                    id="naturalLanguage"
                    className="input flex-1"
                    value={naturalLanguage}
                    onChange={(e) => setNaturalLanguage(e.target.value)}
                    placeholder="E.g., People who haven't shopped in 6 months and spent over ₹5K"
                  />
                  <button
                    onClick={handleNaturalLanguageToRules}
                    disabled={!naturalLanguage.trim()}
                    className="ml-2 btn-primary whitespace-nowrap"
                  >
                    Generate Rules
                  </button>
                </div>
                <p className="mt-2 text-xs text-gray-500">
                  Example: "High value customers who haven't made a purchase in 30 days" or "New customers with less than 3 visits"
                </p>
              </div>
            </div>
          </div>
          
          {/* Rule Builder */}
          <div className="card mb-6">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Targeting Rules</h2>
            </div>
            <div className="card-body space-y-6">
              {/* Combinator (AND/OR) */}
              <div className="flex space-x-4">
                <span className="text-sm font-medium text-gray-700">Match</span>
                <div className="flex items-center space-x-2">
                  <button
                    type="button"
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      ruleGroup.combinator === 'and' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => handleCombinatorChange('and')}
                  >
                    ALL conditions
                  </button>
                  <button
                    type="button"
                    className={`px-3 py-1 text-sm font-medium rounded-md ${
                      ruleGroup.combinator === 'or' ? 'bg-primary-100 text-primary-800' : 'bg-gray-100 text-gray-800'
                    }`}
                    onClick={() => handleCombinatorChange('or')}
                  >
                    ANY condition
                  </button>
                </div>
              </div>
              
              {/* Rules */}
              <div className="space-y-4">
                {ruleGroup.rules.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No rules defined yet. Add a rule or use the AI rule generator above.</p>
                  </div>
                ) : (
                  ruleGroup.rules.map((rule: any) => (
                    <div key={rule.id} className="flex items-center space-x-2">
                      <select
                        className="input max-w-xs"
                        value={rule.field}
                        onChange={(e) => handleRuleChange(rule.id, 'field', e.target.value)}
                      >
                        {fieldOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <select
                        className="input max-w-xs"
                        value={rule.operator}
                        onChange={(e) => handleRuleChange(rule.id, 'operator', e.target.value)}
                      >
                        {operatorOptions[rule.field as keyof typeof operatorOptions]?.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      {valueOptions[rule.field as keyof typeof valueOptions] ? (
                        <select
                          className="input max-w-xs"
                          value={rule.value}
                          onChange={(e) => handleRuleChange(rule.id, 'value', e.target.value)}
                        >
                          {valueOptions[rule.field as keyof typeof valueOptions].map(option => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={rule.field === 'totalSpend' || rule.field === 'visitCount' ? 'number' : 'text'}
                          className="input max-w-xs"
                          value={rule.value}
                          onChange={(e) => handleRuleChange(
                            rule.id, 
                            'value', 
                            rule.field === 'totalSpend' || rule.field === 'visitCount' 
                              ? parseFloat(e.target.value) 
                              : e.target.value
                          )}
                          placeholder="Value"
                        />
                      )}
                      
                      <button
                        type="button"
                        className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                        onClick={() => handleRemoveRule(rule.id)}
                      >
                        <Trash2 className="h-5 w-5" />
                      </button>
                    </div>
                  ))
                )}
                
                <button
                  type="button"
                  className="btn-outline flex items-center"
                  onClick={handleAddRule}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Rule
                </button>
              </div>
            </div>
          </div>
          
          {/* Preview Results */}
          <div className="card">
            <div className="card-header flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">Audience Preview</h2>
              <button
                type="button"
                className="btn-primary btn-sm"
                onClick={handlePreview}
                disabled={ruleGroup.rules.length === 0 || previewLoading}
              >
                {previewLoading ? 'Loading...' : 'Preview Audience'}
              </button>
            </div>
            <div className="card-body">
              {previewLoading ? (
                <div className="flex items-center justify-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
                </div>
              ) : previewResults ? (
                <div>
                  <div className="mb-4">
                    <p className="text-lg font-semibold">
                      <span className="text-primary-600">{previewResults.count}</span> customers match these criteria
                    </p>
                  </div>
                  
                  {previewResults.sampleCustomers.length > 0 && (
                    <div>
                      <h3 className="text-sm font-medium text-gray-700 mb-2">Sample Matching Customers:</h3>
                      <ul className="divide-y divide-gray-200">
                        {previewResults.sampleCustomers.map(customer => (
                          <li key={customer.id} className="py-2">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                                {customer.name.charAt(0)}
                              </div>
                              <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                                <p className="text-sm text-gray-500">{customer.email}</p>
                              </div>
                              <div className="ml-auto text-sm text-gray-500">
                                ₹{customer.totalSpend.toLocaleString('en-IN')} · {customer.visitCount} visits
                              </div>
                            </div>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 mx-auto text-gray-400" />
                  <p className="mt-2 text-gray-500">
                    Click "Preview Audience" to see how many customers match your criteria
                  </p>
                </div>
              )}
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="btn-outline"
              onClick={() => navigate('/segments')}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!name || ruleGroup.rules.length === 0}
            >
              Continue to Message
            </button>
          </div>
        </>
      )}
      
      {step === 2 && (
        <>
          {/* Campaign Message */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Campaign Objective</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="objective" className="block text-sm font-medium text-gray-700">
                  What's the goal of this campaign?
                </label>
                <input
                  type="text"
                  id="objective"
                  className="input mt-1"
                  value={campaignObjective}
                  onChange={(e) => setCampaignObjective(e.target.value)}
                  placeholder="E.g., Win back inactive customers, Promote new product, etc."
                />
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleGenerateMessageSuggestions}
                  disabled={!campaignObjective.trim() || isGeneratingMessages}
                  className="flex items-center space-x-1 btn-accent"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Generate Message Ideas</span>
                </button>
              </div>
            </div>
          </div>
          
          {/* AI-Generated Message Suggestions */}
          {(isGeneratingMessages || suggestedMessages.length > 0) && (
            <div className="card mb-6">
              <div className="card-header flex items-center">
                <Sparkles className="h-5 w-5 text-accent-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">AI Message Suggestions</h2>
              </div>
              <div className="card-body">
                {isGeneratingMessages ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500 mx-auto"></div>
                      <p className="mt-2 text-sm text-gray-500">Generating suggestions based on your campaign objective...</p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-500">
                      Select a message template or use as inspiration for your own message
                    </p>
                    {suggestedMessages.map((message, index) => (
                      <div
                        key={index}
                        onClick={() => setCampaignMessage(message)}
                        className={`p-3 border rounded-md cursor-pointer transition-colors ${
                          campaignMessage === message
                            ? 'border-accent-500 bg-accent-50'
                            : 'border-gray-200 hover:border-accent-300'
                        }`}
                      >
                        <p className="text-sm">{message}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Message Editor */}
          <div className="card mb-6">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Campaign Message</h2>
            </div>
            <div className="card-body space-y-4">
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">
                  Message to send to customers
                </label>
                <textarea
                  id="message"
                  className="input mt-1"
                  rows={4}
                  value={campaignMessage}
                  onChange={(e) => setCampaignMessage(e.target.value)}
                  placeholder="Hi {{name}}, we have a special offer for you!"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Use {{name}} to personalize with the customer's name
                </p>
              </div>
              
              {/* Message Preview */}
              {campaignMessage && (
                <div>
                  <h3 className="text-sm font-medium text-gray-700 mb-2">Preview:</h3>
                  <div className="bg-gray-100 p-4 rounded-md">
                    <p className="text-gray-900">
                      {campaignMessage.replace('{{name}}', 'Rahul')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Audience Summary */}
          {previewResults && (
            <div className="card mb-6">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Audience Summary</h2>
              </div>
              <div className="card-body">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
                    <Users className="h-5 w-5 text-primary-600" />
                  </div>
                  <div className="ml-4">
                    <h4 className="text-lg font-semibold text-gray-900">{previewResults.count} customers</h4>
                    <p className="text-sm text-gray-500">
                      Match your {ruleGroup.combinator === 'and' ? 'ALL' : 'ANY'} conditions rule
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="btn-outline"
              onClick={handlePrevStep}
            >
              Back to Audience
            </button>
            <button
              type="button"
              className="btn-primary"
              onClick={handleNextStep}
              disabled={!campaignMessage.trim()}
            >
              Review Campaign
            </button>
          </div>
        </>
      )}
      
      {step === 3 && (
        <>
          {/* Review Campaign */}
          <div className="space-y-6">
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Campaign Summary</h2>
              </div>
              <div className="card-body">
                <dl className="divide-y divide-gray-200">
                  <div className="py-4 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Segment Name</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{name}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Audience Size</dt>
                    <dd className="text-sm text-gray-900 col-span-2">
                      {previewResults ? previewResults.count : 'Unknown'} customers
                    </dd>
                  </div>
                  <div className="py-4 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Campaign Objective</dt>
                    <dd className="text-sm text-gray-900 col-span-2">{campaignObjective}</dd>
                  </div>
                  <div className="py-4 grid grid-cols-3">
                    <dt className="text-sm font-medium text-gray-500">Message</dt>
                    <dd className="text-sm text-gray-900 col-span-2 whitespace-pre-line">
                      {campaignMessage}
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
            
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Matching Rules</h2>
              </div>
              <div className="card-body">
                <div className="mb-2">
                  <span className="badge bg-primary-100 text-primary-800 text-xs">
                    Match {ruleGroup.combinator === 'and' ? 'ALL' : 'ANY'} of these conditions
                  </span>
                </div>
                <ul className="space-y-2">
                  {ruleGroup.rules.map((rule: any) => (
                    <li key={rule.id} className="text-sm text-gray-600 pl-2 border-l-2 border-primary-200">
                      {fieldOptions.find(f => f.value === rule.field)?.label} 
                      {' '}
                      {operatorOptions[rule.field as keyof typeof operatorOptions]?.find(o => o.value === rule.operator)?.label}
                      {' '}
                      {rule.field === 'status' || rule.field === 'tags' 
                        ? valueOptions[rule.field as keyof typeof valueOptions]?.find(v => v.value === rule.value)?.label
                        : rule.field === 'totalSpend' ? `₹${rule.value}` : rule.value}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            
            {previewResults && previewResults.sampleCustomers.length > 0 && (
              <div className="card">
                <div className="card-header">
                  <h2 className="text-lg font-medium text-gray-900">Sample Recipients</h2>
                </div>
                <div className="overflow-hidden">
                  <ul className="divide-y divide-gray-200">
                    {previewResults.sampleCustomers.map(customer => (
                      <li key={customer.id} className="px-6 py-4">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center text-primary-800">
                            {customer.name.charAt(0)}
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-gray-900">{customer.name}</p>
                            <p className="text-sm text-gray-500">{customer.email}</p>
                          </div>
                          <div className="ml-auto">
                            <div className="text-xs text-gray-500">
                              Will receive:
                              <p className="text-sm font-medium text-gray-900 mt-1">
                                {campaignMessage.replace('{{name}}', customer.name.split(' ')[0])}
                              </p>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v4.5a.75.75 0 01-1.5 0v-4.5A.75.75 0 0110 5zm0 10a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-yellow-700">
                    This is a demonstration application. In a production environment, messages would be sent via SMS, email, or push notifications to real customers.
                  </p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="mt-6 flex justify-between">
            <button
              type="button"
              className="btn-outline"
              onClick={handlePrevStep}
            >
              Back to Message
            </button>
            <button
              type="button"
              className="btn-success flex items-center space-x-2"
              onClick={handleCreateCampaign}
              disabled={saving}
            >
              <Send className="h-4 w-4" />
              <span>{saving ? 'Creating...' : 'Create & Launch Campaign'}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SegmentBuilderPage;