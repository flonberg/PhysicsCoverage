import { Component } from '@angular/core';
import {  Router } from '@angular/router';
@Component({
  selector: 'app-whiteboard',
  standalone: true,
  imports: [],
  templateUrl: './whiteboard.component.html',
  styleUrl: './whiteboard.component.css'
})
export class WhiteboardComponent {
  constructor(private router: Router) {

        window.open('https://ion.mgh.harvard.edu/cgi-bin/main.pl?userid=fjl3', '_self'); 

  }
}
