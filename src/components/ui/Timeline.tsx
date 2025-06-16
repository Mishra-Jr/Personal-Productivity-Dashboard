import React from 'react';
import ReactMarkdown from 'react-markdown';
import { Clock, User, Trash2, Edit3 } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import { ProjectUpdate } from '../../contexts/AppContext';

interface TimelineProps {
  updates: ProjectUpdate[];
  onDelete: (updateId: string) => void;
  onEdit?: (update: ProjectUpdate) => void;
}

const Timeline: React.FC<TimelineProps> = ({ updates, onDelete, onEdit }) => {
  const sortedUpdates = [...updates].sort((a, b) => 
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  if (updates.length === 0) {
    return (
      <Card>
        <CardContent className="text-center py-12">
          <Clock size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No updates yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Start documenting your project progress by adding your first update above.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {sortedUpdates.map((update, index) => {
        // Ensure content is a valid string with fallback
        const content = String(update.content || '');
        
        return (
          <div key={update.id} className="relative">
            {/* Timeline Line */}
            {index < sortedUpdates.length - 1 && (
              <div className="absolute left-6 top-12 w-0.5 h-full bg-gray-200 dark:bg-gray-700 -z-10" />
            )}
            
            <div className="flex items-start space-x-4">
              {/* Timeline Dot */}
              <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center">
                <Clock size={20} className="text-indigo-600 dark:text-indigo-400" />
              </div>
              
              {/* Update Content */}
              <Card className="flex-1">
                <CardContent className="p-6">
                  {/* Header */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <User size={16} />
                        <span>{update.author}</span>
                      </div>
                      <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                        <Clock size={16} />
                        <span>
                          {update.timestamp.toLocaleDateString()} at{' '}
                          {update.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {onEdit && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => onEdit(update)}
                          className="text-gray-400 hover:text-indigo-600"
                        >
                          <Edit3 size={14} />
                        </Button>
                      )}
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onDelete(update.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Markdown Content */}
                  {content && (
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <ReactMarkdown>{content}</ReactMarkdown>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Timeline;