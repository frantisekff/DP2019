import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-home',
    templateUrl: 'home.component.html'
})
export class Home implements OnInit {
    id: number;
    constructor(private route: ActivatedRoute) { }

    ngOnInit() {
        // this.id = this.route.snapshot.params['id'];
        this.route.params.subscribe(
            (params) => {
                this.id = params['id'];
            }
        );
    }
}