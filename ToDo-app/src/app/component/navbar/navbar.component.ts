import { NgClass } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router'; // Add this
import { NavbarStateService } from '../../shared/services/navbar-state.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, NgClass], // Add RouterLinkActive, NgClass
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  tasksActive = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private navbarState: NavbarStateService // Add this
  ) {
    this.navbarState.tasksActive$.subscribe(active => {
      this.tasksActive = active;
    });
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
        }
      }, 100);
    } else {
      // Navigate to dashboard, then scroll after navigation
      this.router.navigate(['/dashboard']).then(() => {
        setTimeout(() => {
          const table = document.getElementById('taskTable');
          if (table) {
            table.scrollIntoView({ behavior: 'smooth' });
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
