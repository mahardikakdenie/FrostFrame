import Dexie, { type Table } from 'dexie';

export interface Page {
  id: string;
  name: string;
  slug: string;
  content: any;
  updatedAt: number;
}

export interface Clipboard {
  id: string;
  nodeData: any;
  copiedAt: number;
}

export class LandoStudioDatabase extends Dexie {
  pages!: Table<Page>;
  clipboard!: Table<Clipboard>;

  constructor() {
    super('LandoStudioDB');
    this.version(3).stores({
      pages: 'id, name, slug, updatedAt',
      clipboard: 'id, copiedAt'
    });
  }
}

export const db = new LandoStudioDatabase();

/**
 * Saves a specific page content to IndexedDB.
 */
export const savePageToDB = async (pageId: string, name: string, slug: string, content: any) => {
  try {
    await db.pages.put({
      id: pageId,
      name,
      slug,
      content,
      updatedAt: Date.now(),
    });
  } catch (error) {
    console.error(`Failed to save page ${pageId} to IndexedDB:`, error);
  }
};

/**
 * Retrieves a specific page from IndexedDB.
 */
export const getPageFromDB = async (pageId: string) => {
  try {
    return await db.pages.get(pageId);
  } catch (error) {
    console.error(`Failed to get page ${pageId} from IndexedDB:`, error);
    return null;
  }
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
