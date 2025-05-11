import { NgClass } from '@angular/common';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { NavbarStateService } from '../../shared/services/navbar-state.service';
import { filter, Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy {
  isNavbarCollapsed = true;
  tasksActive = false;
  aboutUsActive = false;
  contactUsActive = false;
  private routerSubscription: Subscription | null = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navbarState: NavbarStateService
  ) {
    this.navbarState.tasksActive$.subscribe(active => {
      this.tasksActive = active;
    });
    
    this.navbarState.aboutUsActive$.subscribe(active => {
      this.aboutUsActive = active;
    });
    
    this.navbarState.contactUsActive$.subscribe(active => {
      this.contactUsActive = active;
    });
  }

  ngOnInit(): void {
    // Subscribe to router events to update active states
    this.routerSubscription = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event) => {
      const url = this.router.url;
      this.updateActiveStates(url);
    });
    
    // Set initial active states
    this.updateActiveStates(this.router.url);
  }
  
  ngOnDestroy(): void {
    if (this.routerSubscription) {
      this.routerSubscription.unsubscribe();
    }
  }
  
  updateActiveStates(url: string): void {
    // Reset all states first
    this.navbarState.setTasksActive(false);
    this.navbarState.setAboutUsActive(false);
    this.navbarState.setContactUsActive(false);
    
    // Then set the active one based on URL
    if (url.includes('/task-view') || (url.includes('/dashboard') && this.isTaskTableVisible())) {
      this.navbarState.setTasksActive(true);
    } else if (url.includes('/aboutus')) {
      this.navbarState.setAboutUsActive(true);
    } else if (url.includes('/contactus')) {
      this.navbarState.setContactUsActive(true);
    }
  }
  
  isTaskTableVisible(): boolean {
    const table = document.getElementById('taskTable');
    if (!table) return false;
    
    const rect = table.getBoundingClientRect();
    return rect.top >= 0 && rect.bottom <= window.innerHeight;
  }

  scrollToFooter(event: Event) {
    event.preventDefault();
    const footer = document.getElementById('main-footer');
    if (footer) {
      footer.scrollIntoView({ behavior: 'smooth' });
    }
  }

  goToTasks(event: Event) {
    event.preventDefault();
    if (this.router.url.startsWith('/dashboard')) {
      // Already on dashboard, just scroll
      setTimeout(() => {
        const table = document.getElementById('taskTable');
        if (table) {
          table.scrollIntoView({ behavior: 'smooth' });
          this.navbarState.setTasksActive(true);
        }
      }, 100);
    } else {
      // Navigate to dashboard, then scroll after navigation
      this.router.navigate(['/dashboard']).then(() => {
        setTimeout(() => {
          const table = document.getElementById('taskTable');
          if (table) {
            table.scrollIntoView({ behavior: 'smooth' });
            this.navbarState.setTasksActive(true);
          }
        }, 300); // Wait for view to render
      });
    }
  }

  isDashboardRoute(): boolean {
    return this.router.url.startsWith('/dashboard');
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    this.router.navigate(['/login']);
  }
}
