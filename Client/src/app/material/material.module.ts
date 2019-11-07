import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule
  ],
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule, 
    MatSelectModule, 
    MatDatepickerModule
  ]
})
export class MaterialModule { }
