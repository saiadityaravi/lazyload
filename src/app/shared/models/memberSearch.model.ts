// Model class for member search
export class memberSearch {
    memberReferral: {
        source: any,
        alias: any
    };
    address: {
        city: any,
        state: any
    };
    gender: any = null;
    ethnicity: any = null;;
    preferredLanguage?: any = null;;
    memberTimeZone?: any = null;;
    eligibilityStatus: any = null;
    effectiveDate?: any;
    pageNumber: any;
    pageSize: any;
    terminationDate?: any;
    firstname?: any = null;
    lastname?: any = null;
    phoneNumber?: any = null;
    timeZone?: any = null;
    memberid?: any = null;
    referralEligibility?: any[];
    connectorAlias:string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}