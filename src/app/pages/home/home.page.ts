import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { IonInput } from '@ionic/angular';
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

  @ViewChild('countryInput', {read: ElementRef, static: true })  countryInput: ElementRef;

  Sub: Subscription;
  citySub: Subscription;
  countrySub: Subscription;

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

    this.countryAutoComplete(value, ...this.countries);
    this.endWritingCountryInput(this.form.value.country, ...this.countries);
  }

  countryAutoComplete(country: string, ...countries: CountryModel[]) {
    const countryFound = countries.filter(elmnt => elmnt.country.toLocaleLowerCase().match(country.toLocaleLowerCase()));
    if (countryFound.length === 1) {
      this.form.patchValue({ country: countryFound[0].country, idCounties: countryFound[0].id });
      this.isCountryBox = false;
    }
  }

  endWritingCountryInput(country: string, ...countries: CountryModel[]) {
    const countryFound = countries.filter(elmnt => elmnt.country.toLocaleLowerCase().match('^' + country.toLocaleLowerCase() + '$'));
    if ( countryFound.length !== 0 && country.length >= countryFound[0].country.length ) {
      this.countryInput.nativeElement.maxlength = countryFound[0].country.length;
    }
  }

  onSelectedCountry(item: CountryModel, form: FormGroup) {
    form.patchValue({ country: item.country, idCountries: item.id });
    this.isCountryBox = false;
  }



  onInputCities(ev: any) {
    const cities: string = ev.target.value;
    let cityItem: ICityModel;

    if (cities.length <= 0) {       // Undisplay selection box
      this.isCityBox = false;
      return;
    }

    this.isCityBox = true;

    cityItem = this.reformatCitiesString(cities);
    // this.form.patchValue({cities: cityItem.cities});
    // console.log('object buffer : ', buffer);

    this.setIsChecked(cityItem.citiesList);
    // console.log('object cities', this.cities);

  }



  onSelectedCities(item: CityModel, form: FormGroup) {
    const citiesBuffer: string = form.value.cities;
    let cities: string;

    const cityPosition: number = citiesBuffer.search(item.city);

    if (cityPosition === -1) {
      cities = this.addCity(item.city, citiesBuffer);
    } else {
      cities = this.deleteCity(item.city, citiesBuffer);
    }

    const cityItem: ICityModel = this.reformatCitiesString(cities);
    // console.log('object lasCity : ', lastCity);
    this.setIsChecked(cityItem.citiesList);
    // console.log('object cities', this.cities);

    // form.patchValue({cities: cityItem.cities});
    this.isCityBox = false;
  }


  onClosingAutocomplete() {
    this.isCountryBox = false;
    this.isCityBox = false;
  }



  onFilterCountries() {
    return this.form.value.country;
  }



  onFilterCities() {
    return this.form.value.cities;
  }


  reformatCitiesString(cities: string): ICityModel {
    const city: ICityModel = { id: null, city: '', cities: '', isFirstCity: true, citiesList: [] };

    // const space = '\xa0';
    const space = ' ';

    // take off last comma
    let beforeLastChar: string;
    const lastChar: string = cities.charAt(cities.length - 1);
    if (lastChar === ',') {
      cities = cities.slice(0, cities.length - 1);
      city.isFirstCity = false;
    } else if (lastChar === ' ') {
      beforeLastChar = cities.charAt(cities.length - 2);

      if (beforeLastChar === ',') {
        cities = cities.slice(0, cities.length - 2);
        city.isFirstCity = false;
      }
    }


    const position = cities.lastIndexOf(',');

    if (position > -1) {
      city.isFirstCity = false;
      const c: string = cities.slice(position + 1, position + 2);

      if (c.includes(' ')) {
        city.city = cities.slice(position + 2);
        city.cities = cities;
      } else {
        city.city = cities.slice(position + 1);
        city.cities = [cities.slice(0, position + 1), space, cities.slice(position + 1)].join('');
      }

      city.citiesList = city.cities.toLocaleLowerCase().split(', ');

    } else if (position === -1) {
      city.city = cities;
      city.cities = cities;
      city.citiesList.push(city.city.toLocaleLowerCase());
    }


    if (lastChar === ',') {
      this.form.patchValue({ cities: city.cities + lastChar });
    } else if (beforeLastChar === ',') {
      this.form.patchValue({ cities: city.cities + beforeLastChar + lastChar });
    } else {
      this.form.patchValue({ cities: city.cities });
    }

    // console.log('object city : ', city);
    return city;
  }

  addCity(city: string, cities: string): string {
    const lastCity: ICityModel = this.reformatCitiesString(cities);

    const lastChar = cities.charAt(cities.length - 1);

    let returnCities: string;

    if (!lastCity.isFirstCity) {
      // cities = cities.slice(0, (cities.length - lastCity.city.length) - 1);

      returnCities = cities + city;
    } else {
      returnCities = city;
    }

    return returnCities;
  }

  deleteCity(city: string, cities: string): string {
    let returnCities: string;

    const position: number = cities.indexOf(city);
    const char = cities.charAt(position + city.length);

    if (char.includes(',')) {
      returnCities = cities.replace((city + ', '), '');
    } else {
      returnCities = cities.replace(city, '');
    }


    return returnCities;
  }


  checkCityExist(cities: string[]) {
    cities.forEach(city => {
      const citiesFound = this.cities.find(elmnt => elmnt.city.toLocaleLowerCase().match('^' + city.toLocaleLowerCase() + '$'));
      if (citiesFound === undefined) {
        console.log('City not found', city);
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
    const cityItem: ICityModel = this.reformatCitiesString(this.form.value.cities);
    this.checkCityExist(cityItem.citiesList);
    console.log('Form : ', this.form.value);
  }



  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
    this.citySub.unsubscribe();
  }

}
