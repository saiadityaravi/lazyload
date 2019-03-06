// Model class to enroll phonepal
export class PhonepalEnroll {
    id?:any;
    alias: string;
    roleDesc: string = "phonepal"
    firstName: string;
    lastName: string;
    status: string;
    state: string;
    city: string
    language: string[];
    email: string;
    phoneNumber: string
    officeLocation: string
    timezone: string;
    source:string;
    nominationDt: any = "";
    welcomeEmailSentDt: any = "";
    trainingCompletionDt: any = "";
    lmsNotificationSentDt: any = "";
    nominationApprovalDt: any = "";
    approvedById: string = "";
    availabilityStartDt: any
    availabilityEndDate: any
    availabilityFlag: any = "";
    clientId: any = "";
    subClientId: any = "";
    createdDt: any = "";
    createdBy: any = "";
    updatedDt: any = "";
    updatedBy: any = "";
    associateVacation?: [
        {
            id?:any;
            alias: string;
            vacationStartDt?: any,
            vacationEndDt?: any,
            clientId: any,
            subClientId: any,
            createdDt: string,
            createdBy: string,
            updatedDt: string,
            updatedBy: string;
        }
    ]
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }

}