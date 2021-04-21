import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityModel } from 'src/app/models/city.model';
import { CountryModel } from 'src/app/models/country.model';
import { CoreStorageService } from 'src/app/services/core-storage.service';

interface ICityModel {
  id: number;
  city: string;
  cities: string;
  isFirstCity: boolean;
  citiesList: string[];
}

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {
  countrySub: Subscription;
  citySub: Subscription;

  form: FormGroup;

  countries: CountryModel[];
  cities: CityModel[];

  isCityChecked: boolean;
  isCountryBox = false;
  isCityBox = false;

  constructor(
    private formBuilder: FormBuilder,
    private storage: CoreStorageService
  ) { }


  ngOnInit() {
    this.initForm();
    this.storage.findCountries();
    this.storage.findCities();
    this.countrySub = this.storage.getCountries$.subscribe((elmnt: CountryModel[]) => {
      this.countries = elmnt;
    });

    this.citySub = this.storage.getCities$.subscribe((elmmt: CityModel[]) => {
      this.cities = elmmt;
    });
  }



  initForm() {
    this.form = this.formBuilder.group({
      country: ['', Validators.required],
      idCountries: null,
      cities: ['', Validators.required]
    });

  }



  onInputCountry(ev: any) {
    const value: string = ev.target.value;

    if (value.length <= 0) {
      this.isCountryBox = false;
      return;
    }

    this.isCountryBox = true;
  }



  onSelectedCountry(item: CountryModel, form: FormGroup) {
    form.patchValue({country: item.country, idCountries: item.id});
    this.isCountryBox = false;
  }



  onInputCities(ev: any) {
    const cities: string = ev.target.value;
    let buffer: ICityModel;

    if (cities.length <= 0) {       // Undisplay selection box
      this.isCityBox = false;
      return;
    }

    this.isCityBox = true;

    buffer = this.reformatCitiesString(cities);
    console.log('object buffer : ', buffer);

    this.setIsChecked(buffer.citiesList);
    console.log('object cities', this.cities);

  }



  onSelectedCities(item: CityModel, form: FormGroup) {
    let lastCity: ICityModel;
    let buffer: string = form.value.cities;

    lastCity = this.reformatCitiesString(buffer);

    const lastChat = buffer.slice(buffer.length - 1);

    let cities: string;
    if (item.city.length > 0 && lastChat !== ',') {
      if (!lastCity.isFirstCity) {
        buffer = buffer.slice(0, (buffer.length - lastCity.city.length) - 1);

        cities = buffer + ' ' + item.city;
      } else {
        cities = item.city;
      }
    }

    lastCity = this.reformatCitiesString(cities);
    // console.log('object lasCity : ', lastCity);
    this.setIsChecked(lastCity.citiesList);
    // console.log('object cities', this.cities);

    form.patchValue({cities});
    this.isCityBox = false;
  }



  onClosingAutocomplete() {
    this.isCountryBox = false;
    // this.isCityBox = false;
  }



  onFilterCountries() {
    return this.form.value.country;
  }



  onFilterCities() {
    return this.form.value.cities;
  }


  reformatCitiesString(cities: string): ICityModel {
    const city: ICityModel = {id: null, city: '', cities: '', isFirstCity: false, citiesList: []};

    // const space = '\xa0';
    const space = ' ';

    const position = cities.lastIndexOf(',');

    if (position > -1) {
      const c: string = cities.slice(position + 1, position + 2);
      if (c.includes(' ')) {
        city.city = cities.slice(position + 2);
        city.cities = cities;
      } else if (c === '') {
        city.city = cities.slice(position + 1);
        city.cities = cities;
        city.isFirstCity = true;
      } else {
        city.city = cities.slice(position + 1);
        city.cities = [cities.slice(0, position + 1), space, cities.slice(position + 1)].join('');
      }

      if (city.isFirstCity) {
        city.citiesList = city.cities.toLocaleLowerCase().split(',');
      } else {
        city.citiesList = city.cities.toLocaleLowerCase().split(', ');
      }

    } else if (position === -1) {
      city.city = cities;
      city.isFirstCity = true;
      city.citiesList.push(city.city.toLocaleLowerCase());
    }




    // console.log('object city : ', city);
    return city;
  }


  checkCityExist(cities: string[]) {
    cities.forEach(city => {
      const citiesFound = this.cities.find(elmnt => elmnt.city.toLocaleLowerCase().match('^' + city.toLocaleLowerCase() + '$'));
      if (citiesFound === undefined) {
        console.log('city not found', city);
      }
    });
  }

  setIsChecked(cities: string[]) {
    this.cities.forEach((elmnt) => {

      const isCity = cities.includes(elmnt.city.toLocaleLowerCase());
      if (!isCity) {
        elmnt.isChecked = false;
      } else {
        elmnt.isChecked = true;
      }

    });

  }



  findIdCountry(country: string): number {
     const buffer: CountryModel = this.countries.find(countryElmt => countryElmt.country === country);

     if (buffer) {
       return buffer.id;
     }

     return null;
  }



  onSave() {
    const idCountries = this.findIdCountry(this.form.value.country);
    this.form.value.idCountries = idCountries;
    console.log('Form : ', this.form.value);
  }



  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
    this.citySub.unsubscribe();
  }

}
