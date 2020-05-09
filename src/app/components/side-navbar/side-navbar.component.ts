import {
  Component,
  OnInit,
  AfterContentChecked,
  Input,
  HostListener,
  AfterViewInit,
} from "@angular/core";
import { Subject } from "rxjs";

@Component({
  selector: "app-side-navbar",
  templateUrl: "./side-navbar.component.html",
  styleUrls: ["./side-navbar.component.css"],
})
export class SideNavbarComponent implements OnInit, AfterViewInit {
  @Input() public topGap;
  fixed = false;
  selectedIndex = 0;
  private lastPositionOfscrolling = 0;
  initGap = 1;
  @Input() sideMenu = [];
  gap: Subject<number> = new Subject<number>();
  topGap2;
  constructor() {}
  ngOnInit() {
    this.gap.subscribe((value) => {
      this.topGap2 = value;
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      let height = document.getElementById("header").getBoundingClientRect()
        .height;
      console.log(height);
      this.gap.next(height);
      this.initGap = 0;
    }, 0);
  }

  scroll(elementObj, index: number) {
    this.selectedIndex = index;
    const element = document.getElementById(elementObj.id);
    const headerOffset = 200;
    const elementPosition =
      element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - headerOffset;

    window.scrollTo({
      top: offsetPosition,
      behavior: "smooth",
    });
  }

  @HostListener("window:resize", ["$event"])
  onResize(event) {
    let height = document.getElementById("header").getBoundingClientRect()
      .height;
    console.log(height, event.target.innerWidth);

    this.gap.next(height);
  }

  @HostListener("window:scroll")
  checkScroll() {
    const scrollDownCheckPosition = 200;
    let index = 0;
    for (const value of this.sideMenu) {
      value.bottomPosition = document
        .getElementById(value.id)
        .getBoundingClientRect().bottom;
      value.topPosition = document
        .getElementById(value.id)
        .getBoundingClientRect().top;
      // if scroll down
      if (this.lastPositionOfscrolling < window.pageYOffset) {
        if (
          value.bottomPosition <= scrollDownCheckPosition &&
          value.bottomPosition > 0
        ) {
          this.selectedIndex = index + 1;
          break;
        }
        // if scroll up
      } else if (this.lastPositionOfscrolling > window.pageYOffset) {
        if (
          value.topPosition >= scrollDownCheckPosition &&
          value.topPosition > 0
        ) {
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
