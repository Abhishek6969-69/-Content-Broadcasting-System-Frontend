import { getDb, saveDb, delay } from '../utils/mockDb';
import { authService } from './auth.service';

export const approvalService = {
  approveContent: async (contentId) => {
    await delay(500);
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'PRINCIPAL') throw new Error('Unauthorized');

    const db = getDb();
    const index = db.content.findIndex(c => c.id === contentId);
    
    if (index === -1) throw new Error('Content not found');
    if (db.content[index].status !== 'PENDING') throw new Error('Content is not pending');

    db.content[index].status = 'APPROVED';
    db.content[index].rejectionReason = null;
    
    saveDb(db);
    return db.content[index];
  },

  rejectContent: async (contentId, reason) => {
    await delay(500);
    const user = authService.getCurrentUser();
    if (!user || user.role !== 'PRINCIPAL') throw new Error('Unauthorized');

    if (!reason || reason.trim() === '') throw new Error('Rejection reason is mandatory');

    const db = getDb();
    const index = db.content.findIndex(c => c.id === contentId);
    
    if (index === -1) throw new Error('Content not found');
    if (db.content[index].status !== 'PENDING') throw new Error('Content is not pending');

    db.content[index].status = 'REJECTED';
    db.content[index].rejectionReason = reason;
    
    saveDb(db);
    return db.content[index];
  }
};
