import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CityModel } from 'src/app/models/city.model';
import { CountryModel } from 'src/app/models/country.model';
import { CoreStorageService } from 'src/app/services/core-storage.service';

interface ICityModel {
  id: number;
  city: string;
  isNew: boolean;
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
  citiesSaved: CityModel[] = [];

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
    let city: ICityModel;

    const cities: string = ev.target.value;

    if (cities.length <= 0) {       // Undisplay selection box
      this.isCityBox = false;
      return;
    }
    this.isCityBox = true;

    city = this.findLastCity(cities);

    if (!city.isNew) {
      this.setIsChecked(city.city);
      return;
    }

    this.setIsChecked(cities);
  }

  onSelectedCities(item: CityModel, form: FormGroup, index: number) {
    let lastCity: ICityModel;
    let buffer: string = form.value.cities;

    lastCity = this.findLastCity(buffer);

    const lastChat = buffer.slice(buffer.length - 1);

    let cities: string;
    if (item.city.length > 0 && lastChat !== ',') {
      if (!lastCity.isNew) {
        buffer = buffer.slice(0, (buffer.length - lastCity.city.length) - 1);
        cities = buffer + ' ' + item.city;
      } else {
        cities = item.city;
      }
    }

    form.patchValue({cities});
    this.citiesSaved.push({id: item.id, city: item.city, isChecked: item.isChecked});
    // this.isCityBox = false;
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


  findLastCity(cities: string): ICityModel {
    const city: ICityModel = {id: null, city: '', isNew: false};

    const position = cities.lastIndexOf(',');
    if (position > -1) {
      const c: string = cities.slice(position + 1, position + 2);
      if (c.includes(' ')) {
        city.city = cities.slice(position + 2);
      } else {
        city.city = cities.slice(position + 1);
      }
    } else if (position === -1) {
      city.city = cities;
      city.isNew = true;
    }
    return city;
  }


  setIsChecked(city: string) {
    this.cities = this.cities.filter(elmnt => elmnt.city.toLocaleLowerCase().includes(city.toLocaleLowerCase()));
    if (this.cities.length === 1 && this.cities[0].city.includes(city)) {
      this.cities[0].isChecked = true;
    }
  }

  onSave() {

    console.log('Form : ', this.form.value);
    console.log('citiesSaved object', this.citiesSaved);
  }


  ngOnDestroy(): void {
    this.countrySub.unsubscribe();
    this.citySub.unsubscribe();
  }

}
