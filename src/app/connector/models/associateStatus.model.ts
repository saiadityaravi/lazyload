export class associateStatus {
    alias: string;
    id: string;
    status: string;
    approvedById: string;
    updatedBy: string;
    updatedDt : string;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
} 