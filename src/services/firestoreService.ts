import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  deleteDoc,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { FarmerProfile } from '../types';
import { HarvestScheduleRecord } from './harvestService';

export interface FirestoreIrrigationState {
  id: string;
  userId: string;
  isPumpOn: boolean;
  mode: 'auto' | 'manual';
  soilMoisturePct: number;
  waterDepthCm: number;
  lastIrrigated: string;
  updatedAt?: string;
}

export interface FirestoreCropTask {
  id: string;
  userId: string;
  textTa: string;
  textEn: string;
  done: boolean;
  category: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface FirestoreCropNote {
  id: string;
  userId: string;
  date: string;
  text: string;
  createdAt?: string;
}

export interface FirestoreDiseaseAlert {
  id: string;
  userId?: string;
  diseaseEn: string;
  diseaseTa: string;
  cropEn: string;
  cropTa?: string;
  district: string;
  village?: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  reportedDate?: string;
  activeCasesCount?: number;
  recommendationEn?: string;
  recommendationTa?: string;
  isVerifiedByOfficer?: boolean;
}

export const firestoreService = {
  // --- Farmer Profile ---
  async getUserProfile(userId: string): Promise<FarmerProfile | null> {
    const docPath = `users/${userId}`;
    try {
      const snap = await getDoc(doc(db, 'users', userId));
      if (!snap.exists()) return null;
      return snap.data() as FarmerProfile;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, docPath);
      return null;
    }
  },

  async saveUserProfile(profile: FarmerProfile): Promise<void> {
    const docPath = `users/${profile.id}`;
    try {
      const dataToSave = {
        ...profile,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', profile.id), dataToSave, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  subscribeUserProfile(userId: string, onUpdate: (profile: FarmerProfile | null) => void): () => void {
    const docPath = `users/${userId}`;
    const unsubscribe = onSnapshot(
      doc(db, 'users', userId),
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as FarmerProfile);
        } else {
          onUpdate(null);
        }
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, docPath);
      }
    );
    return unsubscribe;
  },

  // --- Smart Irrigation State ---
  async getIrrigationState(userId: string): Promise<FirestoreIrrigationState | null> {
    const docPath = `users/${userId}/irrigation/state`;
    try {
      const snap = await getDoc(doc(db, 'users', userId, 'irrigation', 'state'));
      if (!snap.exists()) return null;
      return snap.data() as FirestoreIrrigationState;
    } catch (err) {
      handleFirestoreError(err, OperationType.GET, docPath);
      return null;
    }
  },

  async saveIrrigationState(userId: string, state: Partial<FirestoreIrrigationState>): Promise<void> {
    const docPath = `users/${userId}/irrigation/state`;
    try {
      const fullState: FirestoreIrrigationState = {
        id: 'state',
        userId,
        isPumpOn: state.isPumpOn ?? false,
        mode: state.mode ?? 'auto',
        soilMoisturePct: state.soilMoisturePct ?? 72,
        waterDepthCm: state.waterDepthCm ?? 2.5,
        lastIrrigated: state.lastIrrigated ?? 'Today, 6:30 AM',
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userId, 'irrigation', 'state'), fullState, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  subscribeIrrigationState(
    userId: string,
    onUpdate: (state: FirestoreIrrigationState | null) => void
  ): () => void {
    const docPath = `users/${userId}/irrigation/state`;
    return onSnapshot(
      doc(db, 'users', userId, 'irrigation', 'state'),
      (snap) => {
        if (snap.exists()) {
          onUpdate(snap.data() as FirestoreIrrigationState);
        } else {
          onUpdate(null);
        }
      },
      (err) => {
        handleFirestoreError(err, OperationType.GET, docPath);
      }
    );
  },

  // --- Crop Management Tasks ---
  async getCropTasks(userId: string): Promise<FirestoreCropTask[]> {
    const colPath = `users/${userId}/crop_tasks`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'crop_tasks'));
      return snap.docs.map((d) => d.data() as FirestoreCropTask);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveCropTask(userId: string, task: FirestoreCropTask): Promise<void> {
    const docPath = `users/${userId}/crop_tasks/${task.id}`;
    try {
      const cleanTask = {
        ...task,
        userId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userId, 'crop_tasks', task.id), cleanTask, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  async deleteCropTask(userId: string, taskId: string): Promise<void> {
    const docPath = `users/${userId}/crop_tasks/${taskId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'crop_tasks', taskId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  subscribeCropTasks(userId: string, onUpdate: (tasks: FirestoreCropTask[]) => void): () => void {
    const colPath = `users/${userId}/crop_tasks`;
    return onSnapshot(
      collection(db, 'users', userId, 'crop_tasks'),
      (snap) => {
        const tasks = snap.docs.map((d) => d.data() as FirestoreCropTask);
        onUpdate(tasks);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    );
  },

  // --- Crop Notes Diary ---
  async getCropNotes(userId: string): Promise<FirestoreCropNote[]> {
    const colPath = `users/${userId}/crop_notes`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'crop_notes'));
      return snap.docs.map((d) => d.data() as FirestoreCropNote);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async addCropNote(userId: string, note: FirestoreCropNote): Promise<void> {
    const docPath = `users/${userId}/crop_notes/${note.id}`;
    try {
      const cleanNote = {
        ...note,
        userId,
        createdAt: note.createdAt || new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userId, 'crop_notes', note.id), cleanNote);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },

  async deleteCropNote(userId: string, noteId: string): Promise<void> {
    const docPath = `users/${userId}/crop_notes/${noteId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'crop_notes', noteId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  subscribeCropNotes(userId: string, onUpdate: (notes: FirestoreCropNote[]) => void): () => void {
    const colPath = `users/${userId}/crop_notes`;
    return onSnapshot(
      collection(db, 'users', userId, 'crop_notes'),
      (snap) => {
        const notes = snap.docs.map((d) => d.data() as FirestoreCropNote);
        onUpdate(notes);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    );
  },

  // --- Crop Harvest Schedules ---
  async getHarvestSchedules(userId: string): Promise<HarvestScheduleRecord[]> {
    const colPath = `users/${userId}/crop_schedules`;
    try {
      const snap = await getDocs(collection(db, 'users', userId, 'crop_schedules'));
      return snap.docs.map((d) => d.data() as HarvestScheduleRecord);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async saveHarvestSchedule(userId: string, schedule: HarvestScheduleRecord): Promise<void> {
    const docPath = `users/${userId}/crop_schedules/${schedule.id}`;
    try {
      const cleanSchedule: HarvestScheduleRecord = {
        ...schedule,
        userId,
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', userId, 'crop_schedules', schedule.id), cleanSchedule, { merge: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, docPath);
    }
  },

  async deleteHarvestSchedule(userId: string, scheduleId: string): Promise<void> {
    const docPath = `users/${userId}/crop_schedules/${scheduleId}`;
    try {
      await deleteDoc(doc(db, 'users', userId, 'crop_schedules', scheduleId));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, docPath);
    }
  },

  subscribeHarvestSchedules(
    userId: string,
    onUpdate: (schedules: HarvestScheduleRecord[]) => void
  ): () => void {
    const colPath = `users/${userId}/crop_schedules`;
    return onSnapshot(
      collection(db, 'users', userId, 'crop_schedules'),
      (snap) => {
        const schedules = snap.docs.map((d) => d.data() as HarvestScheduleRecord);
        onUpdate(schedules);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    );
  },

  // --- Outbreak Alerts ---
  async getAlerts(): Promise<FirestoreDiseaseAlert[]> {
    const colPath = 'alerts';
    try {
      const snap = await getDocs(collection(db, 'alerts'));
      return snap.docs.map((d) => d.data() as FirestoreDiseaseAlert);
    } catch (err) {
      handleFirestoreError(err, OperationType.LIST, colPath);
      return [];
    }
  },

  async addAlert(alert: FirestoreDiseaseAlert): Promise<void> {
    const docPath = `alerts/${alert.id}`;
    try {
      await setDoc(doc(db, 'alerts', alert.id), alert);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, docPath);
    }
  },

  subscribeAlerts(onUpdate: (alerts: FirestoreDiseaseAlert[]) => void): () => void {
    const colPath = 'alerts';
    return onSnapshot(
      collection(db, 'alerts'),
      (snap) => {
        const alerts = snap.docs.map((d) => d.data() as FirestoreDiseaseAlert);
        onUpdate(alerts);
      },
      (err) => {
        handleFirestoreError(err, OperationType.LIST, colPath);
      }
    );
  },
};
