import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useCampaignStore, CommunicationLog } from '../stores/campaignStore';
import { generateCampaignInsights } from '../services/aiService';
import { 
  ArrowLeft, 
  CheckCircle, 
  XCircle, 
  Send, 
  Clock,
  Users,
  Calendar,
  MessageSquare,
  Sparkles,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

const CampaignDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { 
    fetchCampaignById, 
    fetchCommunicationLogs, 
    simulateDelivery,
    campaigns, 
    communicationLogs 
  } = useCampaignStore();
  
  const [campaign, setCampaign] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [insights, setInsights] = useState<string | null>(null);
  const [loadingInsights, setLoadingInsights] = useState(false);
  const [showAll, setShowAll] = useState(false);
  
  useEffect(() => {
    const loadCampaign = async () => {
      if (id) {
        setLoading(true);
        const campaignData = await fetchCampaignById(id);
        if (campaignData) {
          setCampaign(campaignData);
          await fetchCommunicationLogs(id);
          
          if (campaignData.status === 'sent') {
            // Generate insights for sent campaigns
            setLoadingInsights(true);
            try {
              const insightsText = await generateCampaignInsights(campaignData);
              setInsights(insightsText);
            } catch (error) {
              console.error('Error generating insights:', error);
            } finally {
              setLoadingInsights(false);
            }
          }
        }
        setLoading(false);
      }
    };
    
    loadCampaign();
  }, [id, fetchCampaignById, fetchCommunicationLogs]);
  
  // Find the campaign in the state if not yet loaded
  useEffect(() => {
    if (!campaign && !loading && campaigns.length > 0 && id) {
      const foundCampaign = campaigns.find(c => c.id === id);
      if (foundCampaign) {
        setCampaign(foundCampaign);
      }
    }
  }, [campaign, loading, campaigns, id]);
  
  const handleSendCampaign = async () => {
    if (!campaign || !id) return;
    
    setSending(true);
    try {
      await simulateDelivery(id);
      // Reload the campaign data
      const updatedCampaign = await fetchCampaignById(id);
      if (updatedCampaign) {
        setCampaign(updatedCampaign);
        await fetchCommunicationLogs(id);
        
        // Generate insights for the newly sent campaign
        setLoadingInsights(true);
        try {
          const insightsText = await generateCampaignInsights(updatedCampaign);
          setInsights(insightsText);
        } catch (error) {
          console.error('Error generating insights:', error);
        } finally {
          setLoadingInsights(false);
        }
      }
    } catch (error) {
      console.error('Error sending campaign:', error);
    } finally {
      setSending(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  if (!campaign) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-semibold text-gray-900">Campaign not found</h2>
        <p className="mt-2 text-gray-500">The campaign you're looking for doesn't exist or has been removed.</p>
        <button
          className="mt-4 btn-primary"
          onClick={() => navigate('/campaigns')}
        >
          Back to Campaigns
        </button>
      </div>
    );
  }
  
  // Display logs - limit to 5 if not showing all
  const logsToDisplay = showAll ? communicationLogs : communicationLogs.slice(0, 5);
  const hasMoreLogs = communicationLogs.length > 5 && !showAll;
  
  return (
    <div className="animate-fade-in">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/campaigns')} 
          className="p-1 mr-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{campaign.name}</h1>
          <div className="flex items-center mt-1">
            <span className={`badge ${
              campaign.status === 'sent' ? 'badge-success' : 
              campaign.status === 'sending' ? 'badge-warning' : 
              campaign.status === 'failed' ? 'badge-error' : 
              'bg-gray-100 text-gray-800'
            }`}>
              {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
            </span>
            <span className="ml-2 text-sm text-gray-500">
              {campaign.sentAt 
                ? `Sent on ${new Date(campaign.sentAt).toLocaleDateString()}`
                : 'Not yet sent'}
            </span>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-primary-100 text-primary-600">
              <Users className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Audience Size</h3>
              <p className="text-2xl font-semibold text-gray-900">{campaign.audienceSize}</p>
              <p className="text-sm text-gray-500">In segment "{campaign.segmentName}"</p>
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-secondary-100 text-secondary-600">
              <Send className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Messages Delivered</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {campaign.status === 'sent' ? campaign.stats.sent : '-'}
              </p>
              {campaign.status === 'sent' && (
                <p className="text-sm text-gray-500">{campaign.stats.deliveryRate.toFixed(1)}% success rate</p>
              )}
            </div>
          </div>
        </div>
        
        <div className="card">
          <div className="card-body flex items-center">
            <div className="p-3 rounded-md bg-error-100 text-error-600">
              <XCircle className="h-6 w-6" />
            </div>
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500">Failed Deliveries</h3>
              <p className="text-2xl font-semibold text-gray-900">
                {campaign.status === 'sent' ? campaign.stats.failed : '-'}
              </p>
              {campaign.status === 'sent' && (
                <p className="text-sm text-gray-500">{(100 - campaign.stats.deliveryRate).toFixed(1)}% failure rate</p>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Campaign Details */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          {/* Campaign Message */}
          <div className="card">
            <div className="card-header flex items-center">
              <MessageSquare className="h-5 w-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Campaign Message</h2>
            </div>
            <div className="card-body">
              <div className="bg-gray-50 p-4 rounded-md">
                <p className="whitespace-pre-line">{campaign.message}</p>
              </div>
              <p className="mt-2 text-sm text-gray-500">
                This message was sent to all customers in the "{campaign.segmentName}" segment.
              </p>
            </div>
          </div>
          
          {/* AI Insights */}
          {campaign.status === 'sent' && (
            <div className="card">
              <div className="card-header flex items-center">
                <Sparkles className="h-5 w-5 text-accent-500 mr-2" />
                <h2 className="text-lg font-medium text-gray-900">Campaign Insights</h2>
              </div>
              <div className="card-body">
                {loadingInsights ? (
                  <div className="flex items-center justify-center h-24">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-accent-500"></div>
                  </div>
                ) : insights ? (
                  <div className="bg-accent-50 border border-accent-200 p-4 rounded-md">
                    <p className="text-gray-800">{insights}</p>
                  </div>
                ) : (
                  <p className="text-gray-500">No insights available for this campaign.</p>
                )}
              </div>
            </div>
          )}
          
          {/* Communication Logs */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Delivery Log</h2>
            </div>
            {communicationLogs.length > 0 ? (
              <div>
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Customer
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {logsToDisplay.map((log: CommunicationLog) => (
                      <tr key={log.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                              {log.customerName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">{log.customerName}</div>
                              <div className="text-sm text-gray-500">{log.customerEmail}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {log.status === 'sent' ? (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                              <CheckCircle className="mr-1 h-4 w-4" />
                              Delivered
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-error-100 text-error-800">
                              <XCircle className="mr-1 h-4 w-4" />
                              Failed
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {log.status === 'sent' && log.deliveredAt
                            ? new Date(log.deliveredAt).toLocaleTimeString()
                            : '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                {/* Show more/less button */}
                {communicationLogs.length > 5 && (
                  <div className="px-6 py-3">
                    <button
                      onClick={() => setShowAll(!showAll)}
                      className="text-primary-600 hover:text-primary-800 flex items-center text-sm font-medium"
                    >
                      {showAll ? (
                        <>
                          <ChevronUp className="h-4 w-4 mr-1" />
                          Show less
                        </>
                      ) : (
                        <>
                          <ChevronDown className="h-4 w-4 mr-1" />
                          Show all ({communicationLogs.length}) records
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="card-body text-center py-8">
                {campaign.status === 'draft' ? (
                  <>
                    <Clock className="h-12 w-12 mx-auto text-gray-400" />
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Campaign not sent yet</h3>
                    <p className="mt-1 text-sm text-gray-500">
                      Send this campaign to start delivering messages to your audience.
                    </p>
                  </>
                ) : (
                  <>
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mx-auto"></div>
                    <h3 className="mt-2 text-lg font-medium text-gray-900">Loading delivery logs</h3>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
        
        <div className="space-y-6">
          {/* Campaign Info Card */}
          <div className="card">
            <div className="card-header">
              <h2 className="text-lg font-medium text-gray-900">Campaign Info</h2>
            </div>
            <div className="card-body">
              <dl className="space-y-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(campaign.createdAt).toLocaleDateString()}
                  </dd>
                </div>
                {campaign.sentAt && (
                  <div>
                    <dt className="text-sm font-medium text-gray-500">Sent</dt>
                    <dd className="mt-1 text-sm text-gray-900">
                      {new Date(campaign.sentAt).toLocaleString()}
                    </dd>
                  </div>
                )}
                <div>
                  <dt className="text-sm font-medium text-gray-500">Segment</dt>
                  <dd className="mt-1 text-sm text-gray-900">{campaign.segmentName}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* Delivery Status */}
          {campaign.status === 'sent' ? (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Delivery Status</h2>
              </div>
              <div className="card-body">
                {/* Delivery progress bar */}
                <div className="mb-4">
                  <div className="flex justify-between mb-1 text-sm">
                    <span>Progress</span>
                    <span>{campaign.stats.deliveryRate.toFixed(1)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-success-500 h-2.5 rounded-full" 
                      style={{ width: `${campaign.stats.deliveryRate}%` }}
                    ></div>
                  </div>
                </div>
                
                {/* Stats */}
                <dl className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <dt className="text-sm font-medium text-gray-500">Delivered</dt>
                    <dd className="mt-1 flex justify-center">
                      <CheckCircle className="h-5 w-5 text-success-500" />
                      <span className="ml-1 text-2xl font-semibold text-gray-900">{campaign.stats.sent}</span>
                    </dd>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-md text-center">
                    <dt className="text-sm font-medium text-gray-500">Failed</dt>
                    <dd className="mt-1 flex justify-center">
                      <XCircle className="h-5 w-5 text-error-500" />
                      <span className="ml-1 text-2xl font-semibold text-gray-900">{campaign.stats.failed}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </div>
          ) : (
            <div className="card">
              <div className="card-header">
                <h2 className="text-lg font-medium text-gray-900">Campaign Actions</h2>
              </div>
              <div className="card-body">
                <button
                  type="button"
                  className="w-full btn-primary flex items-center justify-center"
                  onClick={handleSendCampaign}
                  disabled={sending}
                >
                  <Send className="h-4 w-4 mr-2" />
                  {sending ? 'Sending...' : 'Send Campaign Now'}
                </button>
                
                <div className="mt-4 bg-gray-50 p-4 rounded-md">
                  <h3 className="text-sm font-medium text-gray-700">When you send this campaign:</h3>
                  <ul className="mt-2 text-sm text-gray-600 space-y-2">
                    <li className="flex">
                      <CheckCircle className="h-4 w-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Messages will be sent to {campaign.audienceSize} customers</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-4 w-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Each message will be personalized with customer's name</span>
                    </li>
                    <li className="flex">
                      <CheckCircle className="h-4 w-4 text-success-500 mr-2 flex-shrink-0 mt-0.5" />
                      <span>Delivery logs will be generated for tracking</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CampaignDetailPage;