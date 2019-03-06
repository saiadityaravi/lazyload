import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { connectorServices } from '../../shared/services/connector.services';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';

@Directive({
    selector: '[cdkDetailPhonepalRow]'
})
export class CdkDetailPhonepalRowDirective {
    private row: any;
    private tRef: TemplateRef<any>;
    private opened: boolean;
    private eleArray: any;
    private icon: any;
    indexClicked: any = -1;
    rowopenedset: boolean;
    private view
    @HostBinding('class.expanded')
    get expended(): boolean {
        return this.opened;
    }

    @Input()
    set cdkDetailPhonepalRow(value: any) {
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

    constructor(private urlConstantService: UrlconstantsService, public vcRef: ViewContainerRef, private messageService: SharedService, private connectorServices: connectorServices) { }
    urlconstant = this.urlConstantService.getUrls();

    @HostListener('click')
    onClick(index): void {
        let disabled: any = event.target;
        this.eleArray = event.currentTarget

        let rowopened: string = this.eleArray.getAttribute("data-opened");
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
        if (isIEOrEdge) {
            if (disabled.nodeName == "BUTTON"  &&(disabled.getAttribute('ng-reflect-disabled') == "false")) {
                this.messageService.seticonMessage(disabled.children[0].children[0].innerText, this.row.alias);
            } else if (disabled.nodeName !== "BUTTON" && this.eleArray.firstElementChild.firstElementChild.innerText) {
                this.view = this.messageService.getViewPhonepal();
                this.icon = this.view;
                this.icon?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText!==null?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText="add":null:null;
                this.view?this.view.clear():null;
                this.getPhonepalData()
            }
        } else {
            if (event.srcElement.nodeName == "MAT-ICON" && disabled.getAttribute("data-disabled") == "false") {
                this.messageService.seticonMessage(event.srcElement.textContent, this.row.alias);
            } else if (event.srcElement.nodeName != "MAT-ICON" && this.eleArray.firstElementChild.firstElementChild.innerText) {
                this.view = this.messageService.getViewPhonepal();
                this.icon = this.view;
                this.icon?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText!==null?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText="add":null:null;
                this.view?this.view.clear():null;
                this.getPhonepalData()
            }
        }
    }

    // Get assigned member using alias and if member present, retrieve member information as well as member interaction details
    getPhonepalData(){
        let getMeberurl = this.urlconstant.getAssignedMember.replace('{alias}', this.row.alias);
        this.rowopenedset = this.eleArray.getAttribute("opened") == "false" ? false : true;
        // Calling next to emit value from the observer
        this.messageService.setRowopenedphonepal(this.vcRef == this.view &&  this.rowopenedset);
        if (this.eleArray.firstElementChild.firstElementChild.innerText != null) {
            if ((this.vcRef == this.view) &&  this.rowopenedset) {
                this.eleArray.firstElementChild.firstElementChild.innerText = 'add';
                this.toggle('');
            } else {
                this.connectorServices.getAssignedMember(getMeberurl).subscribe(memberData => {
                    if(memberData){
                        let memberDetailsbyid = this.urlconstant.getMemberByMemberId.replace('{memberId}', memberData.memberId);
                        let urlMemberReferral = this.urlconstant.getMemberReferralInformationByMemberID.replace('{memberId}',memberData.memberId);
                        let memberinteractionbyid = this.urlconstant.getLatestcallInteraction.replace('{memberId}', memberData.memberId).replace('{alias}', this.row.alias )
                        this.connectorServices.getmemberInformationandInteraction(memberDetailsbyid, memberinteractionbyid,urlMemberReferral ).subscribe(data => {
                            this.eleArray.firstElementChild.firstElementChild.innerText = 'remove';
                            this.toggle(data);
                        })
                    }else{
                        this.toggle('');
                    }
                 
                })
            }
        }
    }
    toggle(data): void {
        if (this.vcRef == this.view &&  this.rowopenedset) {
            this.eleArray.setAttribute("opened", false);
            this.vcRef.clear();
        } else {
            this.render();
            this.eleArray.setAttribute("opened", true);
            this.messageService.setMemberData(data);
        }

        this.opened = this.vcRef.length > 0;

    }

    private render(): void {
        this.vcRef.clear();
        if (this.tRef && this.row) {
            this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
            this.messageService.setViewPhonepal(this.vcRef)
        }
    }
}
