import { Pipe, PipeTransform } from '@angular/core';
import { CityModel } from '../models/city.model';

@Pipe({
  name: 'cityFilter'
})
export class CityFilterPipe implements PipeTransform {

  transform(countries: CityModel[], text: string): any {
    if (text.length === 0) { return countries; }

    text = text.toLowerCase();

    return countries.filter( (country) => {
      return country.city.toLowerCase().includes(text);
    });
  }

}
