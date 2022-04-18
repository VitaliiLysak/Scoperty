import { Component } from '@angular/core';

import { Founder } from '../../models/founder.model';

const FOUNDERS: Founder[] = [
  {
    image: 'michael-kasch.png',
    name: 'Dr. Michael Kasch',
    role: 'CEO',
  },
  {
    image: 'sebastian-frenzel.png',
    name: 'Sebastian Frenzel',
    role: 'CPO',
  },
  {
    image: 'anika_andresen.jpg',
    name: 'Anika Andresen',
    role: 'CMO',
  },
  {
    image: 'helen-reis.png',
    name: 'Helen Reis',
    role: 'Head of Business Development',
  },
  {
    image: 'christian-wiesner.png',
    name: 'Christian Wiesner',
    role: 'Head of Finance',
  },
  {
    image: 'sebastian-stoll.png',
    name: 'Dr. Sebastian Stoll',
    role: 'Head of Data',
  },
];

@Component({
  selector: 'app-founders',
  templateUrl: './founders.component.html',
  styleUrls: [
    './founders.component.css',
  ],
})
export class FoundersComponent {
  public _name: string = 'founders';

  public founders: Founder[] = FOUNDERS;
}
