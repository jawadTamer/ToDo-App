import { Component } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent {
image:string="https://media.istockphoto.com/id/950039636/vector/about-us-flat-design-orange-round-vector-icon-in-eps-10.jpg?s=612x612&w=0&k=20&c=3eXs5SjFq4TWTIi7zoWifTn9q4xulmyB53dyuPP4ypg=";

}
