import { NgModule } from '@angular/core';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
@NgModule({
  exports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule
  ],
  imports: [
    MatToolbarModule, 
    MatButtonModule, 
    MatCardModule, 
    MatInputModule
  ]
})
export class MaterialModule { }
