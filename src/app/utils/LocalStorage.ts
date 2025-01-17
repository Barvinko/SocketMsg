import { User } from '@type/type';

class LocalStorage<T> {
  private _key: string;

  constructor(nameKey: string) {
    this._key = `@Barvinko_FUN-CHAT__${nameKey}`;
  }

  public setData(data: T): void {
    localStorage.setItem(this._key, JSON.stringify(data));
  }

  public deleteData(): void {
    localStorage.removeItem(this._key);
  }

  public getData(): T | null {
    return JSON.parse(localStorage.getItem(this._key) || 'null');
  }
}

export const UserStorage = new LocalStorage<User>('user');
