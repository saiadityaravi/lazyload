// Member filter Model Class
export class memberFiltered {
   address: {
        city: any,
        state: any
    };
    eligibilityStatus?: string = null;
    preferredLanguage?: string = null;
    phoneNumber?: string = null;
    timeZone?: string = null;
    ethnicity?: string = null;
    phonepalNextCallDate?: any = null;
    connectorNextCallDate?: any = null;
    connectorAlias?: string = null;
    pageNumber: any;
    pageSize:any;
    gender:any;
    memberTimeZone:any;
    isCritical?: boolean = null;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}