// Member Referral model class
export class MemberReferral {
    memberID: string;
    source: string;
    refereeName: string;
    notes: string;
    email: string;
    date: Date;
    contactNumber: string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
