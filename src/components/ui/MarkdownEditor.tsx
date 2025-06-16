import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { Eye, Edit3, Bold, Italic, Link, List, Code, Image, Save, X, Globe } from 'lucide-react';
import Button from './Button';

interface MarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSave: () => void;
  onCancel: () => void;
  placeholder?: string;
  className?: string;
  isPublic?: boolean;
  onPublicToggle?: (isPublic: boolean) => void;
}

const MarkdownEditor: React.FC<MarkdownEditorProps> = ({
  value,
  onChange,
  onSave,
  onCancel,
  placeholder = "Write your update...",
  className = "",
  isPublic = false,
  onPublicToggle
}) => {
  const [mode, setMode] = useState<'edit' | 'preview'>('edit');
  const [localValue, setLocalValue] = useState(value);
  const [localIsPublic, setLocalIsPublic] = useState(isPublic);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  useEffect(() => {
    setLocalIsPublic(isPublic);
  }, [isPublic]);

  const handleChange = (newValue: string) => {
    setLocalValue(newValue);
    onChange(newValue);
  };

  const handlePublicToggle = () => {
    const newPublicState = !localIsPublic;
    setLocalIsPublic(newPublicState);
    if (onPublicToggle) {
      onPublicToggle(newPublicState);
    }
  };

  const insertMarkdown = (before: string, after: string = '') => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = localValue.substring(start, end);
    const newText = localValue.substring(0, start) + before + selectedText + after + localValue.substring(end);
    
    handleChange(newText);
    
    // Restore cursor position
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + before.length, start + before.length + selectedText.length);
    }, 0);
  };

  // Function to insert text at cursor position (for media uploads)
  const insertAtCursor = (text: string) => {
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (!textarea) {
      // If textarea not found, append to end
      handleChange(localValue + '\n\n' + text);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newText = localValue.substring(0, start) + text + localValue.substring(end);
    
    handleChange(newText);
    
    // Set cursor position after inserted text
    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + text.length, start + text.length);
    }, 0);
  };

  // Expose insertAtCursor method to parent components
  React.useImperativeHandle(React.useRef(), () => ({
    insertAtCursor
  }));

  const toolbarButtons = [
    { icon: Bold, action: () => insertMarkdown('**', '**'), tooltip: 'Bold' },
    { icon: Italic, action: () => insertMarkdown('*', '*'), tooltip: 'Italic' },
    { icon: Link, action: () => insertMarkdown('[', '](url)'), tooltip: 'Link' },
    { icon: List, action: () => insertMarkdown('- '), tooltip: 'List' },
    { icon: Code, action: () => insertMarkdown('`', '`'), tooltip: 'Code' },
    { icon: Image, action: () => insertMarkdown('![alt](', ')'), tooltip: 'Image' },
  ];

  return (
    <div className={`border border-gray-300 dark:border-gray-600 rounded-lg overflow-hidden ${className}`}>
      {/* Toolbar */}
      <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-600">
        <div className="flex items-center space-x-1">
          {toolbarButtons.map(({ icon: Icon, action, tooltip }) => (
            <button
              key={tooltip}
              onClick={action}
              title={tooltip}
              className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors"
            >
              <Icon size={16} />
            </button>
          ))}
        </div>
        
        <div className="flex items-center space-x-2">
          {/* Public Toggle */}
          {onPublicToggle && (
            <button
              onClick={handlePublicToggle}
              className={`flex items-center space-x-2 px-3 py-1 rounded-lg text-sm font-medium transition-colors ${
                localIsPublic
                  ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-400'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
              title={localIsPublic ? 'Visible in public profile' : 'Private update'}
            >
              <Globe size={14} />
              <span>{localIsPublic ? 'Public' : 'Private'}</span>
            </button>
          )}
          
          <div className="flex border border-gray-300 dark:border-gray-600 rounded">
            <button
              onClick={() => setMode('edit')}
              className={`px-3 py-1 text-sm ${mode === 'edit' 
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-400'
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-l`}
            >
              <Edit3 size={14} className="inline mr-1" />
              Edit
            </button>
            <button
              onClick={() => setMode('preview')}
              className={`px-3 py-1 text-sm ${mode === 'preview' 
                ? 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-400' 
                : 'text-gray-600 dark:text-gray-400'
              } hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors rounded-r`}
            >
              <Eye size={14} className="inline mr-1" />
              Preview
            </button>
          </div>
        </div>
      </div>

      {/* Editor/Preview Area */}
      <div className="min-h-[300px]">
        {mode === 'edit' ? (
          <textarea
            id="markdown-textarea"
            value={localValue}
            onChange={(e) => handleChange(e.target.value)}
            placeholder={placeholder}
            className="w-full h-[300px] p-4 bg-white dark:bg-gray-900 text-gray-900 dark:text-white resize-none focus:outline-none font-mono text-sm leading-relaxed"
          />
        ) : (
          <div className="p-4 prose prose-sm max-w-none dark:prose-invert prose-headings:text-gray-900 dark:prose-headings:text-white prose-p:text-gray-700 dark:prose-p:text-gray-300">
            <ReactMarkdown>{localValue || '*Nothing to preview*'}</ReactMarkdown>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 p-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-300 dark:border-gray-600">
        <Button variant="ghost" onClick={onCancel}>
          <X size={16} className="mr-2" />
          Cancel
        </Button>
        <Button onClick={onSave} disabled={!localValue.trim()}>
          <Save size={16} className="mr-2" />
          Save Update
        </Button>
      </div>
    </div>
  );
};

export default MarkdownEditor;