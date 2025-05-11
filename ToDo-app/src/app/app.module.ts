import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { provideToastr } from 'ngx-toastr';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { CommonModule } from '@angular/common';

@NgModule({
  declarations: [
  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AppComponent,
    MatDialogModule,
    MatSelectModule,
    MatFormFieldModule,
    MatInputModule,
    CommonModule
  ],
  providers: [
    provideAnimations(),
    provideToastr(),
  ],  
  bootstrap: []
})
export class AppModule { }
