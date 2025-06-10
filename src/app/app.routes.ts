import { Routes } from '@angular/router';
import { MonthCalComponent } from './month-cal/month-cal.component';
import { WeekCalComponent } from './week-cal/week-cal.component';
import { TimeawayComponent } from './timeaway/timeaway.component';


export const routes: Routes = [
    {path: 'Month/:id', component: MonthCalComponent},
    {path: 'Week/:id', component: WeekCalComponent},
   {path: 'Timeaway/:id', component: TimeawayComponent},
      {path: '', component: MonthCalComponent},
   
    
    
];
