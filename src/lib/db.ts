import Dexie, { type Table } from 'dexie';

export interface Draft {
  id: string;
  content: any;
  updatedAt: number;
}

export interface Clipboard {
  id: string;
  nodeData: any;
  copiedAt: number;
}

export class LandoStudioDatabase extends Dexie {
  drafts!: Table<Draft>;
  clipboard!: Table<Clipboard>;

  constructor() {
    super('LandoStudioDB');
    this.version(2).stores({
      drafts: 'id, updatedAt',
      clipboard: 'id, copiedAt'
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

/**
 * Saves copied node to clipboard in IndexedDB.
 */
export const saveToClipboard = async (nodeData: any) => {
  try {
    await db.clipboard.put({
      id: 'current-clipboard',
      nodeData,
      copiedAt: Date.now(),
    });
  } catch (error) {
    console.error('Failed to save to clipboard:', error);
  }
};

/**
 * Retrieves clipboard content from IndexedDB.
 */
export const getFromClipboard = async () => {
  try {
    return await db.clipboard.get('current-clipboard');
  } catch (error) {
    console.error('Failed to get from clipboard:', error);
    return null;
  }
};

/**
 * Clears clipboard content from IndexedDB.
 */
export const clearClipboard = async () => {
  try {
    await db.clipboard.delete('current-clipboard');
  } catch (error) {
    console.error('Failed to clear clipboard:', error);
  }
};
