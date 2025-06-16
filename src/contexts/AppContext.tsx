import React, { createContext, useContext, useReducer, ReactNode } from 'react';

// Types
export interface ProjectUpdate {
  id: string;
  content: string;
  timestamp: Date;
  author: string;
  isPublic?: boolean; // New field for public visibility
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'Active' | 'Completed' | 'On Hold';
  tools: string[];
  updates: string;
  projectUpdates: ProjectUpdate[];
  links: {
    github?: string;
    demo?: string;
  };
  images: string[];
  createdAt: Date;
  isPublic?: boolean; // New field for public visibility
}

export interface Note {
  id: string;
  title: string;
  content: string;
  tags: ('Idea' | 'Task' | 'Journal' | 'Reflection')[];
  createdAt: Date;
  updatedAt: Date;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'video';
  projectId?: string;
  uploadedAt: Date;
}

export interface DailyTask {
  id: string;
  name: string;
  dueTime?: string;
  priority: 'High' | 'Medium' | 'Low';
  completed: boolean;
  missed: boolean; // New field for missed tasks
  date: string; // YYYY-MM-DD format
  createdAt: Date;
  completedAt?: Date;
  missedAt?: Date; // New field for when task was marked as missed
}

export interface WeeklyGoals {
  id: string;
  weekStartDate: string; // YYYY-MM-DD format (Monday)
  goals: {
    [key: string]: string[]; // date -> array of goal descriptions
  };
  createdAt: Date;
}

export interface ProductivityScore {
  totalScore: number;
  lastUpdated: Date;
  history: Array<{
    date: string;
    change: number;
    reason: string;
    taskId?: string;
  }>;
}

export interface LinkedInPost {
  id: string;
  title: string;
  summary: string;
  postUrl: string;
  publishedDate: Date;
  tags: ('Project' | 'Career Update' | 'Networking' | 'Industry Insight' | 'Achievement' | 'Learning')[];
  engagement?: {
    likes?: number;
    comments?: number;
    shares?: number;
  };
  createdAt: Date;
}

export interface LinkedInProfile {
  profileUrl: string;
  name: string;
  headline: string;
  lastUpdated: Date;
}

export interface FileItem {
  id: string;
  name: string;
  originalName: string;
  url: string;
  type: string; // MIME type
  size: number;
  category: 'Certificate' | 'Resume Update' | 'Project Media' | 'Achievement' | 'Other';
  description?: string;
  projectId?: string; // For Project Media category
  isPublic: boolean;
  uploadedAt: Date;
  tags: string[];
}

export interface ProfessionalProfile {
  name: string;
  title: string;
  summary: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  skills: string[];
  experience: Array<{
    company: string;
    position: string;
    period: string;
    description: string;
    achievements: string[];
  }>;
  education: Array<{
    institution: string;
    degree: string;
    period: string;
    details: string;
  }>;
  certifications: string[];
}

interface AppState {
  projects: Project[];
  notes: Note[];
  media: MediaItem[];
  dailyTasks: DailyTask[];
  weeklyGoals: WeeklyGoals[];
  productivityScore: ProductivityScore;
  linkedInPosts: LinkedInPost[];
  linkedInProfile: LinkedInProfile;
  files: FileItem[];
  professionalProfile: ProfessionalProfile;
  isPublicView: boolean; // New field for public view toggle
  stats: {
    tasksCompleted: number;
    projectCount: number;
  };
}

type AppAction =
  | { type: 'ADD_PROJECT'; payload: Project }
  | { type: 'UPDATE_PROJECT'; payload: Project }
  | { type: 'DELETE_PROJECT'; payload: string }
  | { type: 'ADD_PROJECT_UPDATE'; payload: { projectId: string; update: ProjectUpdate } }
  | { type: 'DELETE_PROJECT_UPDATE'; payload: { projectId: string; updateId: string } }
  | { type: 'ADD_NOTE'; payload: Note }
  | { type: 'UPDATE_NOTE'; payload: Note }
  | { type: 'DELETE_NOTE'; payload: string }
  | { type: 'ADD_MEDIA'; payload: MediaItem }
  | { type: 'DELETE_MEDIA'; payload: string }
  | { type: 'ADD_DAILY_TASK'; payload: DailyTask }
  | { type: 'UPDATE_DAILY_TASK'; payload: DailyTask }
  | { type: 'DELETE_DAILY_TASK'; payload: string }
  | { type: 'TOGGLE_TASK_COMPLETION'; payload: string }
  | { type: 'MARK_TASK_MISSED'; payload: string }
  | { type: 'MARK_ALL_COMPLETE'; payload: string } // date
  | { type: 'ADD_WEEKLY_GOALS'; payload: WeeklyGoals }
  | { type: 'UPDATE_WEEKLY_GOALS'; payload: WeeklyGoals }
  | { type: 'UPDATE_PRODUCTIVITY_SCORE'; payload: { change: number; reason: string; taskId?: string } }
  | { type: 'ADD_LINKEDIN_POST'; payload: LinkedInPost }
  | { type: 'UPDATE_LINKEDIN_POST'; payload: LinkedInPost }
  | { type: 'DELETE_LINKEDIN_POST'; payload: string }
  | { type: 'UPDATE_LINKEDIN_PROFILE'; payload: LinkedInProfile }
  | { type: 'ADD_FILE'; payload: FileItem }
  | { type: 'UPDATE_FILE'; payload: FileItem }
  | { type: 'DELETE_FILE'; payload: string }
  | { type: 'UPDATE_PROFESSIONAL_PROFILE'; payload: ProfessionalProfile }
  | { type: 'TOGGLE_PUBLIC_VIEW'; payload: boolean }
  | { type: 'UPDATE_STATS'; payload: Partial<AppState['stats']> };

const initialState: AppState = {
  projects: [
    {
      id: '1',
      name: 'Smart Walker for Elderly',
      description: 'AI-powered mobility assistance device with fall detection, GPS tracking, and health monitoring capabilities for elderly users.',
      status: 'Active',
      tools: ['Arduino', 'Python', 'TensorFlow', 'IoT Sensors', 'React Native', 'Firebase'],
      updates: 'Currently integrating machine learning algorithms for gait analysis and fall prediction. The prototype hardware is complete and we\'re now focusing on the mobile app interface. Beta testing with local senior centers scheduled for next month.',
      projectUpdates: [
        {
          id: 'update-1',
          content: '# Initial Prototype Complete 🎉\n\nSuccessfully completed the first working prototype of the Smart Walker! Key achievements:\n\n## Hardware Components\n- ✅ Integrated LiDAR sensor for obstacle detection\n- ✅ IMU sensors for gait analysis\n- ✅ GPS module for location tracking\n- ✅ Emergency button with cellular connectivity\n\n## Software Features\n- Fall detection algorithm with 92% accuracy\n- Real-time health monitoring dashboard\n- Mobile app for family members\n\n## Next Steps\n1. Conduct user testing with 10 participants\n2. Refine the machine learning model\n3. Improve battery life (currently 8 hours)\n\n**Demo video:** [Smart Walker in Action](https://example.com/demo)\n\n*Excited to move to the next phase!*',
          timestamp: new Date('2024-01-20T10:30:00'),
          author: 'Aniket Mishra',
          isPublic: true
        },
        {
          id: 'update-2',
          content: '## User Testing Results 📊\n\nCompleted first round of user testing with 10 elderly participants at Sunset Senior Center.\n\n### Key Findings:\n- **Positive:** 9/10 users felt more confident walking\n- **Concern:** Handle height needs adjustment for shorter users\n- **Feature Request:** Voice commands for emergency situations\n\n### Technical Improvements:\n```python\n# Updated fall detection algorithm\ndef detect_fall(imu_data, threshold=0.8):\n    acceleration = calculate_acceleration(imu_data)\n    if acceleration > threshold:\n        trigger_alert()\n        return True\n    return False\n```\n\n### Action Items:\n- [ ] Implement adjustable handle mechanism\n- [ ] Add voice recognition module\n- [ ] Reduce false positive rate to <5%\n\nScheduling follow-up testing for next week.',
          timestamp: new Date('2024-01-15T14:15:00'),
          author: 'Aniket Mishra',
          isPublic: true
        }
      ],
      links: {
        github: 'https://github.com/aniketmishra/smart-walker',
        demo: 'https://smart-walker-demo.com'
      },
      images: [],
      createdAt: new Date('2024-01-15'),
      isPublic: true
    },
    {
      id: '2',
      name: 'Sensor Fusion with LiDAR + Radar',
      description: 'Advanced sensor fusion system combining LiDAR and radar data for autonomous vehicle perception and obstacle detection.',
      status: 'Completed',
      tools: ['C++', 'ROS2', 'OpenCV', 'PCL', 'Kalman Filters', 'MATLAB'],
      updates: 'Project successfully completed with 95% accuracy in object detection and tracking. The system can reliably detect and classify objects up to 200 meters in various weather conditions. Documentation and research paper published.',
      projectUpdates: [
        {
          id: 'update-3',
          content: '# Project Completion & Results 🏆\n\n## Final Performance Metrics\n- **Object Detection Accuracy:** 95.2%\n- **Range:** 200+ meters in clear conditions\n- **Weather Performance:** 87% accuracy in rain/fog\n- **Processing Speed:** 30 FPS real-time\n\n## Technical Achievements\n\n### Sensor Fusion Algorithm\nImplemented Extended Kalman Filter for optimal sensor data fusion:\n\n```cpp\nclass SensorFusion {\npublic:\n    void updateLiDAR(const PointCloud& cloud);\n    void updateRadar(const RadarData& data);\n    ObjectList getTrackedObjects();\nprivate:\n    ExtendedKalmanFilter ekf_;\n    ObjectTracker tracker_;\n};\n```\n\n### Key Innovations\n1. **Multi-modal tracking** - Combines geometric and velocity data\n2. **Weather adaptation** - Dynamic threshold adjustment\n3. **Real-time processing** - Optimized for automotive requirements\n\n## Publications\n- Paper accepted at ICRA 2024: "Robust Multi-Modal Sensor Fusion for Autonomous Vehicles"\n- Patent filed: US Application #18/123,456\n\n**Status: Project Complete ✅**',
          timestamp: new Date('2023-12-01T16:45:00'),
          author: 'Aniket Mishra',
          isPublic: true
        }
      ],
      links: {
        github: 'https://github.com/aniketmishra/lidar-radar-fusion',
        demo: 'https://sensor-fusion-demo.com'
      },
      images: [],
      createdAt: new Date('2023-08-10'),
      isPublic: true
    },
    {
      id: '3',
      name: 'Robotics Process Automation Dashboard',
      description: 'Comprehensive RPA management platform for monitoring, scheduling, and analyzing automated business processes across enterprise systems.',
      status: 'On Hold',
      tools: ['React', 'Node.js', 'MongoDB', 'Docker', 'UiPath', 'Power BI', 'Azure'],
      updates: 'Development paused due to client requirements change. Core functionality for bot monitoring and scheduling is complete. Waiting for stakeholder approval on new feature specifications before resuming development.',
      projectUpdates: [
        {
          id: 'update-4',
          content: '## Development Pause - Stakeholder Review 🔄\n\n### Current Status\nDevelopment temporarily paused pending stakeholder review of new requirements.\n\n### Completed Features\n- ✅ Real-time bot monitoring dashboard\n- ✅ Automated scheduling system\n- ✅ Performance analytics and reporting\n- ✅ User management and permissions\n- ✅ Integration with UiPath Orchestrator\n\n### Architecture Overview\n```mermaid\ngraph TD\n    A[React Frontend] --> B[Node.js API]\n    B --> C[MongoDB]\n    B --> D[UiPath Orchestrator]\n    B --> E[Azure Service Bus]\n```\n\n### Pending Requirements\n1. **Enhanced Security:** SSO integration with Active Directory\n2. **Scalability:** Support for 1000+ concurrent bots\n3. **Compliance:** SOX audit trail requirements\n\n### Next Steps\n- Waiting for stakeholder meeting (scheduled for next week)\n- Preparing technical feasibility analysis\n- Updating project timeline based on new scope\n\n*Will resume development once requirements are finalized.*',
          timestamp: new Date('2023-12-15T11:20:00'),
          author: 'Aniket Mishra',
          isPublic: false
        }
      ],
      links: {
        github: 'https://github.com/aniketmishra/rpa-dashboard'
      },
      images: [],
      createdAt: new Date('2023-11-20'),
      isPublic: false
    }
  ],
  notes: [
    {
      id: '1',
      title: 'AI Integration Ideas for Healthcare',
      content: 'Exploring opportunities to integrate AI into healthcare workflows:\n\n• Predictive analytics for patient outcomes\n• Computer vision for medical imaging analysis\n• Natural language processing for clinical documentation\n• IoT sensors for continuous patient monitoring\n\nPotential partnerships with local hospitals and research institutions. Need to research HIPAA compliance requirements and data privacy regulations.',
      tags: ['Idea'],
      createdAt: new Date('2024-01-05'),
      updatedAt: new Date('2024-01-05')
    },
    {
      id: '2',
      title: 'Weekly Sprint Planning - Smart Walker Project',
      content: 'Tasks for this week:\n\n✅ Complete sensor calibration module\n✅ Implement basic fall detection algorithm\n🔄 Design mobile app wireframes\n📋 Set up user testing protocols\n📋 Order additional hardware components\n📋 Schedule meeting with healthcare consultants\n\nBlockers: Waiting for approval on user study ethics review. Need to finalize hardware specifications before next prototype iteration.',
      tags: ['Task'],
      createdAt: new Date('2024-01-08'),
      updatedAt: new Date('2024-01-10')
    },
    {
      id: '3',
      title: 'Reflections on Career Growth and Technical Leadership',
      content: 'Been thinking about my journey from individual contributor to technical lead over the past year. Key learnings:\n\n• Communication is just as important as technical skills\n• Mentoring junior developers has improved my own understanding\n• Cross-functional collaboration requires patience and empathy\n• Documentation and knowledge sharing prevent bottlenecks\n\nAreas for improvement: Need to get better at estimating project timelines and managing stakeholder expectations. Should invest more time in learning about product strategy and business metrics.',
      tags: ['Reflection'],
      createdAt: new Date('2024-01-03'),
      updatedAt: new Date('2024-01-03')
    },
    {
      id: '4',
      title: 'Conference Talk Proposal: "Building Accessible Robotics"',
      content: 'Outline for potential conference presentation:\n\n1. Introduction to accessibility in robotics\n2. Case study: Smart Walker project\n3. Design principles for inclusive technology\n4. Technical challenges and solutions\n5. User feedback and iteration process\n6. Future directions and opportunities\n\nTarget conferences: RoboCup, ICRA, or local tech meetups. Need to prepare demo video and slides. Deadline for submissions is usually 3-4 months in advance.',
      tags: ['Idea', 'Task'],
      createdAt: new Date('2024-01-12'),
      updatedAt: new Date('2024-01-12')
    }
  ],
  media: [
    {
      id: '1',
      name: 'Smart Walker Prototype v1',
      url: 'https://images.pexels.com/photos/8566473/pexels-photo-8566473.jpeg',
      type: 'image',
      projectId: '1',
      uploadedAt: new Date('2024-01-16')
    },
    {
      id: '2',
      name: 'LiDAR Point Cloud Visualization',
      url: 'https://images.pexels.com/photos/8566526/pexels-photo-8566526.jpeg',
      type: 'image',
      projectId: '2',
      uploadedAt: new Date('2023-09-15')
    },
    {
      id: '3',
      name: 'RPA Dashboard Interface',
      url: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpg',
      type: 'image',
      projectId: '3',
      uploadedAt: new Date('2023-12-01')
    },
    {
      id: '4',
      name: 'Team Collaboration Session',
      url: 'https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpg',
      type: 'image',
      uploadedAt: new Date('2024-01-10')
    },
    {
      id: '5',
      name: 'Hardware Testing Setup',
      url: 'https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpg',
      type: 'image',
      projectId: '1',
      uploadedAt: new Date('2024-01-18')
    },
    {
      id: '6',
      name: 'Smart Walker Demo Video',
      url: 'https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4',
      type: 'video',
      projectId: '1',
      uploadedAt: new Date('2024-01-20')
    }
  ],
  dailyTasks: [
    {
      id: 'task-1',
      name: 'Review Smart Walker sensor calibration code',
      dueTime: '10:00',
      priority: 'High',
      completed: true,
      missed: false,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date(),
      completedAt: new Date()
    },
    {
      id: 'task-2',
      name: 'Schedule user testing session',
      dueTime: '14:30',
      priority: 'Medium',
      completed: false,
      missed: false,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    },
    {
      id: 'task-3',
      name: 'Update project documentation',
      priority: 'Low',
      completed: false,
      missed: false,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date()
    },
    {
      id: 'task-4',
      name: 'Prepare conference presentation slides',
      dueTime: '16:00',
      priority: 'High',
      completed: true,
      missed: false,
      date: new Date(Date.now() - 86400000).toISOString().split('T')[0], // Yesterday
      createdAt: new Date(Date.now() - 86400000),
      completedAt: new Date(Date.now() - 86400000)
    },
    {
      id: 'task-5',
      name: 'Research healthcare compliance requirements',
      priority: 'Medium',
      completed: false,
      missed: false,
      date: new Date(Date.now() + 86400000).toISOString().split('T')[0], // Tomorrow
      createdAt: new Date()
    }
  ],
  weeklyGoals: [],
  productivityScore: {
    totalScore: 750,
    lastUpdated: new Date(),
    history: [
      {
        date: new Date().toISOString().split('T')[0],
        change: 10,
        reason: 'Task completed',
        taskId: 'task-1'
      },
      {
        date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
        change: 10,
        reason: 'Task completed',
        taskId: 'task-4'
      }
    ]
  },
  linkedInPosts: [
    {
      id: 'post-1',
      title: 'Smart Walker Project Milestone: Successful User Testing',
      summary: 'Excited to share that our Smart Walker prototype has completed its first round of user testing with 10 elderly participants. The feedback has been overwhelmingly positive, with 9/10 users reporting increased confidence while walking. Key insights include the need for adjustable handle heights and voice command integration.',
      postUrl: 'https://linkedin.com/posts/aniketmishra_smartwalker-assistivetechnology-healthcare',
      publishedDate: new Date('2024-01-22T09:15:00'),
      tags: ['Project', 'Achievement'],
      engagement: {
        likes: 47,
        comments: 12,
        shares: 8
      },
      createdAt: new Date('2024-01-22T09:15:00')
    },
    {
      id: 'post-2',
      title: 'Reflecting on 2023: From Sensor Fusion to Healthcare Innovation',
      summary: 'As we wrap up 2023, I\'m grateful for the incredible journey from completing my sensor fusion research (published at ICRA 2024) to diving deep into healthcare robotics. This year taught me that the most impactful technology is the one that directly improves people\'s lives. Looking forward to 2024 and the potential of our Smart Walker project.',
      postUrl: 'https://linkedin.com/posts/aniketmishra_2023reflection-robotics-healthcare',
      publishedDate: new Date('2023-12-28T16:30:00'),
      tags: ['Career Update', 'Learning'],
      engagement: {
        likes: 89,
        comments: 23,
        shares: 15
      },
      createdAt: new Date('2023-12-28T16:30:00')
    },
    {
      id: 'post-3',
      title: 'The Future of Autonomous Systems in Healthcare',
      summary: 'Attended an incredible panel discussion on autonomous systems in healthcare at the Bay Area Robotics Symposium. Key takeaways: 1) Regulatory frameworks are evolving rapidly, 2) Patient safety remains paramount, 3) Interdisciplinary collaboration is essential. The intersection of AI, robotics, and healthcare is where we\'ll see the most transformative innovations in the next decade.',
      postUrl: 'https://linkedin.com/posts/aniketmishra_autonomoussystems-healthcare-robotics',
      publishedDate: new Date('2023-11-15T14:45:00'),
      tags: ['Industry Insight', 'Networking'],
      engagement: {
        likes: 34,
        comments: 7,
        shares: 5
      },
      createdAt: new Date('2023-11-15T14:45:00')
    },
    {
      id: 'post-4',
      title: 'Mentoring the Next Generation of Robotics Engineers',
      summary: 'Had the privilege of mentoring three junior engineers this quarter. Watching them grow from struggling with basic ROS concepts to implementing complex sensor fusion algorithms has been incredibly rewarding. My advice to new engineers: embrace failure as a learning opportunity, ask questions fearlessly, and remember that soft skills are just as important as technical expertise.',
      postUrl: 'https://linkedin.com/posts/aniketmishra_mentoring-robotics-engineering',
      publishedDate: new Date('2023-10-08T11:20:00'),
      tags: ['Career Update', 'Learning'],
      engagement: {
        likes: 156,
        comments: 31,
        shares: 22
      },
      createdAt: new Date('2023-10-08T11:20:00')
    },
    {
      id: 'post-5',
      title: 'Open Source Contribution: LiDAR-Radar Fusion Library',
      summary: 'Thrilled to announce that our sensor fusion research has been open-sourced! The library provides robust multi-modal tracking for autonomous vehicles with 95%+ accuracy. Special thanks to my research team and the broader robotics community for their feedback. Link to repository in the comments. #OpenSource #Robotics #AutonomousVehicles',
      postUrl: 'https://linkedin.com/posts/aniketmishra_opensource-robotics-autonomousvehicles',
      publishedDate: new Date('2023-09-12T13:10:00'),
      tags: ['Project', 'Achievement'],
      engagement: {
        likes: 203,
        comments: 45,
        shares: 67
      },
      createdAt: new Date('2023-09-12T13:10:00')
    }
  ],
  linkedInProfile: {
    profileUrl: 'https://linkedin.com/in/aniketmishra',
    name: 'Aniket Mishra',
    headline: 'Senior Robotics Engineer & Full Stack Developer | AI/ML | Healthcare Innovation',
    lastUpdated: new Date('2024-01-15')
  },
  files: [
    {
      id: 'file-1',
      name: 'aws-solutions-architect-cert.pdf',
      originalName: 'AWS Certified Solutions Architect - Associate.pdf',
      url: '/files/aws-solutions-architect-cert.pdf',
      type: 'application/pdf',
      size: 2048576, // 2MB
      category: 'Certificate',
      description: 'AWS Solutions Architect Associate certification earned in 2023',
      isPublic: true,
      uploadedAt: new Date('2023-11-15'),
      tags: ['AWS', 'Cloud', 'Architecture']
    },
    {
      id: 'file-2',
      name: 'aniket-mishra-resume-2024.pdf',
      originalName: 'Aniket Mishra - Resume 2024.pdf',
      url: '/files/aniket-mishra-resume-2024.pdf',
      type: 'application/pdf',
      size: 1536000, // 1.5MB
      category: 'Resume Update',
      description: 'Latest resume with Smart Walker project and recent achievements',
      isPublic: true,
      uploadedAt: new Date('2024-01-20'),
      tags: ['Resume', 'Professional']
    },
    {
      id: 'file-3',
      name: 'smart-walker-demo-presentation.pptx',
      originalName: 'Smart Walker Demo Presentation.pptx',
      url: '/files/smart-walker-demo-presentation.pptx',
      type: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
      size: 15728640, // 15MB
      category: 'Project Media',
      projectId: '1',
      description: 'Comprehensive presentation showcasing Smart Walker features and user testing results',
      isPublic: true,
      uploadedAt: new Date('2024-01-18'),
      tags: ['Presentation', 'Demo', 'Smart Walker']
    },
    {
      id: 'file-4',
      name: 'icra-2024-paper-acceptance.pdf',
      originalName: 'ICRA 2024 Paper Acceptance Letter.pdf',
      url: '/files/icra-2024-paper-acceptance.pdf',
      type: 'application/pdf',
      size: 512000, // 512KB
      category: 'Achievement',
      description: 'Acceptance letter for sensor fusion research paper at ICRA 2024',
      isPublic: true,
      uploadedAt: new Date('2023-12-05'),
      tags: ['Research', 'Publication', 'ICRA']
    }
  ],
  professionalProfile: {
    name: 'Aniket Mishra',
    title: 'Senior Robotics Engineer & Full Stack Developer',
    summary: 'Innovative Senior Robotics Engineer and Full Stack Developer with 5+ years of experience in autonomous systems, sensor fusion, and scalable web applications. Proven track record of leading cross-functional teams, delivering production-ready robotics solutions, and driving technical innovation in healthcare and industrial automation. Passionate about creating accessible technology that improves quality of life and operational efficiency.',
    email: 'aniket.mishra@example.com',
    phone: '+1 (555) 123-4567',
    location: 'San Francisco, CA',
    linkedin: 'https://linkedin.com/in/aniketmishra',
    github: 'https://github.com/aniketmishra',
    skills: [
      'Python', 'C++', 'JavaScript', 'TypeScript', 'React', 'Node.js',
      'ROS/ROS2', 'TensorFlow', 'PyTorch', 'OpenCV', 'PCL', 'MATLAB',
      'Arduino', 'Raspberry Pi', 'Docker', 'Kubernetes', 'AWS', 'Azure',
      'MongoDB', 'PostgreSQL', 'Git', 'Linux', 'Agile/Scrum'
    ],
    experience: [
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
    ],
    education: [
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
    ],
    certifications: [
      'AWS Certified Solutions Architect',
      'ROS Developer Certification',
      'Certified Scrum Master (CSM)',
      'NVIDIA Deep Learning Institute Certificate'
    ]
  },
  isPublicView: false,
  stats: {
    tasksCompleted: 12,
    projectCount: 3
  }
};

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'ADD_PROJECT':
      return {
        ...state,
        projects: [...state.projects, action.payload],
        stats: { ...state.stats, projectCount: state.stats.projectCount + 1 }
      };
    case 'UPDATE_PROJECT':
      return {
        ...state,
        projects: state.projects.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_PROJECT':
      return {
        ...state,
        projects: state.projects.filter(p => p.id !== action.payload),
        stats: { ...state.stats, projectCount: state.stats.projectCount - 1 }
      };
    case 'ADD_PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, projectUpdates: [...p.projectUpdates, action.payload.update] }
            : p
        )
      };
    case 'DELETE_PROJECT_UPDATE':
      return {
        ...state,
        projects: state.projects.map(p => 
          p.id === action.payload.projectId 
            ? { ...p, projectUpdates: p.projectUpdates.filter(u => u.id !== action.payload.updateId) }
            : p
        )
      };
    case 'ADD_NOTE':
      return {
        ...state,
        notes: [...state.notes, action.payload]
      };
    case 'UPDATE_NOTE':
      return {
        ...state,
        notes: state.notes.map(n => n.id === action.payload.id ? action.payload : n)
      };
    case 'DELETE_NOTE':
      return {
        ...state,
        notes: state.notes.filter(n => n.id !== action.payload)
      };
    case 'ADD_MEDIA':
      return {
        ...state,
        media: [...state.media, action.payload]
      };
    case 'DELETE_MEDIA':
      return {
        ...state,
        media: state.media.filter(m => m.id !== action.payload)
      };
    case 'ADD_DAILY_TASK':
      return {
        ...state,
        dailyTasks: [...state.dailyTasks, action.payload]
      };
    case 'UPDATE_DAILY_TASK':
      return {
        ...state,
        dailyTasks: state.dailyTasks.map(t => t.id === action.payload.id ? action.payload : t)
      };
    case 'DELETE_DAILY_TASK':
      return {
        ...state,
        dailyTasks: state.dailyTasks.filter(t => t.id !== action.payload)
      };
    case 'TOGGLE_TASK_COMPLETION':
      return {
        ...state,
        dailyTasks: state.dailyTasks.map(task => {
          if (task.id === action.payload) {
            const wasCompleted = task.completed;
            const newTask = { 
              ...task, 
              completed: !task.completed,
              missed: false, // Reset missed status when toggling
              completedAt: !task.completed ? new Date() : undefined,
              missedAt: undefined
            };
            
            // Update productivity score
            const scoreChange = !wasCompleted ? 10 : -10;
            const newScore = Math.max(0, Math.min(1000, state.productivityScore.totalScore + scoreChange));
            const newHistory = [
              ...state.productivityScore.history,
              {
                date: new Date().toISOString().split('T')[0],
                change: scoreChange,
                reason: !wasCompleted ? 'Task completed' : 'Task uncompleted',
                taskId: task.id
              }
            ].slice(-50); // Keep last 50 entries
            
            return {
              ...state,
              dailyTasks: state.dailyTasks.map(t => t.id === action.payload ? newTask : t),
              productivityScore: {
                totalScore: newScore,
                lastUpdated: new Date(),
                history: newHistory
              }
            };
          }
          return task;
        })
      };
    case 'MARK_TASK_MISSED':
      return {
        ...state,
        dailyTasks: state.dailyTasks.map(task => {
          if (task.id === action.payload && !task.completed) {
            const newTask = {
              ...task,
              missed: true,
              missedAt: new Date()
            };
            
            // Update productivity score (penalty for missed task)
            const scoreChange = -5;
            const newScore = Math.max(0, state.productivityScore.totalScore + scoreChange);
            const newHistory = [
              ...state.productivityScore.history,
              {
                date: new Date().toISOString().split('T')[0],
                change: scoreChange,
                reason: 'Task missed',
                taskId: task.id
              }
            ].slice(-50);
            
            return {
              ...state,
              dailyTasks: state.dailyTasks.map(t => t.id === action.payload ? newTask : t),
              productivityScore: {
                totalScore: newScore,
                lastUpdated: new Date(),
                history: newHistory
              }
            };
          }
          return task;
        })
      };
    case 'MARK_ALL_COMPLETE':
      const dateToComplete = action.payload;
      const tasksToComplete = state.dailyTasks.filter(task => 
        task.date === dateToComplete && !task.completed
      );
      
      if (tasksToComplete.length === 0) return state;
      
      const completionBonus = tasksToComplete.length * 10 + 20; // Bonus for completing all tasks
      const newScore = Math.min(1000, state.productivityScore.totalScore + completionBonus);
      const newHistory = [
        ...state.productivityScore.history,
        {
          date: new Date().toISOString().split('T')[0],
          change: completionBonus,
          reason: `Completed all ${tasksToComplete.length} tasks for the day`
        }
      ].slice(-50);
      
      return {
        ...state,
        dailyTasks: state.dailyTasks.map(task => 
          task.date === dateToComplete && !task.completed
            ? { ...task, completed: true, completedAt: new Date(), missed: false, missedAt: undefined }
            : task
        ),
        productivityScore: {
          totalScore: newScore,
          lastUpdated: new Date(),
          history: newHistory
        }
      };
    case 'ADD_WEEKLY_GOALS':
      return {
        ...state,
        weeklyGoals: [...state.weeklyGoals, action.payload]
      };
    case 'UPDATE_WEEKLY_GOALS':
      return {
        ...state,
        weeklyGoals: state.weeklyGoals.map(wg => 
          wg.id === action.payload.id ? action.payload : wg
        )
      };
    case 'UPDATE_PRODUCTIVITY_SCORE':
      const { change, reason, taskId } = action.payload;
      const updatedScore = Math.max(0, Math.min(1000, state.productivityScore.totalScore + change));
      const updatedHistory = [
        ...state.productivityScore.history,
        {
          date: new Date().toISOString().split('T')[0],
          change,
          reason,
          taskId
        }
      ].slice(-50);
      
      return {
        ...state,
        productivityScore: {
          totalScore: updatedScore,
          lastUpdated: new Date(),
          history: updatedHistory
        }
      };
    case 'ADD_LINKEDIN_POST':
      return {
        ...state,
        linkedInPosts: [...state.linkedInPosts, action.payload]
      };
    case 'UPDATE_LINKEDIN_POST':
      return {
        ...state,
        linkedInPosts: state.linkedInPosts.map(p => p.id === action.payload.id ? action.payload : p)
      };
    case 'DELETE_LINKEDIN_POST':
      return {
        ...state,
        linkedInPosts: state.linkedInPosts.filter(p => p.id !== action.payload)
      };
    case 'UPDATE_LINKEDIN_PROFILE':
      return {
        ...state,
        linkedInProfile: action.payload
      };
    case 'ADD_FILE':
      return {
        ...state,
        files: [...state.files, action.payload]
      };
    case 'UPDATE_FILE':
      return {
        ...state,
        files: state.files.map(f => f.id === action.payload.id ? action.payload : f)
      };
    case 'DELETE_FILE':
      return {
        ...state,
        files: state.files.filter(f => f.id !== action.payload)
      };
    case 'UPDATE_PROFESSIONAL_PROFILE':
      return {
        ...state,
        professionalProfile: action.payload
      };
    case 'TOGGLE_PUBLIC_VIEW':
      return {
        ...state,
        isPublicView: action.payload
      };
    case 'UPDATE_STATS':
      return {
        ...state,
        stats: { ...state.stats, ...action.payload }
      };
    default:
      return state;
  }
};

interface AppContextType {
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider: React.FC<AppProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};