
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';



import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { provideToastr } from 'ngx-toastr';
@NgModule({
  declarations: [

  ],
  imports: [
    HttpClientModule,
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
