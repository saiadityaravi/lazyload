import { Directive, HostBinding, HostListener, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { SharedService } from '../../shared/services/shared.service';
import { UrlconstantsService } from '../../shared/services/urlconstants.service';
import { CaseManagerService } from '../service/casemanager.data.service';

// Custom Directive - CdkDetailMemberRowDirective
@Directive({
    selector: '[cdkDetailMemberRow]'
})
export class CdkDetailMemberRowDirective {
    private row: any;
    private tRef: TemplateRef<any>;
    private opened: boolean;
    private eleArray: any;
    indexClicked : any=-1;
    rowopenedset: boolean;
    private icon:any;
    private view
    @HostBinding('class.expanded')
    get expended(): boolean {
        return this.opened;
    }

    // Configure directive to take inputs
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

    constructor(private urlConstantService: UrlconstantsService,public vcRef: ViewContainerRef, private messageService: SharedService,private caseManagerServices: CaseManagerService) { }
    urlconstant = this.urlConstantService.getUrls();

    // Listen to events of the host element
    @HostListener('click')
    onClick(index): void {
        this.vcRef.clear();
        let disabled: any = event.target;
        this.eleArray = event.currentTarget;
        let rowopened:string = this.eleArray.getAttribute("data-opened");
        let isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent)
        if (isIEOrEdge) {
            if (disabled.nodeName == "BUTTON"  &&(disabled.getAttribute('ng-reflect-disabled') == "false")) {
                this.messageService.seticonMessage(disabled.children[0].children[0].innerText, this.row.alias);
            } else if (disabled.nodeName !== "BUTTON" && this.eleArray.firstElementChild.firstElementChild.innerText) {
                this.view = this.messageService.getViewCasemanager();
                this.icon = this.view;
                this.icon?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText!==null?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText="add":null:null;
                this.view?this.view.clear():null;
                this.getMemberReferral()
            }
        } else {
            if (event.srcElement.nodeName == "MAT-ICON" && disabled.getAttribute("data-disabled") == "false") {
                this.messageService.seticonMessage(event.srcElement.textContent, this.row.alias);
            } else if (event.srcElement.nodeName != "MAT-ICON" && this.eleArray.firstElementChild.firstElementChild.innerText) {
                this.view = this.messageService.getViewCasemanager();
                this.icon = this.view;
                this.icon?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText!==null?this.icon._data.renderElement.firstElementChild.firstElementChild.innerText="add":null:null;
                this.view?this.view.clear():null;
                this.getMemberReferral()
            }
        }
    }

    // Get Member Health Details as well as All Member Referal Data for MemberId
    getMemberReferral(){
        let urlMemberHealth = this.urlconstant.getMemberHealthInformationByMemberID.replace('{memberId}', this.row.memberId);
        let urlMemberReferral = this.urlconstant.getMemberReferralInformationByMemberID.replace('{memberId}', this.row.memberId);
        this.rowopenedset = this.eleArray.getAttribute("opened") == "false" ? false : true;
        this.messageService.setRowOpenedCaseManagerDetailView(this.vcRef == this.view &&  this.rowopenedset);
        if (this.eleArray.firstElementChild.firstElementChild.innerText != null) {
            if ((this.vcRef == this.view) &&  this.rowopenedset) {
                this.eleArray.firstElementChild.firstElementChild.innerText = 'add';
                this.toggle('');
            } else {
                this.caseManagerServices.getMemberHealthandReferralInformation(urlMemberHealth,urlMemberReferral).subscribe(memberData => {
                    if(memberData){
                        if(/msie\s|trident\/|edge\//i.test(window.navigator.userAgent)){
                            memberData[1].forEach(obj => {
                                obj = Object.assign(obj,memberData[0].filter( rec => rec.createdBy == obj.alias && new Date(rec.createdDt).setHours(0,0,0,0) == new Date(obj.date).setHours(0,0,0,0)))
                            });
                        }else{
                            memberData[1].forEach(obj => {
                                var obj2 = memberData[0].filter( rec => rec.createdBy == obj.alias && new Date(rec.createdDt).setHours(0,0,0,0) == new Date(obj.date).setHours(0,0,0,0));
                                Object.keys(obj2[0]).forEach(key => obj[key] = obj2[0][key]);
                            });
                        }
                        this.eleArray.firstElementChild.firstElementChild.innerText = 'remove';
                        this.toggle(memberData[1]);
                    }else{
                        this.toggle('');
                    }
                })
            }
        }
    }

    toggle(data:any): void {
        if ((this.vcRef == this.view) &&  this.rowopenedset) {
            this.eleArray.setAttribute("opened", false);
            this.vcRef.clear();
        } else {
            this.render();
           this.eleArray.setAttribute("opened", true);
           // Calling next to emit value from the observer
            this.messageService.setMemberHealthandReferralData(data);
        }

        this.opened = this.vcRef.length > 0;

    }

    private render(): void {
        this.vcRef.clear();
        if (this.tRef && this.row) {
            this.vcRef.createEmbeddedView(this.tRef, { $implicit: this.row });
            this.messageService.setViewCasemanager(this.vcRef)
        }
    }
}
