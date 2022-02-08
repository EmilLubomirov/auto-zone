import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit {
    @Input() url!: string;
    @Output() handleMapLoad: EventEmitter<any> = new EventEmitter();

    constructor() {  }

    ngOnInit(): void {
    }

}
