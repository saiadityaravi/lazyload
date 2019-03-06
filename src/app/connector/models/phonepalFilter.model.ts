export class phonepalFiltered {
    firstName?: string=null;
    lastName?: string=null;
    status?: string=null;
    language?: string=null;
    phoneNumber?: string=null;
    timezone?: string=null;
    city?:any=null;
    state?:any=null;
    availabilityStartDt?: any=null;
    availabilityEndDate?:any= null;
    trainingCompletionDt: any;
    nominationApprovalDt:any;
    nominationDt:any;
    pageNumber: any;
    pageSize: any;
    roleDesc:string="phonepal" 
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}