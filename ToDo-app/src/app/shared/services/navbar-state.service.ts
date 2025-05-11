import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavbarStateService {
  private tasksActiveSubject = new BehaviorSubject<boolean>(false);
  private aboutUsActiveSubject = new BehaviorSubject<boolean>(false);
  private contactUsActiveSubject = new BehaviorSubject<boolean>(false);
  
  tasksActive$ = this.tasksActiveSubject.asObservable();
  aboutUsActive$ = this.aboutUsActiveSubject.asObservable();
  contactUsActive$ = this.contactUsActiveSubject.asObservable();

  setTasksActive(active: boolean) {
    this.tasksActiveSubject.next(active);
  }
  
  setAboutUsActive(active: boolean) {
    this.aboutUsActiveSubject.next(active);
  }
  
  setContactUsActive(active: boolean) {
    this.contactUsActiveSubject.next(active);
  }
}