import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { ChangeContext, Options } from "@angular-slider/ngx-slider";

@Component({
    selector: 'app-price-filter',
    templateUrl: './price-filter.component.html',
    styleUrls: ['./price-filter.component.css']
})
export class PriceFilterComponent implements OnInit, OnChanges {
    @Input() minValue!: number;
    @Input() maxValue!: number;

    isLoading: boolean = true;

    options: Options = {
        floor: 0,
        ceil: 300,
        step: 50,
    };


    @Output() handleRangeChange: EventEmitter<ChangeContext> = new EventEmitter();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        this.isLoading = false;
    }

    ngOnInit(): void {
        
    }

    handleChange(changeContext: ChangeContext){
        this.handleRangeChange.emit(changeContext);
    }

}
