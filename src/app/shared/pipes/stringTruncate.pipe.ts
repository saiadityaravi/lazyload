import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'truncate'
})

// Pipe to truncate comment if comment length is greater than 35 characters
export class TruncatePipe implements PipeTransform {

    transform(value: any[], args: string[]): any {
      if(value){
        let arr: string = value.filter(Boolean).join(', ');;
        return arr.length > 35 ? arr.substring(0, 20) + '....' : arr;
      }
    }
}