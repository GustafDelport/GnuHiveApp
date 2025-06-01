import { Component, ElementRef, Input, OnChanges } from '@angular/core';
import { BooleanInput } from '@angular/cdk/coercion';
import { parseBooleanInput } from '../../../utils/boolean-input.type';

@Component({
    selector: 'app-card',
    template: `<ng-content></ng-content>`,
    styleUrls: ['./card.component.scss'],
    standalone: true
})
export class CardComponent implements OnChanges {
    @Input() squared: BooleanInput = false;
    @Input() squaredBottomRounded: BooleanInput = false;
    @Input() squaredTopRounded: BooleanInput = false;

    isSquare: boolean = false;
    isSquareBottomRounded: boolean = false;
    isSquareTopRounded: boolean = false;

    constructor(private _host: ElementRef<HTMLElement>) {}

    public ngOnChanges(): void {
        this.isSquare = parseBooleanInput(this.squared);
        this.isSquareBottomRounded = parseBooleanInput(this.squaredBottomRounded);
        this.squaredTopRounded = parseBooleanInput(this.isSquareTopRounded);
        this.assignClasses();
    }

    private assignClasses() {
        if (this.isSquare) {
            this._host.nativeElement.classList.add('squared');
        } else if (this.isSquareBottomRounded) {
            this._host.nativeElement.classList.add('squared-bottom-rounded');
        } else if (this.isSquareTopRounded) {
            this._host.nativeElement.classList.add('squared-top-rounded');
        }
    }
}
