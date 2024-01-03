/* eslint-disable max-len */
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-all-categories',
  templateUrl: './all-categories.component.html',
  styleUrls: ['./all-categories.component.scss'],
})
export class AllCategoriesComponent implements OnInit {

  constructor() { }
// eslint-disable-next-line @typescript-eslint/member-ordering
items = [
 {name:'egg',selected:true, image:'https://th.bing.com/th?q=10+Eggs&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247'},
  {name:'mushroom',selected:false, image:'https://th.bing.com/th?q=Mushroom+Eat&w=120&h=120&c=1&rs=1&qlt=90&cb=1&pid=InlineBlock&mkt=en-WW&cc=GH&setlang=en&adlt=moderate&t=1&mw=247'},
  {name:'meat',selected:false, image:'https://th.bing.com/th/id/OIP.lBavTHAJ1Py9OHvce1GFJgHaFY?w=216&h=180&c=7&r=0&o=5&pid=1.7'},
  {name:'fruits', selected:false, image:'https://th.bing.com/th/id/OIP.aDAUPSgxhdmIsvvTCvDuVQHaEK?w=280&h=180&c=7&r=0&o=5&pid=1.7'},
  {name:'Vegetables', selected:false, image:'https://th.bing.com/th/id/OIP.l1IW-rJBySmEOq5UD-OlJwHaFj?w=216&h=180&c=7&r=0&o=5&pid=1.7'},


];
  ngOnInit() {}

}
