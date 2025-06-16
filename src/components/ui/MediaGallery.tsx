import React, { useState } from 'react';
import { X, Download, Trash2, Eye, Image as ImageIcon, Video, Calendar } from 'lucide-react';
import { Card, CardContent } from './Card';
import Button from './Button';
import { MediaItem } from '../../contexts/AppContext';

interface MediaGalleryProps {
  media: MediaItem[];
  onDelete?: (mediaId: string) => void;
  className?: string;
}

interface LightboxProps {
  media: MediaItem;
  onClose: () => void;
  onDelete?: (mediaId: string) => void;
}

const Lightbox: React.FC<LightboxProps> = ({ media, onClose, onDelete }) => {
  const handleDelete = () => {
    if (onDelete && confirm('Are you sure you want to delete this media item?')) {
      onDelete(media.id);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center p-4">
      <div className="relative max-w-7xl max-h-full w-full h-full flex items-center justify-center">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 text-white rounded-full hover:bg-opacity-70 transition-colors"
        >
          <X size={24} />
        </button>

        {/* Media content */}
        <div className="max-w-full max-h-full flex items-center justify-center">
          {media.type === 'image' ? (
            <img
              src={media.url}
              alt={media.name}
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <video
              src={media.url}
              controls
              className="max-w-full max-h-full"
              autoPlay
            />
          )}
        </div>

        {/* Media info overlay */}
        <div className="absolute bottom-4 left-4 right-4 bg-black bg-opacity-50 text-white p-4 rounded-lg">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-lg">{media.name}</h3>
              <p className="text-sm text-gray-300 flex items-center mt-1">
                <Calendar size={14} className="mr-1" />
                Uploaded {media.uploadedAt.toLocaleDateString()}
              </p>
            </div>
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                <Download size={14} className="mr-1" />
                Download
              </Button>
              {onDelete && (
                <Button
                  size="sm"
                  onClick={handleDelete}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  <Trash2 size={14} className="mr-1" />
                  Delete
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MediaGallery: React.FC<MediaGalleryProps> = ({ media, onDelete, className = "" }) => {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null);

  if (media.length === 0) {
    return (
      <Card className={className}>
        <CardContent className="text-center py-12">
          <ImageIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No media yet</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Upload images and videos to see them in your project gallery.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className={className}>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Project Media ({media.length})
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {media.map((item) => (
              <div key={item.id} className="group relative">
                <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden cursor-pointer">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                      onClick={() => setSelectedMedia(item)}
                    />
                  ) : (
                    <div 
                      className="w-full h-full flex flex-col items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                      onClick={() => setSelectedMedia(item)}
                    >
                      <Video size={32} className="text-gray-400 mb-2" />
                      <span className="text-xs text-gray-600 dark:text-gray-400 text-center px-2">
                        Video
                      </span>
                    </div>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <div className="flex space-x-2">
                    <Button
                      size="sm"
                      onClick={() => setSelectedMedia(item)}
                      className="bg-white/90 hover:bg-white text-gray-900"
                    >
                      <Eye size={14} className="mr-1" />
                      View
                    </Button>
                    {onDelete && (
                      <Button
                        size="sm"
                        onClick={() => onDelete(item.id)}
                        className="bg-red-600 hover:bg-red-700 text-white"
                      >
                        <Trash2 size={14} />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Media info */}
                <div className="mt-2">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {item.name}
                  </p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {item.uploadedAt.toLocaleDateString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Lightbox */}
      {selectedMedia && (
        <Lightbox
          media={selectedMedia}
          onClose={() => setSelectedMedia(null)}
          onDelete={onDelete}
        />
      )}
    </>
  );
};

export default MediaGallery;