import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    cloudName = environment.ANGULAR_APP_CLOUD_NAME;
    isLoading = true;

    constructor() { }

    ngOnInit(): void {
    }

}
