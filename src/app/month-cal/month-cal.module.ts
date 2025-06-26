// month-cal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MonthCalComponent } from './month-cal.component';
import { FormsModule } from '@angular/forms';

@NgModule({ 
  declarations: [MonthCalComponent], // Declare your component here
  imports: [CommonModule, FormsModule],           // Import modules this component needs
  exports: [MonthCalComponent]       // Export if other modules need to use it
})
export class MonthCalModule {
  
 } 