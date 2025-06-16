import React from 'react';
import { Download, ExternalLink, Mail, Linkedin, Github, MapPin, Phone, Award, Briefcase, GraduationCap } from 'lucide-react';
import { Card, CardHeader, CardContent } from '../components/ui/Card';
import Button from '../components/ui/Button';

const Resume: React.FC = () => {
  const contactInfo = {
    name: 'Aniket Mishra',
    title: 'Senior Robotics Engineer & Full Stack Developer',
    email: 'aniket.mishra@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/aniketmishra',
    github: 'https://github.com/aniketmishra'
  };

  const skills = [
    'Python', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
    'ROS/ROS2', 'TensorFlow', 'PyTorch', 'OpenCV', 'PCL', 'MATLAB',
    'Arduino', 'Raspberry Pi', 'Docker', 'Kubernetes', 'AWS', 'Azure',
    'MongoDB', 'PostgreSQL', 'Git', 'Linux', 'Agile/Scrum'
  ];

  const experience = [
    {
      company: 'Autonomous Systems Inc.',
      position: 'Senior Robotics Engineer',
      period: '2022 - Present',
      description: 'Lead development of autonomous navigation systems for healthcare robotics. Implemented sensor fusion algorithms combining LiDAR, radar, and computer vision. Managed cross-functional team of 8 engineers and collaborated with product managers to define technical roadmaps.',
      achievements: [
        'Reduced navigation errors by 40% through advanced sensor fusion techniques',
        'Led successful deployment of 50+ robotic units in healthcare facilities',
        'Mentored 3 junior engineers and established code review processes'
      ]
    },
    {
      company: 'TechFlow Solutions',
      position: 'Full Stack Developer & Robotics Consultant',
      period: '2020 - 2022',
      description: 'Developed web applications for robotics process automation and IoT device management. Built scalable backend systems and responsive frontend interfaces for industrial automation clients.',
      achievements: [
        'Architected RPA dashboard serving 10,000+ daily active users',
        'Reduced client operational costs by 30% through process automation',
        'Implemented real-time monitoring systems for 200+ IoT devices'
      ]
    },
    {
      company: 'Innovation Labs (Startup)',
      position: 'Founding Engineer',
      period: '2019 - 2020',
      description: 'Co-founded startup focused on assistive technology for elderly care. Developed prototype smart walker with fall detection and health monitoring capabilities.',
      achievements: [
        'Built MVP that secured $500K in seed funding',
        'Filed 2 provisional patents for assistive technology innovations',
        'Established partnerships with 3 senior care facilities for pilot testing'
      ]
    }
  ];

  const education = [
    {
      institution: 'Stanford University',
      degree: 'Master of Science in Robotics',
      period: '2017 - 2019',
      details: 'Specialization in Autonomous Systems and Machine Learning. Thesis: "Multi-Modal Sensor Fusion for Robust Object Detection in Dynamic Environments"'
    },
    {
      institution: 'University of California, Berkeley',
      degree: 'Bachelor of Science in Electrical Engineering and Computer Science',
      period: '2013 - 2017',
      details: 'Magna Cum Laude, Phi Beta Kappa. Senior Project: "Swarm Robotics for Environmental Monitoring"'
    }
  ];

  const certifications = [
    'AWS Certified Solutions Architect',
    'ROS Developer Certification',
    'Certified Scrum Master (CSM)',
    'NVIDIA Deep Learning Institute Certificate'
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Resume</h1>
          <p className="text-gray-600 dark:text-gray-400">Professional profile and experience</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download size={16} className="mr-2" />
            Download PDF
          </Button>
          <Button>
            <ExternalLink size={16} className="mr-2" />
            View Online
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sidebar */}
        <div className="space-y-6">
          {/* Contact Info */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Contact</h3>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center mb-6">
                <div className="w-20 h-20 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center mx-auto mb-3">
                  <span className="text-2xl font-bold text-indigo-600 dark:text-indigo-400">AM</span>
                </div>
                <h2 className="text-xl font-bold text-gray-900 dark:text-white">{contactInfo.name}</h2>
                <p className="text-gray-600 dark:text-gray-400 text-sm">{contactInfo.title}</p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Mail size={16} className="text-gray-400" />
                  <a href={`mailto:${contactInfo.email}`} className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    {contactInfo.email}
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Phone size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{contactInfo.phone}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin size={16} className="text-gray-400" />
                  <span className="text-sm text-gray-700 dark:text-gray-300">{contactInfo.location}</span>
                </div>
                <div className="flex items-center space-x-3">
                  <Linkedin size={16} className="text-gray-400" />
                  <a href={contactInfo.linkedin} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    LinkedIn Profile
                  </a>
                </div>
                <div className="flex items-center space-x-3">
                  <Github size={16} className="text-gray-400" />
                  <a href={contactInfo.github} target="_blank" rel="noopener noreferrer" className="text-sm text-indigo-600 dark:text-indigo-400 hover:underline">
                    GitHub Profile
                  </a>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Technical Skills</h3>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
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

          {/* Certifications */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Award size={18} className="mr-2" />
                Certifications
              </h3>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {certifications.map((cert, index) => (
                  <div key={index} className="text-sm text-gray-700 dark:text-gray-300">
                    • {cert}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Professional Summary */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Professional Summary</h3>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 dark:text-gray-300">
                Innovative Senior Robotics Engineer and Full Stack Developer with 5+ years of experience in autonomous systems, 
                sensor fusion, and scalable web applications. Proven track record of leading cross-functional teams, 
                delivering production-ready robotics solutions, and driving technical innovation in healthcare and industrial automation. 
                Passionate about creating accessible technology that improves quality of life and operational efficiency.
              </p>
            </CardContent>
          </Card>

          {/* Experience */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <Briefcase size={18} className="mr-2" />
                Work Experience
              </h3>
            </CardHeader>
            <CardContent className="space-y-6">
              {experience.map((job, index) => (
                <div key={index} className="border-l-2 border-indigo-200 dark:border-indigo-800 pl-4">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2">
                    <h4 className="font-semibold text-gray-900 dark:text-white">{job.position}</h4>
                    <span className="text-sm text-gray-600 dark:text-gray-400">{job.period}</span>
                  </div>
                  <p className="text-indigo-600 dark:text-indigo-400 font-medium mb-2">{job.company}</p>
                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-3">{job.description}</p>
                  <div className="space-y-1">
                    {job.achievements.map((achievement, idx) => (
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
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                <GraduationCap size={18} className="mr-2" />
                Education
              </h3>
            </CardHeader>
            <CardContent className="space-y-4">
              {education.map((edu, index) => (
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

          {/* PDF Viewer Placeholder */}
          <Card>
            <CardHeader>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Resume Document</h3>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-8 text-center border-2 border-dashed border-gray-300 dark:border-gray-600">
                <div className="w-16 h-16 bg-red-100 dark:bg-red-900/50 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <span className="text-red-600 dark:text-red-400 font-bold text-xl">PDF</span>
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Aniket Mishra - Resume.pdf</h4>
                <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                  Complete resume with detailed project descriptions, technical achievements, and references
                </p>
                <div className="flex justify-center space-x-3">
                  <Button variant="outline">
                    <Download size={16} className="mr-2" />
                    Download PDF
                  </Button>
                  <Button>
                    <ExternalLink size={16} className="mr-2" />
                    View Full Screen
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Resume;