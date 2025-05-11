import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-contactus',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './contactus.component.html',
  styleUrl: './contactus.component.css'
})
export class ContactusComponent {
image:string="https://static.vecteezy.com/system/resources/previews/008/559/009/non_2x/contact-us-button-contact-us-text-web-template-sign-icon-banner-vector.jpg"

}
