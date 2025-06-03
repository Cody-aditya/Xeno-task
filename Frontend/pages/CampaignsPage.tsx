import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCampaignStore } from '../stores/campaignStore';
import { Send, ArrowUpRight, Users, Calendar, CheckCircle, XCircle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const CampaignsPage = () => {
  const navigate = useNavigate();
  const { campaigns, loading, fetchCampaigns } = useCampaignStore();
  
  useEffect(() => {
    fetchCampaigns();
  }, [fetchCampaigns]);
  
  if (loading && campaigns.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  const sortedCampaigns = [...campaigns].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Campaigns</h1>
          <p className="mt-1 text-sm text-gray-500">
            View and manage your marketing campaigns
          </p>
        </div>
        <button
          onClick={() => navigate('/segments/create')}
          className="btn-primary flex items-center space-x-2"
        >
          <Send className="h-4 w-4" />
          <span>New Campaign</span>
        </button>
      </div>
      
      {campaigns.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Send className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No campaigns yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first campaign to start engaging with your customers
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="btn-primary flex items-center space-x-2 mx-auto"
                onClick={() => navigate('/segments/create')}
              >
                <Send className="h-4 w-4" />
                <span>Create a Campaign</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {sortedCampaigns.map(campaign => (
            <div 
              key={campaign.id}
              onClick={() => navigate(`/campaigns/${campaign.id}`)}
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
            >
              <div className="p-6">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start">
                  <div>
                    <div className="flex items-center">
                      <h2 className="text-xl font-semibold text-gray-900">{campaign.name}</h2>
                      <span className={`ml-3 badge ${
                        campaign.status === 'sent' ? 'badge-success' : 
                        campaign.status === 'sending' ? 'badge-warning' : 
                        campaign.status === 'failed' ? 'badge-error' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status.charAt(0).toUpperCase() + campaign.status.slice(1)}
                      </span>
                    </div>
                    
                    <p className="mt-1 text-sm text-gray-500">
                      Segment: {campaign.segmentName}
                    </p>
                    
                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>{campaign.audienceSize} recipients</span>
                      </div>
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>{formatDistanceToNow(new Date(campaign.createdAt), { addSuffix: true })}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 md:mt-0 md:ml-4">
                    {campaign.status === 'sent' && (
                      <div className="bg-gray-100 rounded-md p-4">
                        <div className="flex space-x-4 text-sm">
                          <div className="flex items-center">
                            <CheckCircle className="h-4 w-4 text-success-500 mr-1" />
                            <span>{campaign.stats.sent} sent</span>
                          </div>
                          <div className="flex items-center">
                            <XCircle className="h-4 w-4 text-error-500 mr-1" />
                            <span>{campaign.stats.failed} failed</span>
                          </div>
                        </div>
                        <div className="mt-2 w-full bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-success-500 h-2.5 rounded-full" 
                            style={{ width: `${campaign.stats.deliveryRate}%` }}
                          ></div>
                        </div>
                        <p className="mt-1 text-xs text-gray-500 text-right">
                          {campaign.stats.deliveryRate.toFixed(1)}% delivered
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                
                {campaign.status === 'draft' && (
                  <div className="mt-4">
                    <p className="italic text-sm text-gray-500">"{campaign.message.substring(0, 60)}..."</p>
                  </div>
                )}
                
                <div className="mt-4 flex justify-end">
                  <ArrowUpRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CampaignsPage;