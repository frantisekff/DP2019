import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-side-navbar',
  templateUrl: './side-navbar.component.html',
  styleUrls: ['./side-navbar.component.css']
})
export class SideNavbarComponent implements OnInit {
  @Input() public topGap;
  constructor() { }

  ngOnInit() {
  }

  scroll(elementId: string) {
    const element = document.getElementById(elementId);
    const headerOffset = 100;
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }

}
