import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavbarComponent } from "../navbar/navbar.component";
import { NavbarStateService } from '../../shared/services/navbar-state.service';

@Component({
  selector: 'app-aboutus',
  standalone: true,
  imports: [NavbarComponent],
  templateUrl: './aboutus.component.html',
  styleUrl: './aboutus.component.css'
})
export class AboutusComponent implements OnInit, OnDestroy {
  image:string="https://media.istockphoto.com/id/950039636/vector/about-us-flat-design-orange-round-vector-icon-in-eps-10.jpg?s=612x612&w=0&k=20&c=3eXs5SjFq4TWTIi7zoWifTn9q4xulmyB53dyuPP4ypg=";

  constructor(private navbarState: NavbarStateService) {}

  ngOnInit(): void {
    this.navbarState.setAboutUsActive(true);
  }

  ngOnDestroy(): void {
    this.navbarState.setAboutUsActive(false);
  }
}
