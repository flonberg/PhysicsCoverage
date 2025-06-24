import { Routes } from '@angular/router';
import { MonthCalComponent } from './month-cal/month-cal.component';
import { WeekCalComponent } from './week-cal/week-cal.component';
import { TimeawayComponent } from './timeaway/timeaway.component';
import { MydutiesComponent } from './myduties/myduties.component';
import { WhiteboardComponent } from './whiteboard/whiteboard.component';


export const routes: Routes = [
    {path: '', component: MonthCalComponent},
    {path: 'Week/:id', component: WeekCalComponent},
    {path: 'Month/:id', component: MonthCalComponent},
    {path: 'Timeaway/:id', component: TimeawayComponent},
    {path: 'Myduties/:id', component: MydutiesComponent},
    {path: 'Whiteboard/:id', component: WhiteboardComponent},
    {path: '*', component: MonthCalComponent},
    
];
