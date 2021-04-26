import { Pipe, PipeTransform } from '@angular/core';
import { CityModel } from '../models/city.model';

@Pipe({
  name: 'citiesFilter'
})
export class CitiesFilterPipe implements PipeTransform {

  transform(cities: CityModel[], text: string): any {
    if (text.length === 0) { return cities; }

    text = text.toLowerCase();
    text = this.findCity(text);

    return cities.filter( (city) => {
      return city.city.toLowerCase().includes(text);
    });
  }


  findCity(item: string): string {
    let returnValue: string =  null;

    const position = item.lastIndexOf(',');
    if (position > -1) {
      const c: string = item.slice(position + 1, position + 2);
      if (c.includes(' ')) {
        returnValue = item.slice(position + 2);
      } else {
        returnValue = item.slice(position + 1);
      }
    } else if (position === -1) {
      returnValue = item;
    }
    return returnValue;
  }

}
