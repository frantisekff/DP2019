import { Component, OnInit, HostListener, Input } from "@angular/core";
import { HeaderService } from "./header.service";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"]
})
export class HeaderComponent implements OnInit {
  isSticky: boolean = false;
  cipherName: string;
  cipherType: string;

  constructor(private headerService: HeaderService) {
    headerService.cipherName.subscribe(value => {
      this.cipherName = value;
    });

    headerService.cipherType.subscribe(value => {
      this.cipherType = value;
    });
  }

  ngOnInit() {}

  @HostListener("window:scroll")
  checkScroll() {
    this.isSticky = window.pageYOffset >= 50;
  }
}
