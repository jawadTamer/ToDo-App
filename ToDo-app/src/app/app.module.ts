
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { provideToastr } from 'ngx-toastr';
@NgModule({
  declarations: [
  ],
  imports: [
    BrowserAnimationsModule,
    FormsModule,
    AppComponent  
  ],
  providers: [
    provideAnimations(),
    provideToastr(),
  ],  bootstrap: []
})
export class AppModule { }
