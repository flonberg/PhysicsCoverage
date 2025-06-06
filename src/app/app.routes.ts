import { Routes } from '@angular/router';
import { MonthCalComponent } from './month-cal/month-cal.component';
import { WeekCalComponent } from './week-cal/week-cal.component';

export const routes: Routes = [
    {path: '', component: MonthCalComponent},
    {path: 'Week', component: WeekCalComponent},
];
