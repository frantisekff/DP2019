import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { HeaderService } from "src/app/components/header/header.service";

@Component({
  selector: "app-about",
  templateUrl: "./about.component.html",
  styleUrls: ["./about.component.css"],
})
export class AboutComponent implements OnInit {
  showInfoPanel: boolean;
  showInfoPanelSubscription: Subscription;

  constructor(private headerService: HeaderService) {
    headerService.showInfoPanel.next(false);
  }

  ngOnInit() {}
}
