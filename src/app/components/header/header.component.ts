import { Component, OnInit, HostListener, Input, OnDestroy } from "@angular/core";
import { HeaderService } from "./header.service";
import { Subscription } from 'rxjs';
import { style, trigger, state, transition, animate } from '@angular/animations';

export enum VisibilityState {
  Visible = 'visible',
  Hidden = 'hidden'
}

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
  styleUrls: ["./header.component.css"],
  animations: [
    trigger('scrollAnimation', [
      state(VisibilityState.Visible, style({
        // transform: 'translateY(0)'
      })),
      state(VisibilityState.Hidden, style({
        // transform: 'translateY(-154px)',
        'z-index': -100
         // adjust this to the height of your header
      })),
      transition(`${VisibilityState.Visible} => ${VisibilityState.Hidden}`, animate('1000ms')),
      transition(`${VisibilityState.Hidden} => ${VisibilityState.Visible}`, animate('10ms'))
    ])
  ]
})
export class HeaderComponent implements OnInit, OnDestroy {
  bigNavbarCipherName: boolean = true;
  smallNavbarCipherName: boolean = false;

  cipherName: string;
  cipherNameSubscription: Subscription;
  cipherType: string;
  cipherTypeSubscription: Subscription;

  isHeader1Visible = VisibilityState.Visible;
  isHeader2Visible = VisibilityState.Hidden;

  constructor(private headerService: HeaderService) {
    this.cipherNameSubscription = headerService.cipherName.subscribe(value => {
      this.cipherName = value;
    });

    this.cipherTypeSubscription = headerService.cipherType.subscribe(value => {
      this.cipherType = value;
    });
  }

  ngOnInit() {}

  @HostListener("window:scroll")
  checkScroll() {
    // this.bigNavbarCipherName = window.pageYOffset >= 50;
    // if(this.bigNavbarCipherName){
    //   // this.isHeader1Visible = VisibilityState.Hidden;
    //   this.isHeader2Visible = VisibilityState.Visible;
    // } else {
    //   // this.isHeader1Visible = VisibilityState.Visible;
    //   this.isHeader2Visible = VisibilityState.Hidden;
    // }
  }

  ngOnDestroy(){
    this.cipherNameSubscription.unsubscribe();
    this.cipherTypeSubscription.unsubscribe();
  }
}
