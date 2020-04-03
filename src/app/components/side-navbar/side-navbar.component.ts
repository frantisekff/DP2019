import { Component, OnInit, Input, HostListener } from "@angular/core";

@Component({
  selector: "app-side-navbar",
  templateUrl: "./side-navbar.component.html",
  styleUrls: ["./side-navbar.component.css"]
})
export class SideNavbarComponent implements OnInit {
  @Input() public topGap;
  fixed = false;
  selectedIndex = 0;
  private lastPositionOfscrolling = 0;
  sideMenu = [
    {
      title: "Set inputs",
      active: true,
      id: "inputs",
      bottomPosition: 0,
      topPosition: 0

    },
    {
      title: "Find decryption key",
      active: false,
      id: "findKey",
      bottomPosition: 0,
      topPosition: 0
    },
    {
      title: "Compare bigrams frequency",
      active: false,
      id: "compareBigrams",
      bottomPosition: 0,
      topPosition: 0
    },

  ];
  constructor() { }

  ngOnInit() { }

  scroll(elementObj, index: number) {
    this.selectedIndex = index;
    const element = document.getElementById(elementObj.id);
    const headerOffset = 200;
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth"
    });
  }

  @HostListener("window:scroll")
  checkScroll() {
    const scrollDownCheckPosition = 200;
    let index = 0;
    for (const value of this.sideMenu) {
      value.bottomPosition = document.getElementById(value.id).getBoundingClientRect().bottom;
      value.topPosition = document.getElementById(value.id).getBoundingClientRect().top;
      // if scroll down
      if (this.lastPositionOfscrolling < window.pageYOffset) {
        if (value.bottomPosition <= scrollDownCheckPosition && value.bottomPosition > 0) {
          this.selectedIndex = index + 1;
          break;
        }
        // if scroll up
      } else if (this.lastPositionOfscrolling > window.pageYOffset) {
        if (value.topPosition >= scrollDownCheckPosition && value.topPosition > 0) {
          this.selectedIndex = index;
          break;
        }
      }

      index += 1;
    }
    // console.log(this.sideMenu);
    // console.log(window.pageYOffset);



    this.lastPositionOfscrolling = window.pageYOffset;
  }
}
