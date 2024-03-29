export interface MemberNotes {
    id: string;
    associateId: string;
    memberId: string;
    callerRoleDesc: string;
    typeOfCall: string
    callDt: string;
    callDuration: string;
    callOutcome: string;
    callStatus: string;
    nextScheduledCallDt: string;
    callSummary: string;
    anyConcern: string;
    redFlag: string;
    loneliness: string;
    socialization: string;
    mood: string;
    barriers: string[];
    physicalActivity: string[];
    comments: string;
    ls1FeelLackOfCompanionship: string;
    ls2FeelIsolated: string;
    pHQ2LittleInterestDoingThings: string;
    pHQ2FeelingDepressed: string;
    communityResources: string[];
    anthemPrograms: string[];
    careCoordination: string[];
    isolationScore: string;
    riskStratification: string;
    followupCallDt: string;
    referralSource: string;
    productType: string;
    clientId: string;
    subClientId: string;
    createdDt: string;
    createdBy: string;
    updatedDt: string;
    updatedBy: string;
    referralsForFollowupNeeded: string;
  }
