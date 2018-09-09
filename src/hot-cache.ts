import { LRUCache } from 'lru-fast';
import {ReplaySubject} from 'rxjs';

const defaultSize = 1000;

export class HotCache<T> {
  private readonly cache: LRUCache<string, ReplaySubject<Partial<T>>>;
  private readonly state: {[key: string]: Partial<T>}

  constructor(size: number = defaultSize) {
    this.cache = new LRUCache(size);
    this.state = {};
  }

  private createSubject(key: string): ReplaySubject<T> {
    const subject = new ReplaySubject<T>(1);

    this.cache.set(key, subject);
    return subject;
  }

  private getOrCreate(key: string): ReplaySubject<Partial<T>> {
    const subject = this.cache.get(key);
    if (subject) {
      return subject;
    }

    return this.createSubject(key);;
  }

  update(key: string, newState: Partial<T>) {
    const observable = this.getOrCreate(key);
    const currentState = this.state[key];
    const mergedState = {
      ...currentState as any,
      ...newState as any
    };

    this.state[key] = mergedState;
    observable.next(mergedState);
  }

  all() {

  }

  has(key: string): boolean {
    return !!this.cache.find(key);
  }

  get(key: string): ReplaySubject<Partial<T>> | undefined {
    return this.cache.get(key);
  }

  getOrInsert(key: string, callback: () => Partial<T>): ReplaySubject<Partial<T>> {
    if (!this.has(key)) {
      this.update(key, callback());
    }

    return this.get(key)!;
  }

  removeAll() {
    this.cache.removeAll();
  }

  get size(): number {
    return this.cache.size;
  }
}

export default HotCache;
