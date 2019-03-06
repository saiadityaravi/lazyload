import { Injectable } from '@angular/core';
import {
  FormControl,
  FormGroup,
  AbstractControl,
  ValidatorFn
} from '@angular/forms';
@Injectable()
export class ValidationService {

  /**
   * Validates email address
   *
   * @param formControl
   */
  public static validateEmail(regexp: RegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const value = control.value;
      if (value === '') {
        return null;
      }
      return !regexp.test(value) ? { 'patternInvalid': { regexp } } : null;
    };
  }


  /**
   * Validates required numeric values
   *
   * @param formControl
   */
  public numericRequired(formControl: FormControl): { [error: string]: any } {
    return (formControl.value && formControl.value > 0) ? null : { numericRequired: { valid: false } };
  }

  /**
   * Validates matching string values
   *
   * @param controlKey
   * @param matchingControlKey
   */
  public matchingPasswords(controlKey: string, matchingControlKey: string): { [error: string]: any } {
    return (group: FormGroup): { [key: string]: any } => {
      if (group.controls[controlKey].value !== group.controls[matchingControlKey].value) {
        return { mismatch: { valid: false } };
      }
    }
  }

  public static getRange(start, end):boolean{
    let giveStartDate = new Date(start);
    let monthStart: any = giveStartDate.getMonth() + 1
    monthStart = monthStart.toString()
    let dateStart:any = giveStartDate.getDate().toString();
    if (dateStart.length <= 1) {
      dateStart = '0' + dateStart
    }
    if (monthStart.length <= 1) {
      monthStart = '0' + monthStart
    }
    let d0:any = new Date(giveStartDate.getFullYear(), monthStart, dateStart)

    let giveDate = new Date(end);
    let month: any = giveDate.getMonth() + 1
    month = month.toString()
    let date:any = giveDate.getDate().toString();
    if (date.length <= 1) {
        date = '0' + date
    }
    if (month.length <= 1) {
        month = '0' + month
    }
    let d1:any = new Date(giveDate.getFullYear(), month, date)
    d0.setHours(0,0,0,0);
    d1.setHours(0,0,0,0);
    return Math.round((d1-d0)/ 8.64e7) <= 180? true : false;
  }

  public static validateRange(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } => {
      const startDate = control.root.get('availabilityStartDt')!=null?control.root.get('availabilityStartDt').value!=null?control.root.get('availabilityStartDt').value:null:null;
      const endDate = control.value
        if (endDate == null || startDate== null) {
          return null;
      }
      return  this.getRange(startDate, endDate) ? { minRange: { invalid:true } } : null;
    }
  }
}