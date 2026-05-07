const DB_KEY = 'content_broadcasting_system_db';

const getDefaultData = () => {
  const now = new Date();
  
  // Dates for seeding
  const oneHourAgo = new Date(now.getTime() - 60 * 60 * 1000).toISOString();
  const nextWeek = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000).toISOString();
  const yesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();

  return {
    users: [
      { id: 'u1', email: 'principal@school.com', password: 'password', role: 'PRINCIPAL', name: 'Principal Skinner' },
      { id: 'u2', email: 'teacher@school.com', password: 'password', role: 'TEACHER', name: 'Edna Krabappel' },
    ],
    content: [
      {
        id: 'c1',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Introduction to Algebra',
        subject: 'Mathematics',
        description: 'A fundamental introduction to variables, expressions, and basic equations.',
        file: { name: 'algebra_intro.pdf', size: 1024000, type: 'application/pdf' },
        startTime: oneHourAgo,
        endTime: nextWeek,
        rotationDuration: 10,
        status: 'APPROVED',
        rejectionReason: null,
        createdAt: twoDaysAgo
      },
      {
        id: 'c2',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Solar System Overview',
        subject: 'Science',
        description: 'Exploring the planets in our solar system with visual guides.',
        file: { name: 'solar_system.png', size: 512000, type: 'image/png' },
        startTime: oneHourAgo,
        endTime: nextWeek,
        rotationDuration: 10,
        status: 'APPROVED',
        rejectionReason: null,
        createdAt: twoDaysAgo
      },
      {
        id: 'c3',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'World War II Summary',
        subject: 'History',
        description: 'Key events and figures from the second world war.',
        file: { name: 'ww2_history.png', size: 850000, type: 'image/png' },
        startTime: nextWeek,
        endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 0,
        status: 'PENDING',
        rejectionReason: null,
        createdAt: yesterday
      },
      {
        id: 'c4',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'The Great Gatsby Review',
        subject: 'English',
        description: 'Character analysis and thematic review.',
        file: { name: 'gatsby.png', size: 300000, type: 'image/png' },
        startTime: twoDaysAgo,
        endTime: yesterday,
        rotationDuration: 5,
        status: 'REJECTED',
        rejectionReason: 'The file resolution is too low and text is unreadable. Please upload a higher quality version.',
        createdAt: new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c5',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Introduction to HTML & CSS',
        subject: 'Computer Science',
        description: 'Basic web development principles and styling.',
        file: { name: 'html_css_intro.pdf', size: 2100000, type: 'application/pdf' },
        startTime: nextWeek,
        endTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 0,
        status: 'PENDING',
        rejectionReason: null,
        createdAt: yesterday
      },
      {
        id: 'c6',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Data Structures Basics',
        subject: 'Computer Science',
        description: 'Understanding arrays, linked lists, and trees.',
        file: { name: 'data_structures.png', size: 800000, type: 'image/png' },
        startTime: oneHourAgo,
        endTime: nextWeek,
        rotationDuration: 15,
        status: 'APPROVED',
        rejectionReason: null,
        createdAt: twoDaysAgo
      },
      {
        id: 'c7',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Chemical Bonding Fundamentals',
        subject: 'Science',
        description: 'Ionic, covalent, and metallic bonds explained.',
        file: { name: 'chem_bonds.jpg', size: 450000, type: 'image/jpeg' },
        startTime: nextWeek,
        endTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 0,
        status: 'PENDING',
        rejectionReason: null,
        createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c8',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'French Revolution Timeline',
        subject: 'History',
        description: 'Timeline of events from 1789 to 1799.',
        file: { name: 'french_rev.pdf', size: 1200000, type: 'application/pdf' },
        startTime: oneHourAgo,
        endTime: nextWeek,
        rotationDuration: 0,
        status: 'REJECTED',
        rejectionReason: 'Contains historical inaccuracies regarding the timeline of the Reign of Terror. Please review and update.',
        createdAt: new Date(now.getTime() - 4 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c9',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Shakespearean Sonnets',
        subject: 'English',
        description: 'Analysis of Sonnet 18 and Sonnet 130.',
        file: { name: 'sonnets.png', size: 600000, type: 'image/png' },
        startTime: new Date(now.getTime() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 10,
        status: 'APPROVED',
        rejectionReason: null,
        createdAt: new Date(now.getTime() - 12 * 24 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'c10',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Advanced Calculus',
        subject: 'Mathematics',
        description: 'Derivatives and integrals of complex functions.',
        file: { name: 'calculus.pdf', size: 3000000, type: 'application/pdf' },
        startTime: new Date(now.getTime() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        endTime: new Date(now.getTime() + 10 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 20,
        status: 'APPROVED',
        rejectionReason: null,
        createdAt: yesterday
      },
      {
        id: 'c11',
        teacherId: 'u2',
        teacherName: 'Edna Krabappel',
        title: 'Physical Geography Map',
        subject: 'Geography',
        description: 'Topographical map analysis of mountain ranges.',
        file: { name: 'topo_map.jpg', size: 950000, type: 'image/jpeg' },
        startTime: oneHourAgo,
        endTime: new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000).toISOString(),
        rotationDuration: 0,
        status: 'PENDING',
        rejectionReason: null,
        createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
      }
    ]
  };
};

export const getDb = () => {
  if (typeof window === 'undefined') return getDefaultData();
  
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
    const defaultData = getDefaultData();
    localStorage.setItem(DB_KEY, JSON.stringify(defaultData));
    return defaultData;
  }
  return JSON.parse(data);
};

export const saveDb = (data) => {
  if (typeof window === 'undefined') return;
  localStorage.setItem(DB_KEY, JSON.stringify(data));
};

export const delay = (ms = 500) => new Promise(resolve => setTimeout(resolve, ms));
