// This is a mock AI service that simulates calling an LLM API
// In a real app, this would connect to OpenAI, Google Vertex AI, etc.

// Message generation based on campaign objective
export const generateMessageSuggestions = async (
  objective: string,
  audienceType?: string,
  productCategory?: string
): Promise<string[]> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Simple mapping of objectives to message templates
  const templates = {
    'win-back': [
      `Hi {{name}}, we miss you! It's been a while since your last visit. Here's 15% off your next purchase.`,
      `Hello {{name}}! We noticed you haven't shopped with us recently. Come back and enjoy a special 10% discount.`,
      `{{name}}, we'd love to see you again! Return today and get free shipping on orders over ₹1,000.`
    ],
    'high-value': [
      `{{name}}, as one of our most valued customers, enjoy an exclusive 20% discount on your next premium purchase.`,
      `Because you're special to us, {{name}}, here's early access to our new collection plus 15% off.`,
      `Hi {{name}}! To thank you for your loyalty, we've added a complimentary gift to your next order.`
    ],
    'engagement': [
      `Hi {{name}}! Noticed you browsing recently? Complete your purchase today and save 10%.`,
      `{{name}}, items in your wishlist are now on sale! Don't miss out on these limited-time offers.`,
      `Hello {{name}}! Quick reminder about the items in your cart. Checkout now and use code SAVE10.`
    ],
    'new-customer': [
      `Welcome aboard, {{name}}! Enjoy 10% off your first order with code WELCOME10.`,
      `{{name}}, thanks for joining us! Explore our bestsellers with your new member discount of 15%.`,
      `Hi {{name}}! Start your journey with us - get free shipping on your first purchase.`
    ]
  };
  
  // Determine which template set to use based on objective keywords
  let templateSet = templates['engagement']; // Default
  
  if (objective.toLowerCase().includes('inactive') || 
      objective.toLowerCase().includes('win back') || 
      objective.toLowerCase().includes('haven\'t')) {
    templateSet = templates['win-back'];
  } else if (objective.toLowerCase().includes('high value') || 
             objective.toLowerCase().includes('premium') ||
             objective.toLowerCase().includes('loyal')) {
    templateSet = templates['high-value'];
  } else if (objective.toLowerCase().includes('new') || 
             objective.toLowerCase().includes('welcome') ||
             objective.toLowerCase().includes('first time')) {
    templateSet = templates['new-customer'];
  }
  
  // If audience type is provided, customize further
  if (audienceType && audienceType.toLowerCase().includes('premium')) {
    // Add premium customization if needed
    templateSet = templateSet.map(msg => 
      msg.replace('discount', 'exclusive discount')
         .replace('special', 'premium')
    );
  }
  
  // If product category is provided, add relevant mentions
  if (productCategory) {
    const category = productCategory.toLowerCase();
    templateSet = templateSet.map(msg => {
      if (category === 'fashion') {
        return msg.replace('purchase', 'fashion purchase')
                 .replace('collection', 'fashion collection');
      } else if (category === 'electronics') {
        return msg.replace('purchase', 'electronics purchase')
                 .replace('collection', 'tech collection');
      }
      return msg;
    });
  }
  
  return templateSet;
};

// Campaign performance insights generation
export const generateCampaignInsights = async (
  campaign: {
    name: string;
    audienceSize: number;
    segmentName: string;
    stats: { sent: number; failed: number; deliveryRate: number };
  }
): Promise<string> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  const { name, audienceSize, segmentName, stats } = campaign;
  
  let performanceLevel = 'average';
  if (stats.deliveryRate > 95) performanceLevel = 'excellent';
  else if (stats.deliveryRate > 90) performanceLevel = 'good';
  else if (stats.deliveryRate < 80) performanceLevel = 'poor';
  
  const insights = [
    `Your campaign "${name}" reached ${audienceSize} customers in the "${segmentName}" segment.`,
    `${stats.sent} messages were successfully delivered, with a ${stats.deliveryRate.toFixed(1)}% delivery rate.`,
    `This is considered ${performanceLevel} performance compared to industry standards.`
  ];
  
  // Add conditional insights based on performance
  if (performanceLevel === 'poor') {
    insights.push('Consider checking your customer contact information for accuracy to improve delivery rates.');
  } else if (performanceLevel === 'excellent') {
    insights.push('Your high delivery rate indicates a well-maintained customer database.');
  }
  
  // Add segment-specific insights
  if (segmentName.toLowerCase().includes('high value')) {
    insights.push('Your high-value customers continue to be a reliable audience for your campaigns.');
  } else if (segmentName.toLowerCase().includes('inactive')) {
    insights.push('Reaching inactive customers can be challenging - your current delivery rate is typical for re-engagement campaigns.');
  } else if (segmentName.toLowerCase().includes('new')) {
    insights.push('New customers typically have higher engagement rates. Consider following up with additional onboarding messages.');
  }
  
  return insights.join(' ');
};

// Convert natural language to segment rules
export const convertNaturalLanguageToRules = async (
  naturalLanguage: string
): Promise<any> => {
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1200));
  
  // Simple keyword-based parsing - in a real app, this would use NLP
  const text = naturalLanguage.toLowerCase();
  
  // Initialize rule group
  const ruleGroup = {
    id: `group-${Date.now()}`,
    combinator: 'and',
    rules: []
  };
  
  // Check for spend conditions
  if (text.includes('spent over') || text.includes('spent more than')) {
    const matches = text.match(/(?:spent over|spent more than)\s+(?:₹|rs\.?|inr)?\s*([0-9,]+)/i);
    if (matches && matches[1]) {
      const amount = parseInt(matches[1].replace(/,/g, ''));
      ruleGroup.rules.push({
        id: `rule-${Date.now()}-spend`,
        field: 'totalSpend',
        operator: 'greaterThan',
        value: amount
      });
    }
  }
  
  // Check for inactive/no shopping conditions
  if (text.includes('inactive') || 
      text.includes('haven\'t shopped') ||
      text.includes('not shopped') ||
      text.includes('no purchase')) {
    
    const durationMatches = text.match(/(\d+)\s*(month|months|day|days)/i);
    let daysInactive = 90; // Default to 90 days
    
    if (durationMatches) {
      const value = parseInt(durationMatches[1]);
      const unit = durationMatches[2].toLowerCase();
      
      if (unit.startsWith('month')) {
        daysInactive = value * 30;
      } else if (unit.startsWith('day')) {
        daysInactive = value;
      }
    }
    
    ruleGroup.rules.push({
      id: `rule-${Date.now()}-inactive`,
      field: 'status',
      operator: 'equals',
      value: 'inactive'
    });
  }
  
  // Check for visit count conditions
  if (text.includes('visit') || text.includes('visits')) {
    const visitsMatch = text.match(/(?:less than|fewer than)\s+(\d+)\s+visits/i);
    if (visitsMatch && visitsMatch[1]) {
      const visits = parseInt(visitsMatch[1]);
      ruleGroup.rules.push({
        id: `rule-${Date.now()}-visits`,
        field: 'visitCount',
        operator: 'lessThan',
        value: visits
      });
    }
  }
  
  // Check for tag-based conditions
  if (text.includes('premium') || text.includes('vip')) {
    ruleGroup.rules.push({
      id: `rule-${Date.now()}-tag`,
      field: 'tags',
      operator: 'contains',
      value: 'premium'
    });
  } else if (text.includes('new customer') || text.includes('new user')) {
    ruleGroup.rules.push({
      id: `rule-${Date.now()}-tag`,
      field: 'tags',
      operator: 'contains',
      value: 'new'
    });
  }
  
  // If we detected "or" condition in the text, change combinator
  if (text.includes(' or ')) {
    ruleGroup.combinator = 'or';
  }
  
  // If no rules were created, add a default one
  if (ruleGroup.rules.length === 0) {
    ruleGroup.rules.push({
      id: `rule-${Date.now()}-default`,
      field: 'status',
      operator: 'equals',
      value: 'active'
    });
  }
  
  return ruleGroup;
};