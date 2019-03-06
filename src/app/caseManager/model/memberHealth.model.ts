// Member Health model class
export class MemberHealth {
    anySocialSupport:string;
    hasNooneToTalkTo:string;
    healthStatusDt:Date;
    howOftenMemberLeaveHome:String;
    liveAlone:String;
    redFlag:string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}
