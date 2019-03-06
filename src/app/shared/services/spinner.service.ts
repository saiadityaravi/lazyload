import { Injectable } from '@angular/core';

//cdk
import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { MatSpinner } from '@angular/material';

//rxjs
import { Subject } from 'rxjs'

// Spinner service that can be injected in components
@Injectable()
export class spinnerService {

    private spinnerTopRef = this.cdkSpinnerCreate();

    spin$: Subject<boolean> = new Subject()

    constructor(
        private overlay: Overlay,
    ) {

        this.spin$
            .subscribe(
                (res) => {
                    if (res) { this.showSpinner() }
                    else {
                        this.spinnerTopRef.hasAttached() ? this.stopSpinner() : null;
                    }
                }
            )
    }

    private cdkSpinnerCreate() {
        return this.overlay.create({
            hasBackdrop: true,
            backdropClass: 'dark-backdrop',
            positionStrategy: this.overlay.position()
                .global()
                .centerHorizontally()
                .centerVertically()
        })
    }

    private showSpinner() {
        console.log("attach")
        this.spinnerTopRef.attach(new ComponentPortal(MatSpinner))
    }

    private stopSpinner() {
        console.log("dispose")
        this.spinnerTopRef.detach();
    }
}