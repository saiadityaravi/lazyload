import { Observable } from 'rxjs/Rx';
import { Store } from '@ngrx/store';
import { DatePipe } from '@angular/common';
//import { State }      from '../store';

let typeCache: { [label: string]: boolean } = {};

type Predicate = (oldValues: Array<any>, newValues: Array<any>) => boolean;

/**
 * This function coerces a string into a string literal type.
 * Using tagged union types in TypeScript 2.0, this enables
 * powerful typechecking of our reducers.
 * 
 * Since every action label passes through this function it
 * is a good place to ensure all of our action labels are unique.
 *
 * @param label
 */
export function type<T>(label: T | ''): T {
  if (typeCache[<string>label]) {
    throw new Error(`Action type "${label}" is not unqiue"`);
  }

  typeCache[<string>label] = true;

  return <T>label;
}

/**
 * Runs through every condition, compares new and old values and returns true/false depends on condition state.
 * This is used to distinct if two observable values have changed.
 *
 * @param oldValues
 * @param newValues
 * @param conditions
 */
export function distinctChanges(oldValues: Array<any>, newValues: Array<any>, conditions: Predicate[]): boolean {
  if (conditions.every(cond => cond(oldValues, newValues))) return false;
  return true;
}

/**
 * Returns true if the given value is type of Object
 *
 * @param val
 */
export function isObject(val: any) {
  if (val === null) return false;

  return ((typeof val === 'function') || (typeof val === 'object'));
}

/**
 * Capitalizes the first character in given string
 *
 * @param s
 */
export function capitalize(s: string) {
  if (!s || typeof s !== 'string') return s;
  return s && s[0].toUpperCase() + s.slice(1);
}

/**
 * Uncapitalizes the first character in given string
 *
 * @param s
 */
export function uncapitalize(s: string) {
  if (!s || typeof s !== 'string') return s;
  return s && s[0].toLowerCase() + s.slice(1);
}

/**
 * Flattens multi dimensional object into one level deep
 *
 * @param obj
 * @param preservePath
 */
export function flattenObject(ob: any, preservePath: boolean = false): any {
  var toReturn = {};

  for (var i in ob) {
    if (!ob.hasOwnProperty(i)) continue;

    if ((typeof ob[i]) == 'object') {
      var flatObject = flattenObject(ob[i], preservePath);
      for (var x in flatObject) {
        if (!flatObject.hasOwnProperty(x)) continue;

        let path = preservePath ? (i + '.' + x) : x;

        toReturn[path] = flatObject[x];
      }
    } else toReturn[i] = ob[i];
  }

  return toReturn;
}

/**
 * Returns formated date based on given culture
 *
 * @param dateString
 * @param culture
 */
export function localeDateString(dateString: string, culture: string = 'en-EN'): string {
  let date = new Date(dateString);
  return date.toLocaleDateString(culture);
}

// Populate combobox values based on a given type
export function dropdownlist(arr) {
  var result = {};
  var inlineObj = []; 
  var subResult = new Array();
  for (var i = 0, len = arr.length; i < len; i++) {
    var index:number = +Object.getOwnPropertyNames(arr[i])
    inlineObj = arr[i][index][0];
    for (var key in inlineObj) {
      var subObj = {};
      subObj["key"] = key;
      subObj["value"] = inlineObj[key];
      subResult.push(subObj);
    }
    result[Object.getOwnPropertyNames(arr[i])[0]] = subResult; subResult = [];
  }
}

// Iterate through the entire array and populate individual combobox
export function ddlArray(mainObj){
  for (let key in mainObj) {
    if (mainObj.hasOwnProperty(key)) {
        let innerArrObj = mainObj[key][0];
        let resultArr: any[] = [];
        for (var k in innerArrObj) {
          if (innerArrObj.hasOwnProperty(k)) {
              let newName = {
                value:k,
                viewValue:innerArrObj[k]
              };
              resultArr.push(newName);
          }
      }
      return resultArr = resultArr.sort((a, b) => {
        let nameA = a.viewValue;
        let nameB =b.viewValue;
      
        if (nameA < nameB) {
          return -1;
        }
        if (nameA > nameB) {
          return 1;
        }
        return 0;
      });
    }
  }
}

// Formating date to yyyy-mm-dd hh:mm:ss.000
export function getformatedDate(callDate: any) {
  if (callDate) {
      if (Array.isArray(callDate)) {
          let formattedDate: any;
          let counter = 0;
          callDate.forEach(element => {
              if (counter == 0) {
                formattedDate = new DatePipe('en-US').transform(element, 'yyyy-MM-dd');
                formattedDate = formattedDate + " 00:00:00.000";
                  counter++;
              } else {
                  formattedDate = formattedDate + "," +  new DatePipe('en-US').transform(element, 'yyyy-MM-dd')+ " 00:00:00.000"
              }

          })
          return formattedDate;
      } else {
        let formattedDate = new DatePipe('en-US').transform(callDate, 'yyyy-MM-dd');
        formattedDate = formattedDate + " 00:00:00.000";
          return formattedDate;
      }
  }
  return null;
}

// Function to display title based on domain name
export function getDomainTitle(): string{
  let currentAddress = window.location.href;
  let cm = /caremore/;
  let anthm = /anthem/;
  if (currentAddress.search(cm) != -1) {
    return "Togetherness";
  } else if (currentAddress.search(anthm) != -1) {
    return "Member Connect";
  } else {
    return "Togetherness";
  }
}