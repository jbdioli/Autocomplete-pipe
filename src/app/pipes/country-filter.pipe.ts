import { Pipe, PipeTransform } from '@angular/core';
import { CountryModel } from '../models/country.model';

@Pipe({
  name: 'countryFilter'
})
export class CountryFilterPipe implements PipeTransform {

  transform(countries: CountryModel[], text: string): any {
    if (text.length === 0) { return countries; }

    text = text.toLowerCase();

    return countries.filter( (country) => {
      return country.country.toLowerCase().includes(text);
    });
  }

}
