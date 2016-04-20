import {Component, OnInit} from 'angular2/core';

@Component({
  selector: 'about',
  template: './about.html',
  styles: ['./about.scss'],
  providers: [],
  directives: [],
  pipes: []
})
export class About implements OnInit {

  constructor() {
    // Do stuff
  }

  ngOnInit() {
    console.log('Hello About');
  }

}
