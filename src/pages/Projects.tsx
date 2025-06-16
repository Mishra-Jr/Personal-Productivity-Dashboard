import React, { useState, useEffect, useRef } from 'react';
import { Plus, ExternalLink, Github, Eye, Calendar, FolderOpen, MessageSquare, ArrowLeft, Upload } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import MarkdownEditor from '../components/ui/MarkdownEditor';
import Timeline from '../components/ui/Timeline';
import MediaUpload from '../components/ui/MediaUpload';
import MediaGallery from '../components/ui/MediaGallery';
import { useApp } from '../contexts/AppContext';
import { Project, ProjectUpdate, MediaItem } from '../contexts/AppContext';

interface UploadedFile {
  id: string;
  file: File;
  preview: string;
  type: 'image' | 'video';
}

const Projects: React.FC = () => {
  const { state, dispatch } = useApp();
  const { projects, media, isPublicView } = state;
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [showEditor, setShowEditor] = useState(false);
  const [editorContent, setEditorContent] = useState('');
  const [editingUpdate, setEditingUpdate] = useState<ProjectUpdate | null>(null);
  const [showMediaUpload, setShowMediaUpload] = useState(false);
  const [updateIsPublic, setUpdateIsPublic] = useState(false);
  const editorRef = useRef<any>(null);

  // Filter projects based on public view mode
  const visibleProjects = isPublicView 
    ? projects.filter(project => project.isPublic)
    : projects;

  // Load draft from localStorage when editor opens
  useEffect(() => {
    if (showEditor && selectedProject && !editingUpdate) {
      const draftKey = `project-${selectedProject.id}-draft`;
      const savedDraft = localStorage.getItem(draftKey);
      if (savedDraft) {
        setEditorContent(savedDraft);
      }
    }
  }, [showEditor, selectedProject, editingUpdate]);

  // Save draft to localStorage as user types
  useEffect(() => {
    if (showEditor && selectedProject && !editingUpdate && editorContent) {
      const draftKey = `project-${selectedProject.id}-draft`;
      localStorage.setItem(draftKey, editorContent);
    }
  }, [editorContent, showEditor, selectedProject, editingUpdate]);

  const getStatusColor = (status: Project['status']) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-400';
      case 'Completed':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-400';
      case 'On Hold':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/50 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-600 dark:text-gray-300';
    }
  };

  const handleSaveUpdate = () => {
    if (!selectedProject || !editorContent.trim()) return;

    if (editingUpdate) {
      // Update existing update
      const updatedProject = {
        ...selectedProject,
        projectUpdates: selectedProject.projectUpdates.map(update =>
          update.id === editingUpdate.id
            ? { ...update, content: editorContent, timestamp: new Date(), isPublic: updateIsPublic }
            : update
        )
      };
      dispatch({ type: 'UPDATE_PROJECT', payload: updatedProject });
      setEditingUpdate(null);
    } else {
      // Add new update
      const newUpdate: ProjectUpdate = {
        id: `update-${Date.now()}`,
        content: editorContent,
        timestamp: new Date(),
        author: 'Aniket Mishra',
        isPublic: updateIsPublic
      };
      
      dispatch({
        type: 'ADD_PROJECT_UPDATE',
        payload: { projectId: selectedProject.id, update: newUpdate }
      });

      // Clear draft from localStorage
      const draftKey = `project-${selectedProject.id}-draft`;
      localStorage.removeItem(draftKey);
    }

    setEditorContent('');
    setShowEditor(false);
    setUpdateIsPublic(false);
  };

  const handleCancelEdit = () => {
    if (!editingUpdate) {
      // Save as draft when canceling new update
      if (selectedProject && editorContent.trim()) {
        const draftKey = `project-${selectedProject.id}-draft`;
        localStorage.setItem(draftKey, editorContent);
      }
    }
    
    setEditorContent('');
    setShowEditor(false);
    setEditingUpdate(null);
    setUpdateIsPublic(false);
  };

  const handleDeleteUpdate = (updateId: string) => {
    if (!selectedProject) return;
    
    if (confirm('Are you sure you want to delete this update?')) {
      dispatch({
        type: 'DELETE_PROJECT_UPDATE',
        payload: { projectId: selectedProject.id, updateId }
      });
    }
  };

  const handleEditUpdate = (update: ProjectUpdate) => {
    setEditingUpdate(update);
    setEditorContent(update.content);
    setUpdateIsPublic(update.isPublic || false);
    setShowEditor(true);
  };

  const startNewUpdate = () => {
    setEditingUpdate(null);
    setEditorContent('');
    setUpdateIsPublic(false);
    setShowEditor(true);
  };

  const handleFilesUploaded = (files: UploadedFile[]) => {
    if (!selectedProject) return;

    files.forEach(file => {
      const mediaItem: MediaItem = {
        id: `media-${Date.now()}-${Math.random()}`,
        name: file.file.name,
        url: file.preview, // In a real app, this would be uploaded to a server
        type: file.type,
        projectId: selectedProject.id,
        uploadedAt: new Date()
      };

      dispatch({ type: 'ADD_MEDIA', payload: mediaItem });
    });
  };

  const handleInsertToMarkdown = (markdownText: string) => {
    // Insert the markdown text into the editor
    const textarea = document.getElementById('markdown-textarea') as HTMLTextAreaElement;
    if (textarea) {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const newContent = editorContent.substring(0, start) + '\n\n' + markdownText + '\n\n' + editorContent.substring(end);
      setEditorContent(newContent);
      
      // Focus and set cursor position
      setTimeout(() => {
        textarea.focus();
        textarea.setSelectionRange(start + markdownText.length + 4, start + markdownText.length + 4);
      }, 0);
    } else {
      // Fallback: append to end
      setEditorContent(prev => prev + '\n\n' + markdownText + '\n\n');
    }
  };

  const handleDeleteMedia = (mediaId: string) => {
    if (confirm('Are you sure you want to delete this media item?')) {
      dispatch({ type: 'DELETE_MEDIA', payload: mediaId });
    }
  };

  // Update selectedProject when projects change
  useEffect(() => {
    if (selectedProject) {
      const updatedProject = projects.find(p => p.id === selectedProject.id);
      if (updatedProject) {
        setSelectedProject(updatedProject);
      }
    }
  }, [projects, selectedProject]);

  // Get media for selected project
  const projectMedia = selectedProject 
    ? media.filter(m => m.projectId === selectedProject.id)
    : [];

  // Filter updates based on public view mode
  const getVisibleUpdates = (project: Project) => {
    if (isPublicView) {
      return project.projectUpdates.filter(update => update.isPublic);
    }
    return project.projectUpdates;
  };

  if (selectedProject) {
    const visibleUpdates = getVisibleUpdates(selectedProject);

    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => setSelectedProject(null)}>
            <ArrowLeft size={16} className="mr-2" />
            Back to Projects
          </Button>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{selectedProject.name}</h1>
                <p className="text-gray-600 dark:text-gray-400 mt-2">{selectedProject.description}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedProject.status)}`}>
                {selectedProject.status}
              </span>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Tools */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Technologies Used</h3>
              <div className="flex flex-wrap gap-2">
                {selectedProject.tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400 text-sm rounded-full"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Links */}
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Links</h3>
              <div className="flex flex-wrap gap-3">
                {selectedProject.links.github && (
                  <a
                    href={selectedProject.links.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors"
                  >
                    <Github size={16} />
                    <span>GitHub</span>
                  </a>
                )}
                {selectedProject.links.demo && (
                  <a
                    href={selectedProject.links.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                  >
                    <ExternalLink size={16} />
                    <span>Live Demo</span>
                  </a>
                )}
              </div>
            </div>

            {/* Project Info */}
            <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400">
              <div className="flex items-center space-x-1">
                <Calendar size={16} />
                <span>Created: {selectedProject.createdAt.toLocaleDateString()}</span>
              </div>
              <div className="flex items-center space-x-1">
                <MessageSquare size={16} />
                <span>{visibleUpdates.length} {isPublicView ? 'public ' : ''}updates</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Media Upload Section - Hidden in public view */}
        {!isPublicView && showMediaUpload && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Upload Media</h2>
              <Button variant="ghost" onClick={() => setShowMediaUpload(false)}>
                <ArrowLeft size={16} className="mr-2" />
                Back
              </Button>
            </div>
            <MediaUpload
              onFilesUploaded={handleFilesUploaded}
              onInsertToMarkdown={showEditor ? handleInsertToMarkdown : undefined}
            />
          </div>
        )}

        {/* Project Media Gallery */}
        {!showMediaUpload && projectMedia.length > 0 && (
          <MediaGallery
            media={projectMedia}
            onDelete={!isPublicView ? handleDeleteMedia : undefined}
          />
        )}

        {/* Project Updates Section */}
        {!showMediaUpload && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                Project Updates {isPublicView && '(Public)'}
              </h2>
              {!isPublicView && (
                <div className="flex space-x-3">
                  {!showEditor && (
                    <>
                      <Button variant="outline" onClick={() => setShowMediaUpload(true)}>
                        <Upload size={16} className="mr-2" />
                        Upload Media
                      </Button>
                      <Button onClick={startNewUpdate}>
                        <Plus size={16} className="mr-2" />
                        Add Update
                      </Button>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Markdown Editor - Hidden in public view */}
            {!isPublicView && showEditor && (
              <div className="space-y-4">
                <MarkdownEditor
                  ref={editorRef}
                  value={editorContent}
                  onChange={setEditorContent}
                  onSave={handleSaveUpdate}
                  onCancel={handleCancelEdit}
                  placeholder={editingUpdate ? "Edit your update..." : "Document your progress, share insights, or add project notes..."}
                  isPublic={updateIsPublic}
                  onPublicToggle={setUpdateIsPublic}
                />
                
                {/* Quick Media Upload for Editor */}
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gray-50 dark:bg-gray-800">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Quick Media Upload</h4>
                  <MediaUpload
                    onFilesUploaded={handleFilesUploaded}
                    onInsertToMarkdown={handleInsertToMarkdown}
                    className="border-0"
                  />
                </div>
              </div>
            )}

            {/* Timeline */}
            <Timeline
              updates={visibleUpdates}
              onDelete={!isPublicView ? handleDeleteUpdate : undefined}
              onEdit={!isPublicView ? handleEditUpdate : undefined}
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Projects {isPublicView && '(Public View)'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {isPublicView ? 'Public projects and updates' : 'Manage your development projects'}
          </p>
        </div>
        {!isPublicView && (
          <Button>
            <Plus size={16} className="mr-2" />
            New Project
          </Button>
        )}
      </div>

      {/* Projects Grid */}
      {visibleProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProjects.map((project) => {
            const visibleUpdates = getVisibleUpdates(project);
            
            return (
              <Card key={project.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(project.status)}`}>
                      {project.status}
                    </span>
                  </div>

                  <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                    {project.description}
                  </p>

                  <div className="space-y-4">
                    {/* Tools */}
                    <div className="flex flex-wrap gap-1">
                      {project.tools.slice(0, 3).map((tool) => (
                        <span
                          key={tool}
                          className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded"
                        >
                          {tool}
                        </span>
                      ))}
                      {project.tools.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-xs rounded">
                          +{project.tools.length - 3} more
                        </span>
                      )}
                    </div>

                    {/* Updates count */}
                    <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                      <div className="flex items-center space-x-1">
                        <MessageSquare size={14} />
                        <span>
                          {visibleUpdates.length} {isPublicView ? 'public ' : ''}update{visibleUpdates.length !== 1 ? 's' : ''}
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Calendar size={14} />
                        <span>{project.createdAt.toLocaleDateString()}</span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex space-x-2">
                        {project.links.github && (
                          <a
                            href={project.links.github}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <Github size={16} />
                          </a>
                        )}
                        {project.links.demo && (
                          <a
                            href={project.links.demo}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <ExternalLink size={16} />
                          </a>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedProject(project)}
                      >
                        <Eye size={14} className="mr-1" />
                        View Details
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      ) : (
        <Card>
          <CardContent className="text-center py-12">
            <FolderOpen size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {isPublicView ? 'No public projects' : 'No projects yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {isPublicView 
                ? 'Public projects will appear here when available'
                : 'Get started by creating your first project'
              }
            </p>
            {!isPublicView && (
              <Button>
                <Plus size={16} className="mr-2" />
                Create Project
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Projects;