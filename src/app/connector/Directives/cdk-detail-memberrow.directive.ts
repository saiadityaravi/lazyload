import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';
import { connectorServices } from '../../shared/services/connector.services';

@Directive({
    selector: '[cdkDetailMemberRow]'
})
export class CdkDetailMemberRowDirective {
    private row: any;
    private tRef: TemplateRef<any>;
    private opened: boolean;
    private eleArray: any;
    indexClicked: any = -1;
    rowopenedset: boolean;
    rowopened: string;
    view: ViewContainerRef;
    @HostBinding('class.expanded')
    get expended(): boolean {
        return this.rowopenedset;
    }

    @Input()
    set cdkDetailMemberRow(value: any) {
        if (value !== this.row) {
            this.row = value;
        }
    }

    @Input()
    set cdkRowIndex(value: any) {
        console.log(value);
    }

    @Input('cdkDetailRowTpl')
    set template(value: TemplateRef<any>) {
        if (value !== this.tRef) {
            this.tRef = value;
            // this.render();
        }
    }

    constructor(private urlconstntservivce: UrlconstantsService, private connectorServices: connectorServices, public vcRef: ViewContainerRef, private messageService: SharedService) { }
    urlconstant = this.urlconstntservivce.getUrls();
    @HostListener('click')
    onClick(index): void {
        let disabled: any = event.target;
        this.eleArray = event.currentTarget;
         this.rowopened = this.eleArray.getAttribute("data-opened");
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
        if (isIEOrEdge) {
            if (disabled.nodeName == "BUTTON" && (disabled.getAttribute('ng-reflect-disabled') == "false")) {
                // Calling next to emit value from the observer
                this.messageService.seticonmemberMessage(disabled.children[0].innerText, this.eleArray.getAttribute("data-row"));
            } else if (disabled.nodeName !== "BUTTON" ) {
                this.view = this.messageService.getView();
                this.view?this.view.clear():null;
                this.getMemberData();
            }
        } else {

            if (event.srcElement.nodeName == "MAT-ICON" && disabled.getAttribute("data-disabled") == "false") {
                // Calling next to emit value from the observer
                this.messageService.seticonmemberMessage(event.srcElement.textContent, this.eleArray.getAttribute("data-row"));
             } else if (event.srcElement.nodeName != "MAT-ICON") {
                this.view = this.messageService.getView();
                this.view?this.view.clear():null;
                this.getMemberData();
            }
        }
    }

    toggle(phonepalData): void {
        if (this.vcRef == this.view &&  this.rowopenedset) {
            this.vcRef.clear();
            this.eleArray.setAttribute("opened", false);
        } else {
            this.render();
            this.eleArray.setAttribute("opened", true);
            this.messageService.setPhonepalData(phonepalData);
        }
        this.opened = this.vcRef.length > 0;
    }

    getMemberData(){
        this.rowopenedset = this.eleArray.getAttribute("opened") == "false" ? false : true;
        // Calling next to emit value from the observer
        this.messageService.setRowopenedMember(this.vcRef == this.view &&  this.rowopenedset);
        let getPhonepalurl = this.urlconstant.getPhonepalAssignedByMemberId.replace('{memberId}', this.row.memberId);
        let urlMemberReferral = this.urlconstant.getMemberReferralInformationByMemberID.replace('{memberId}', this.row.memberId);
        if ((this.vcRef == this.view) &&  this.rowopenedset) {
            this.toggle('');
        } else {
            this.connectorServices.getAssignedPhonepal(getPhonepalurl).subscribe(data => {
                if (data.primaryAlias?data.primaryAlias!=null:false) {
                    let getLatestcallInteraction = this.urlconstant.getLatestcallInteraction.replace('{memberId}', this.row.memberId).replace('{alias}', data.primaryAlias);
                    let associateProfileUrl = this.urlconstant.getAssociateUrl.replace('{alias}', data.primaryAlias)
                    this.connectorServices.getPhonepalInformationandInteraction(associateProfileUrl, getLatestcallInteraction, urlMemberReferral).subscribe(phonepalData => {
                        this.toggle(phonepalData);
                    })
                } else {
                    let getLatestcallInteraction = this.urlconstant.getLatestcallInteraction.replace('{memberId}', this.row.memberId).replace('{alias}', sessionStorage.getItem('alias'));
                    this.connectorServices.getMemberInteraction(getLatestcallInteraction, urlMemberReferral ).subscribe(data => {
                        this.toggle(data)
                    })
                }
            }, (error) => {

            })
        }
    }
    private render(): void {
        this.vcRef.clear();
        if (this.tRef && this.row) {
            this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row, index: this.indexClicked });
            this.messageService.setView(this.vcRef)
        }
    }
}
