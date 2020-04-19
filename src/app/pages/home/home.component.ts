import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HeaderService } from 'src/app/components/header/header.service';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html',
    styleUrls: ["./home.component.css"]

})
export class Home implements OnInit {
    id: number;
    constructor(private route: ActivatedRoute, private headerService: HeaderService) {
        headerService.showInfoPanel.next(false);
      }
    
    ngOnInit() {
        // this.id = this.route.snapshot.params['id'];
        this.route.params.subscribe(
            (params) => {
                this.id = params['id'];
            }
        );
    }
}