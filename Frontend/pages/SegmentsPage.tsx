import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSegmentStore } from '../stores/segmentStore';
import { Plus, Edit, Calendar, Users, ChevronRight } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const SegmentsPage = () => {
  const navigate = useNavigate();
  const { segments, loading, fetchSegments } = useSegmentStore();
  
  useEffect(() => {
    fetchSegments();
  }, [fetchSegments]);
  
  if (loading && segments.length === 0) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    );
  }
  
  return (
    <div className="animate-fade-in">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Audience Segments</h1>
          <p className="mt-1 text-sm text-gray-500">
            Create and manage audience segments for targeted campaigns
          </p>
        </div>
        <button
          onClick={() => navigate('/segments/create')}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus className="h-4 w-4" />
          <span>New Segment</span>
        </button>
      </div>
      
      {segments.length === 0 ? (
        <div className="card">
          <div className="card-body text-center py-12">
            <div className="mx-auto h-12 w-12 rounded-full bg-primary-100 flex items-center justify-center">
              <Users className="h-6 w-6 text-primary-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No audience segments yet</h3>
            <p className="mt-1 text-sm text-gray-500">
              Create your first segment to start building targeted campaigns
            </p>
            <div className="mt-6">
              <button
                type="button"
                className="btn-primary flex items-center space-x-2 mx-auto"
                onClick={() => navigate('/segments/create')}
              >
                <Plus className="h-4 w-4" />
                <span>Create a Segment</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="mt-4 grid grid-cols-1 gap-4">
          {segments.map((segment) => (
            <div 
              key={segment.id} 
              className="card hover:shadow-md transition-shadow duration-200 cursor-pointer"
              onClick={() => navigate(`/segments/edit/${segment.id}`)}
            >
              <div className="p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">{segment.name}</h2>
                    <p className="mt-1 text-sm text-gray-500">{segment.description}</p>
                    
                    <div className="mt-4 flex items-center text-sm text-gray-500 space-x-4">
                      <div className="flex items-center">
                        <Calendar className="mr-1 h-4 w-4" />
                        <span>Created {formatDistanceToNow(new Date(segment.createdAt), { addSuffix: true })}</span>
                      </div>
                      <div className="flex items-center">
                        <Users className="mr-1 h-4 w-4" />
                        <span>~250 customers</span>
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/segments/edit/${segment.id}`);
                    }}
                  >
                    <Edit className="h-5 w-5" aria-hidden="true" />
                  </button>
                </div>
                
                <div className="mt-6 flex justify-between items-center">
                  <div className="flex space-x-2">
                    <span className="badge bg-primary-100 text-primary-800">
                      {segment.ruleGroup.combinator === 'and' ? 'All conditions' : 'Any condition'}
                    </span>
                    <span className="badge bg-gray-100 text-gray-800">
                      {segment.ruleGroup.rules.length} {segment.ruleGroup.rules.length === 1 ? 'rule' : 'rules'}
                    </span>
                  </div>
                  
                  <ChevronRight className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SegmentsPage;