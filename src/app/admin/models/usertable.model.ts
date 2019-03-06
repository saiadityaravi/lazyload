// User Header model class
export interface userHeader {
    id?: any,
    alias: string,
    actions: any[],
    roleDesc: string,
    firstName: string,
    lastName: string,
    status: string,
    state: string,
    city: string
    language: string[],
    email: string,
    phoneNumber: string
    officeLocation: string
    timezone: string,
    nominationDt: any,
    welcomeEmailSentDt: any,
    trainingCompletionDt: any,
    lMSNotificationSentDt: any,
    nominationApprovalDt: any,
    approvedById: string,
    availabilityStartDt: any
    availabilityEndDate: any
    availabilityFlag: any,
    clientId: any,
    membersConnected:any;
    subClientId: any,
    createdDt: any,
    createdBy: any,
    updatedDt: any,
    updatedBy: any,
    associateVacation?: [
        {
            id?: any,
            alias: string,
            vacationStartDt?: any,
            vacationEndDt?: any,
            clientId: any,
            subClientId: any,
            createdDt: string,
            createdBy: string,
            updatedDt: string,
            updatedBy: string,
        }
    ]
}