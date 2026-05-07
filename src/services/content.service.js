import { getDb, saveDb, delay } from '../utils/mockDb';
import { authService } from './auth.service';

const generateId = () => Math.random().toString(36).substring(2, 9);

export const contentService = {
  uploadContent: async (contentData) => {
    await delay(1000);
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'TEACHER') throw new Error('Unauthorized');

    const db = getDb();
    
    // Convert file to data URL for mock storage if it exists, otherwise just store file name
    // In a real app we would use FormData and upload to a server/S3
    let fileData = null;
    if (contentData.file && contentData.file[0]) {
       // Just keeping a mock file object reference for the demo
       fileData = {
          name: contentData.file[0].name,
          size: contentData.file[0].size,
          type: contentData.file[0].type
       };
    }

    const newContent = {
      id: generateId(),
      teacherId: user.id,
      teacherName: user.name,
      title: contentData.title,
      subject: contentData.subject,
      description: contentData.description || '',
      file: fileData,
      startTime: contentData.startTime,
      endTime: contentData.endTime,
      rotationDuration: contentData.rotationDuration || 0,
      status: 'PENDING', // PENDING, APPROVED, REJECTED
      rejectionReason: null,
      createdAt: new Date().toISOString()
    };

    db.content.unshift(newContent);
    saveDb(db);
    return newContent;
  },

  getMyContent: async () => {
    await delay(600);
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'TEACHER') throw new Error('Unauthorized');

    const db = getDb();
    return db.content.filter(c => c.teacherId === user.id);
  },
  
  getTeacherContentById: async (teacherId) => {
    await delay(500);
    const db = getDb();
    return db.content.filter(c => c.teacherId === teacherId);
  },

  getAllContent: async () => {
    await delay(600);
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'PRINCIPAL') throw new Error('Unauthorized');

    const db = getDb();
    return db.content;
  },

  getStats: async () => {
    await delay(300);
    const user = authService.getCurrentUser();
    if (!user) throw new Error('Unauthorized');

    const db = getDb();
    let contentList = db.content;
    
    if (user.role === 'TEACHER') {
      contentList = contentList.filter(c => c.teacherId === user.id);
    }

    return {
      total: contentList.length,
      pending: contentList.filter(c => c.status === 'PENDING').length,
      approved: contentList.filter(c => c.status === 'APPROVED').length,
      rejected: contentList.filter(c => c.status === 'REJECTED').length,
    };
  }
};
