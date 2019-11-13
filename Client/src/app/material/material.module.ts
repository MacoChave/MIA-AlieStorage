import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatTreeModule } from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatMenuModule } from '@angular/material/menu';

@NgModule({
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatSnackBarModule, 
    MatSidenavModule, 
    MatTreeModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatMenuModule
  ],
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatSnackBarModule, 
    MatSidenavModule, 
    MatTreeModule, 
    MatIconModule, 
    MatProgressBarModule, 
    MatMenuModule
  ]
})
export class MaterialModule { }
