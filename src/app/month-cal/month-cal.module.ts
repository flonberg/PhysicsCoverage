// month-cal.module.ts
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common'; 
import { MonthCalComponent } from './month-cal.component';

@NgModule({ 
  declarations: [MonthCalComponent], // Declare your component here
  imports: [CommonModule],           // Import modules this component needs
  exports: [MonthCalComponent]       // Export if other modules need to use it
})
export class MonthCalModule {
  
 } 