import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'dateformat' })

// Pipe to display date in mm/dd/yyyy format
export class dateFormat implements PipeTransform {
  transform(value: string): string {
    if (value) {
      let formattedDatePipe: any = null;
      formattedDatePipe = value.toString().substring(0, value.toString().indexOf(" "));
      var pattern = /(\d{4})\-(\d{2})\-(\d{2})/;
      if (!formattedDatePipe || !formattedDatePipe.match(pattern)) {
        return null;
      }
      return formattedDatePipe.replace(pattern, '$2/$3/$1');
    }
  }
}