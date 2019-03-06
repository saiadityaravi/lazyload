

export class AssociateTrainingStatus {
    id: string;
    alias: string;
    trainingCompletionDt: any;
    trainingStatus: any;
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}