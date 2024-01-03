import { CookieService } from 'ngx-cookie-service';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private cookie: CookieService) { }

  setItem(key: string, value: string) {
    this.cookie.set(key, value, 365);
  }

  async getItem(key: string) {
    const isuser = this.cookie.check(key);
    if (isuser) {
      const user = new Promise((resolve, reject) => {
        resolve(this.cookie.get(key));
      });
      return user
    }
  }


  removeItem(key: string) {
    this.cookie.delete(key);
  }
}
