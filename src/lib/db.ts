import Dexie, { type Table } from 'dexie';

export interface Draft {
  id: string;
  content: any;
  updatedAt: number;
}

export class LandoStudioDatabase extends Dexie {
  drafts!: Table<Draft>;

  constructor() {
    super('LandoStudioDB');
    this.version(1).stores({
      drafts: 'id, updatedAt'
    });
  }
}

export const db = new LandoStudioDatabase();

/**
 * Saves the current editor content to IndexedDB.
 */
export const saveDraftToDB = async (content: any) => {
  try {
    await db.drafts.put({
      id: 'current-draft',
      content,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error('Failed to save draft to IndexedDB:', error);
  }
};

/**
 * Retrieves the draft from IndexedDB.
 */
export const getDraftFromDB = async () => {
  try {
    return await db.drafts.get('current-draft');
  } catch (error) {
    console.error('Failed to get draft from IndexedDB:', error);
    return null;
  }
};

/**
 * Migrates data from LocalStorage to IndexedDB if it exists.
 */
export const migrateFromLocalStorage = async () => {
  const LOCAL_STORAGE_KEY = 'lando-builder-draft';
  const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
  
  if (localData) {
    try {
      const content = JSON.parse(localData);
      await saveDraftToDB(content);
      localStorage.removeItem(LOCAL_STORAGE_KEY);
      console.log('🚀 [Migration] Draft successfully moved from LocalStorage to IndexedDB.');
      return content;
    } catch (e) {
      console.error('❌ [Migration] Failed to migrate draft from LocalStorage:', e);
    }
  }
  return null;
};
