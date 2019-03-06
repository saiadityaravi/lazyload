export class memberFiltered {
    firstName?: string = null;
    lastName?: string = null;
    state?: string;
    city?: string
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
    isCritical?: boolean = null;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}