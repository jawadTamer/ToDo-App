import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NavbarStateService } from '../../shared/services/navbar-state.service';

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent implements OnInit, OnDestroy {
  image:string="https://static.vecteezy.com/system/resources/previews/008/559/009/non_2x/contact-us-button-contact-us-text-web-template-sign-icon-banner-vector.jpg"

  constructor(private navbarState: NavbarStateService) {}

  ngOnInit(): void {
    this.navbarState.setContactUsActive(true);
  }

  ngOnDestroy(): void {
    this.navbarState.setContactUsActive(false);
  }
}
