import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NavbarStateService {
  private tasksActiveSubject = new BehaviorSubject<boolean>(false);
  tasksActive$ = this.tasksActiveSubject.asObservable();

  setTasksActive(active: boolean) {
    this.tasksActiveSubject.next(active);
  }
}