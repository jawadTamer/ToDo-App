import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DashboardComponent } from "./component/dashboard/dashboard.component";


@Component({
  selector: 'app-root',

  imports: [RouterOutlet, DashboardComponent, SignupComponent],

  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'ToDo-app';
}
