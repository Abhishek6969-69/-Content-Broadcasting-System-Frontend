const DB_KEY = 'content_broadcasting_system_db';

const defaultData = {
  users: [
    { id: 'u1', email: 'principal@school.com', password: 'password', role: 'PRINCIPAL', name: 'Principal Skinner' },
    { id: 'u2', email: 'teacher@school.com', password: 'password', role: 'TEACHER', name: 'Edna Krabappel' },
  ],
  content: [
    // { id, title, subject, description, fileUrl, fileName, startTime, endTime, rotationDuration, status: 'PENDING'|'APPROVED'|'REJECTED', rejectionReason, teacherId }
  ]
};

export const getDb = () => {
  if (typeof window === 'undefined') return defaultData;
  
  const data = localStorage.getItem(DB_KEY);
  if (!data) {
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
