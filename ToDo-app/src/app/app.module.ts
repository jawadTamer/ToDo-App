
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { BrowserAnimationsModule, provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { provideToastr } from 'ngx-toastr';
import { ConfirmDialogComponent } from './component/confirm-dialog/confirm-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';
@NgModule({

  declarations: [

  ],
  imports: [
    HttpClientModule,
    BrowserAnimationsModule,
    FormsModule,
    AppComponent,MatDialogModule

  ],
  providers: [
    provideAnimations(),
    provideToastr(),
  ],  bootstrap: []
})
export class AppModule { }
