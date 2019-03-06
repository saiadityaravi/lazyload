import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'Commenttruncate'
})

// Pipe to truncate comment if comment length is greater than 35 characters
export class TruncatePipeComment implements PipeTransform {

    transform(value: string, args: string[]): any {
      if(value){
        return value.length > 35 ? value.substring(0, 20) + '....' : value;
      }
    }
}