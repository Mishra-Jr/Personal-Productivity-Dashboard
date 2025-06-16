import React, { useState } from 'react';
import { Menu, Upload } from 'lucide-react';
import Button from '../ui/Button';
import UploadModal from '../ui/UploadModal';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const { state } = useApp();
  const { isPublicView } = state;
  const [showUploadModal, setShowUploadModal] = useState(false);

  return (
    <>
      <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
        <div className="flex items-center justify-between">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <Menu size={20} className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="hidden lg:block">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              Welcome back, Aniket! 👋
            </h2>
          </div>

          <div className="flex items-center space-x-4">
            {/* Universal Upload Button - Hidden in public view */}
            {!isPublicView && (
              <Button
                variant="primary"
                size="sm"
                onClick={() => setShowUploadModal(true)}
                className="hidden sm:flex"
              >
                <Upload size={16} className="mr-2" />
                Upload
              </Button>
            )}
            
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {new Date().toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </header>

      {/* Upload Modal */}
      <UploadModal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
      />
    </>
  );
};

export default Header;