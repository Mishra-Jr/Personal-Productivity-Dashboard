import React, { useState, useEffect } from 'react';
import { Mail, Linkedin, Github, MapPin, Phone, ExternalLink, Calendar, Star, Award, Briefcase, GraduationCap, Code, Share2, Copy, Check, RefreshCw, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';
import { useApp } from '../contexts/AppContext';

const RecruiterView: React.FC = () => {
  const { state } = useApp();
  const { projects, professionalProfile } = state;
  const [copiedUrl, setCopiedUrl] = useState(false);
  const [currentThought, setCurrentThought] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [thoughtVisible, setThoughtVisible] = useState(true);

  // Professional thoughts and insights
  const thoughtsOfTheDay = [
    "Innovation distinguishes between a leader and a follower. Every line of code is an opportunity to create something meaningful.",
    "The best robotics solutions are invisible to the user – they just work, seamlessly integrating into daily life.",
    "In autonomous systems, reliability isn't just a feature, it's a responsibility. Lives depend on the code we write.",
    "Cross-functional collaboration turns good engineers into great problem solvers. Technology is only as strong as the team behind it.",
    "The future of healthcare lies at the intersection of AI, robotics, and human empathy. We're building tools that care.",
    "Every bug is a teacher, every successful deployment is a celebration. The journey of engineering is one of continuous learning.",
    "Accessible technology isn't just good design – it's a moral imperative. Innovation should lift everyone up.",
    "The most elegant code is not the most complex, but the most understandable. Clarity is kindness to your future self.",
    "In robotics, we don't just build machines – we create companions, assistants, and extensions of human capability.",
    "Open source isn't just about sharing code, it's about sharing knowledge and accelerating human progress together."
  ];

  // Filter public projects and their public updates
  const publicProjects = projects.filter(project => project.isPublic);
  
  const getStatusColor = (status: string) => {
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

  // Initialize with a random thought
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * thoughtsOfTheDay.length);
    setCurrentThought(randomIndex);
  }, []);

  const refreshThought = () => {
    if (isRefreshing) return;
    
    setIsRefreshing(true);
    setThoughtVisible(false);
    
    setTimeout(() => {
      let newThought;
      do {
        newThought = Math.floor(Math.random() * thoughtsOfTheDay.length);
      } while (newThought === currentThought && thoughtsOfTheDay.length > 1);
      
      setCurrentThought(newThought);
      setThoughtVisible(true);
      setIsRefreshing(false);
    }, 300);
  };

  const handleShareProfile = async () => {
    const profileUrl = `${window.location.origin}/recruiter`;
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${professionalProfile.name} - Professional Profile`,
          text: professionalProfile.summary,
          url: profileUrl,
        });
      } catch (error) {
        // Fallback to copy
        copyToClipboard(profileUrl);
      }
    } else {
      copyToClipboard(profileUrl);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedUrl(true);
      setTimeout(() => setCopiedUrl(false), 2000);
    } catch (error) {
      console.error('Failed to copy to clipboard:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Enhanced Hero Section */}
      <div className="bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 text-white relative overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 bg-black/10">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), 
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)`
          }} />
        </div>
        
        <div className="relative max-w-6xl mx-auto px-6 py-20">
          <div className="flex flex-col lg:flex-row items-center lg:items-start gap-12">
            {/* Enhanced Profile Avatar */}
            <div className="relative group">
              <div className="w-40 h-40 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-4 border-white/30 shadow-2xl transition-transform duration-300 group-hover:scale-105">
                <div className="w-32 h-32 bg-gradient-to-br from-white/30 to-white/10 rounded-full flex items-center justify-center">
                  <span className="text-5xl font-bold text-white drop-shadow-lg">
                    {professionalProfile.name.split(' ').map(n => n[0]).join('')}
                  </span>
                </div>
              </div>
              {/* Floating indicator */}
              <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center shadow-lg">
                <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
              </div>
            </div>
            
            {/* Enhanced Profile Info */}
            <div className="flex-1 text-center lg:text-left space-y-6">
              {/* Greeting and Name */}
              <div className="space-y-2">
                <p className="text-lg text-indigo-100 font-medium">Hello, I'm</p>
                <h1 className="text-5xl lg:text-6xl font-bold mb-2 bg-gradient-to-r from-white to-indigo-100 bg-clip-text text-transparent">
                  {professionalProfile.name}
                </h1>
                <p className="text-2xl lg:text-3xl text-indigo-100 font-light">
                  {professionalProfile.title}
                </p>
                {/* Professional Subtitle */}
                <p className="text-lg text-indigo-200 font-medium mt-4">
                  Transforming Ideas into Intelligent Solutions
                </p>
              </div>
              
              {/* Summary */}
              <p className="text-lg text-indigo-50 leading-relaxed max-w-3xl">
                {professionalProfile.summary}
              </p>
              
              {/* Thought of the Day */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 border border-white/20 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-2">
                    <Lightbulb size={20} className="text-yellow-300" />
                    <h3 className="font-semibold text-white">Thought of the Day</h3>
                  </div>
                  <button
                    onClick={refreshThought}
                    disabled={isRefreshing}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                    title="Get new thought"
                  >
                    <RefreshCw 
                      size={16} 
                      className={`text-indigo-200 transition-transform duration-300 ${
                        isRefreshing ? 'animate-spin' : 'hover:rotate-180'
                      }`} 
                    />
                  </button>
                </div>
                <blockquote 
                  className={`text-indigo-50 italic leading-relaxed transition-all duration-300 ${
                    thoughtVisible ? 'opacity-100 transform translate-y-0' : 'opacity-0 transform translate-y-2'
                  }`}
                >
                  "{thoughtsOfTheDay[currentThought]}"
                </blockquote>
              </div>
              
              {/* Contact Buttons */}
              <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
                <a
                  href={`mailto:${professionalProfile.email}?subject=Professional Opportunity`}
                  className="group flex items-center space-x-3 px-8 py-4 bg-white text-indigo-600 rounded-xl hover:bg-indigo-50 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Mail size={20} className="group-hover:scale-110 transition-transform" />
                  <span>Let's Connect</span>
                </a>
                <a
                  href={professionalProfile.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 px-8 py-4 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Linkedin size={20} className="group-hover:scale-110 transition-transform" />
                  <span>LinkedIn</span>
                </a>
                <a
                  href={professionalProfile.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex items-center space-x-3 px-8 py-4 bg-gray-900 text-white rounded-xl hover:bg-gray-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Github size={20} className="group-hover:scale-110 transition-transform" />
                  <span>GitHub</span>
                </a>
                <Button
                  variant="outline"
                  onClick={handleShareProfile}
                  className="group bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200 px-8 py-4 font-semibold"
                >
                  {copiedUrl ? (
                    <>
                      <Check size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="ml-3">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Share2 size={20} className="group-hover:scale-110 transition-transform" />
                      <span className="ml-3">Share Profile</span>
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Info */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact Information</h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${professionalProfile.email}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    {professionalProfile.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{professionalProfile.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{professionalProfile.location}</span>
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Code size={18} className="mr-2" />
                  Technical Skills
                </h3>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {professionalProfile.skills.map((skill) => (
                    <span
                      key={skill}
                      className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/50 text-indigo-800 dark:text-indigo-400 text-sm rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Star size={18} className="mr-2" />
                  Quick Stats
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Public Projects</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{publicProjects.length}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Years Experience</span>
                  <span className="font-semibold text-gray-900 dark:text-white">5+</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600 dark:text-gray-400">Specialization</span>
                  <span className="font-semibold text-gray-900 dark:text-white">Robotics & AI</span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Experience */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <Briefcase size={20} className="mr-2" />
                  Professional Experience
                </h3>
              </CardHeader>
              <CardContent className="space-y-6">
                {professionalProfile.experience.map((job, index) => (
                  <div key={index} className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{job.position}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{job.period}</span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{job.company}</p>
                    <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{job.description}</p>
                    <div className="space-y-1">
                      {job.achievements.slice(0, 2).map((achievement, idx) => (
                        <div key={idx} className="text-sm text-gray-600 dark:text-gray-400">
                          • {achievement}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Education */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                  <GraduationCap size={20} className="mr-2" />
                  Education
                </h3>
              </CardHeader>
              <CardContent className="space-y-4">
                {professionalProfile.education.map((edu, index) => (
                  <div key={index}>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-1">
                      <h4 className="font-semibold text-gray-900 dark:text-white">{edu.degree}</h4>
                      <span className="text-sm text-gray-600 dark:text-gray-400">{edu.period}</span>
                    </div>
                    <p className="text-indigo-600 dark:text-indigo-400 mb-2">{edu.institution}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">{edu.details}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Featured Projects */}
            <Card>
              <CardHeader>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Featured Projects</h3>
              </CardHeader>
              <CardContent>
                {publicProjects.length > 0 ? (
                  <div className="space-y-6">
                    {publicProjects.map((project) => (
                      <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                        <div className="flex items-start justify-between mb-4">
                          <h4 className="text-lg font-semibold text-gray-900 dark:text-white">{project.name}</h4>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </div>

                        <p className="text-gray-600 dark:text-gray-400 mb-4">{project.description}</p>

                        {/* Technologies */}
                        <div className="mb-4">
                          <h5 className="font-medium text-gray-900 dark:text-white mb-2">Technologies Used</h5>
                          <div className="flex flex-wrap gap-2">
                            {project.tools.map((tool) => (
                              <span
                                key={tool}
                                className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded"
                              >
                                {tool}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Links */}
                        <div className="flex flex-wrap gap-3 mb-4">
                          {project.links.github && (
                            <a
                              href={project.links.github}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors text-sm"
                            >
                              <Github size={14} />
                              <span>Code</span>
                            </a>
                          )}
                          {project.links.demo && (
                            <a
                              href={project.links.demo}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 px-3 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm"
                            >
                              <ExternalLink size={14} />
                              <span>Demo</span>
                            </a>
                          )}
                        </div>

                        {/* Public Updates */}
                        {project.projectUpdates.filter(update => update.isPublic).length > 0 && (
                          <div className="border-t border-gray-200 dark:border-gray-700 pt-4">
                            <h5 className="font-medium text-gray-900 dark:text-white mb-3">Recent Updates</h5>
                            <div className="space-y-4">
                              {project.projectUpdates
                                .filter(update => update.isPublic)
                                .slice(0, 1)
                                .map((update) => {
                                  // Ensure content is a valid string
                                  const content = String(update.content || '');
                                  const truncatedContent = content.slice(0, 300) + (content.length > 300 ? '...' : '');
                                  
                                  return (
                                    <div key={update.id} className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                                      <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm text-gray-600 dark:text-gray-400">
                                          {update.timestamp.toLocaleDateString()}
                                        </span>
                                      </div>
                                      {truncatedContent && (
                                        <div className="prose prose-sm max-w-none dark:prose-invert">
                                          <ReactMarkdown>{truncatedContent}</ReactMarkdown>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        )}

                        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mt-4">
                          <Calendar size={14} className="mr-1" />
                          <span>Started {project.createdAt.toLocaleDateString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Award size={48} className="mx-auto text-gray-400 mb-4" />
                    <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No Public Projects</h4>
                    <p className="text-gray-600 dark:text-gray-400">
                      Public projects will be displayed here when available.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Call to Action */}
            <Card>
              <CardContent className="text-center py-8">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                  Interested in Working Together?
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  I'm always open to discussing new opportunities and exciting projects.
                </p>
                <div className="flex flex-wrap justify-center gap-4">
                  <a
                    href={`mailto:${professionalProfile.email}?subject=Opportunity Discussion`}
                    className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors font-medium"
                  >
                    <Mail size={20} />
                    <span>Get in Touch</span>
                  </a>
                  <a
                    href={professionalProfile.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-2 px-6 py-3 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors font-medium"
                  >
                    <Linkedin size={20} />
                    <span>Connect on LinkedIn</span>
                  </a>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecruiterView;