import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'countryFilter'
})
export class CountryFilterPipe implements PipeTransform {

  transform(items: any, text: string): any {
    if (text.length === 0) { return items; }

    text = text.toLowerCase();

    return items.filter( (item: any) => {
      return item.name.toLowerCase().includes(text);
    });
  }

}
