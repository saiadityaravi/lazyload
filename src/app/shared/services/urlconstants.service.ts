import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'

@Injectable()

// Urlconstants service that can be injected in components
export class UrlconstantsService {
    private baseContext = '/togetherness/';
    constructor() {
        this.baseContext = environment.searchAssociateUrl + this.baseContext;
    }
    // Method to get API URLs used within the application
    public getUrls() {
        const urls = {
            'getJwt': this.baseContext.concat('token/generate-token/{alias}'),
            'searchAssociaUrl': this.baseContext.concat('search/{alias}'),
            'getAssociateUrl': this.baseContext.concat('associateProfile/{alias}'),
            'getLdapUserData': this.baseContext.concat('getLdapSigninDetail?userName={alias}'),
            'enrollPhonepal': this.baseContext.concat('enroll'),
            'getMemberdata': this.baseContext.concat('memberInformation/{memberId}'),
            'updateAssociateProfile': this.baseContext.concat('associateProfile'),
            'getAllMembers': this.baseContext.concat('memberInformation/all/{page}/{offset}'),
            'getAllPhonepals': this.baseContext.concat('searchAssociate'),
            'getAssignedMember': this.baseContext.concat('assignMember/{alias}'),
            'getMemberInteractionById': this.baseContext.concat('memberInteraction/{memberId}'),
            'getMemberByMemberId': this.baseContext.concat('memberInformation/{memberId}'),
            'getPhonepalAssignedByMemberId': this.baseContext.concat('assignedPhonepal/{memberId}'),
            'getMembersReferredByCaseManager': this.baseContext.concat('caseManager/memberList/{alias}/{page}/{records}'),
            'getMemberDetails': this.baseContext.concat('/togetherness/getMemberInfo?memberId={memberId}'),
            //'getPhonepalAssignedByMemberId': this.baseContext.concat('assignedPhonepal/{memberId}')
            //'getPhonepalAssignedByMemberId': this.baseContext.concat('assignedPhonepal/{memberId}')
            'memberNotesUrl': this.baseContext.concat('memberNotes/{memberId}'),
            'assignConnector': this.baseContext.concat('assign'),
            'unassignConnector': this.baseContext.concat('unassign'),
            'searchMemberUrl': this.baseContext.concat('searchMember'),
            'searchMemberNotAssigned': this.baseContext.concat('searchMemberNotAssigned'),
            'assignAssociateMember': this.baseContext.concat('assignPhonepal'),
            'postMemberInteraction': this.baseContext.concat('memberInteraction'),
            'unassignMember': this.baseContext.concat('unassignAssociateMember/{primaryAlias}'),
            'getConnectorAssignedMembers': this.baseContext.concat('assignedMembers/{connectorAlias}'),
            'associateTrainingStatus': this.baseContext.concat('associateTrainingStatus'),
            'associateStatus': this.baseContext.concat('associateStatus'),

            'getMemberHealthInformationByMemberID': this.baseContext.concat('memberHealthDetails/{memberId} '),
            'getMemberReferralInformationByMemberID': this.baseContext.concat('memberAllReferral/{memberId} '),
            'getMemberReferralSearch': this.baseContext.concat('searchMembersReferred '),

            'saveMemberData': this.baseContext.concat('memberInformation'),
            'getCareMoreMemberData': this.baseContext.concat('getMemberInfo?memberId={memberId}'),
            'getAnthemMemberData': this.baseContext.concat('getAnthemMemberInfo?memberId={memberId}'),
            //'getAnthemMemberData':this.baseContext.concat('searchMembersReferred '), 
            'getLookUpValues': this.baseContext.concat('getLookUpValues'),
            'getPhonepalCount': this.baseContext.concat('associateProfiles/{roleDesc}'),
            'getMemberCount': this.baseContext.concat('memberInformations/totalMemberCount'),
            'allCallDuration': this.baseContext.concat('memberInteractions/allCallDuration'),
            'getMemberNotes': this.baseContext.concat('memberInteraction/{memberId}'),
            'getCallOutCome': this.baseContext.concat('callOutCome/{id}'),
            'getMemberId': this.baseContext.concat('assignMember/{primaryAlias}'),
            'getMemberInfo': this.baseContext.concat('memberInformation/{memberId}'),
            'postMemberNotes': this.baseContext.concat('memberInteraction'),
            'getNextScheduledCallDate': this.baseContext.concat('memberInteractions/{memberId}/{callerId}'),
            'roleChnage': this.baseContext.concat('associateRoleChange'),
            //Dashboard
            'getApplicationUserStats': this.baseContext.concat('userstats'),
            'getPhonepalGrowthStats': this.baseContext.concat('phonepalgrowthstats'),
            'getMemberStatsByStatus': this.baseContext.concat('memberstatsbystatus'),
            'getAllMemberStatsByStateByStatus': this.baseContext.concat('memberstatsbystate'),
            'getMemberStatsByUser': this.baseContext.concat('memberstatsbyuser/{alias}'),
            'getMemberStatsByUserByStateByStatus': this.baseContext.concat('memberstatsbystate/{alias}'),
            'getMemberStatsByRisk': this.baseContext.concat('memberstatsbyrisk'),
            'getMemberStatsByStateByRisk': this.baseContext.concat('memberstatsbystatebyrisk'),
            'getPhonepalStatsbyStatus': this.baseContext.concat('phonepalstatsbystatus'),
            'getConnectorStatsbyStatus': this.baseContext.concat('connectorstatsbystatus'),
            'getConnectorMemberCountStats': this.baseContext.concat('memberstatsbyassociate/connectors'),
            'getPhonepalMemberCountStats': this.baseContext.concat('memberstatsbyassociate/phonepal'),
            'getMembersforphonepal' : this.baseContext.concat('searchMemberforPhonepal'),
            'getLatestcallInteraction': this.baseContext.concat('latestMemberInteraction/{memberId}/{alias}')
        }
        return urls;
    }

}