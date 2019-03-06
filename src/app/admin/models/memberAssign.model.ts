// Member Assign Model Class
export class MemberAssign{
    assignedDt: any;
    clientId: any = 1;
    connectorAlias: any;
    createdDt: any;
    createdBy: any;
    effectiveDt: any;
    memberId: any;
    primaryAlias: any;
    secondaryAlias: any;
    subClientId: any = 1000;
    termDt: any;
    updatedDt: any;
    updatedBy: any
    constructor(values: Object = {}) {
      Object.assign(this, values);
  }
  }