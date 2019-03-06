import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { MemberNotes } from '../../phonePal/model/member-notes.model';

@Injectable()

// Phonepal data service that can be injected in components
export class DataService {
  
  // Commenting code related to using json-server and reading from local json file
  // baseUrl: string = "http://ca47dlvedh001:9102";

  // Adding code to read local json file
  constructor(private httpClient: HttpClient) {}
  
  // Make service call to retrieve MemberID
  public get_member_id(url: any) {
    return this.httpClient.get(url);
  }

  // Retrieve member details
  public get_member_info(url: any) {
    return this.httpClient.get(url);
  }

  // Function to retrieve phonepal interaction details
  public get_member_notes(url: any) {
    return this.httpClient.get<Array<MemberNotes>>(url);
  }

  public get_call_outcome(url: any){
    return this.httpClient.get<Array<MemberNotes>>(url);
  }

  // Submit member interaction details
  public post_member_notes(url: any, notes: any) {
    return this.httpClient.post(url, notes);
  }

  public get_associate_details(alias: string) {
    return this.httpClient.get('/togetherness/associateProfile/' + alias);
  }

  public post_search_associate(alias){
    return this.httpClient.post('/togetherness/searchAssociate', alias);
  }

  // Retrieve next scheduled phone call date
  public get_next_scheduled_date(url: any) {
    return this.httpClient.get(url);
  }

}