// Member Unassign Model Class
export class MemberUnAssign{
    connectorAlias: any;
    memberId: any;
    updatedDt: any;
    updatedBy: any
    constructor(values: Object = {}) {
      Object.assign(this, values);
  }
}