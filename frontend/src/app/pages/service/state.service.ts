import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StateService {
  private currentUserState = new BehaviorSubject<string>("");
  public currentUserState$ = this.currentUserState.asObservable();

  constructor() { }
  
  updateCurrentUserState(userState: string) {
    this.currentUserState.next(userState);
  }
}
