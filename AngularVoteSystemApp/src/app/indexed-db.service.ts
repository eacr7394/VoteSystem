import { Injectable } from '@angular/core';
import { openDB, IDBPDatabase, IDBPTransaction } from 'idb';

@Injectable({
  providedIn: 'root',
})
export class IndexedDbService {
  private db: IDBPDatabase | null = null;
  private databaseName: string = "voteSystemDb";
  private storeCollection: string = "voteSystemItems";
  public readonly IsAuthenticatedKey: string = "iak";
  public readonly UserIdKey: string = "iaku";

  private async initializeDB() {
    const STORE_COLLECTION = this.storeCollection;
    this.db = await openDB(this.databaseName, 1, {
      upgrade(db) {
        db.createObjectStore(STORE_COLLECTION, { keyPath: 'id' });
      },
    });
  }

  async set(key: string, value: any): Promise<void> {
    if (!this.db) {
      await this.initializeDB();
    }
    if (!this.db) {
      console.error('IndexedDB not initialized');
      return;
    }

    const tx = this.db.transaction(this.storeCollection, 'readwrite');
    const store = tx.objectStore(this.storeCollection);
    await store.put({ id: key, value });
  }

  async get(key: string): Promise<any> {
    if (!this.db) {
      await this.initializeDB();
    }
    if (!this.db) {
      console.error('IndexedDB not initialized');
      return null;
    }

    const tx = this.db.transaction(this.storeCollection, 'readonly');
    const store = tx.objectStore(this.storeCollection);
    return await store.get(key);
  }
}
