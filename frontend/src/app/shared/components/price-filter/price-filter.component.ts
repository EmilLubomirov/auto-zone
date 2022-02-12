import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { ChangeContext, LabelType, Options } from "@angular-slider/ngx-slider";

@Component({
    selector: 'app-price-filter',
    templateUrl: './price-filter.component.html',
    styleUrls: ['./price-filter.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class PriceFilterComponent implements OnInit, OnChanges {
    @Input() minValue!: number;
    @Input() maxValue!: number;
    @Input() step!: number;

    minSliderPrice!: number;
    maxSliderPrice!: number;
    isLoading: boolean = true;
    options!: Options;

    @Output() handleRangeChange: EventEmitter<ChangeContext> = new EventEmitter();

    constructor() { }

    ngOnChanges(changes: SimpleChanges): void {
        if (this.isLoading) {
            this.minSliderPrice = this.minValue;
            this.maxSliderPrice = this.maxValue;

            this.options = {
                floor: this.minValue,
                ceil: this.maxValue,
                step: this.step,
                translate: (value: number, label: LabelType): string => {
                    if (value === this.maxSliderPrice) {
                        return (value - this.step) + '+';
                    }

                    return value + '';
                }
            };

            this.isLoading = false;
        }
    }

    ngOnInit(): void {

    }

    handleChange(changeContext: ChangeContext) {
        this.handleRangeChange.emit(changeContext);
    }

}
