import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyserviceService {
  userid: string  = ''

  constructor() { }
  setUserId(id: string) {
    this.userid = id;
  }
  getUserId(): string  {
    return this.userid;
  }
}
