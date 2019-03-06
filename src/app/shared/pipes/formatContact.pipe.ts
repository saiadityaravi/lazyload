import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'contactFormat'
})

// Pipe to display phone number in format (ddd) ddd-dddd
export class ContactFormat implements PipeTransform {

    transform(value: any[], args: string[]): any {
      if(value){
        var formattedContact = "";
        var cleaned = ('' + value).replace(/\D/g, '')
        var match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/)
        formattedContact = '(' + match[1] + ') ' + match[2] + '-' + match[3];
        return formattedContact;
      }
    }
}

