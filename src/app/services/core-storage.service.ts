import { Injectable } from '@angular/core';
import { BehaviorSubject, pairs } from 'rxjs';
import { CityModel } from '../models/city.model';
import { CountryModel } from '../models/country.model';

@Injectable({
  providedIn: 'root'
})
export class CoreStorageService {
  private _countriesSub = new BehaviorSubject<CountryModel[]>([]);
  private _citiesSub = new BehaviorSubject<CityModel[]>([]);

  getCountries$ = this._countriesSub.asObservable();
  getCities$ = this._citiesSub.asObservable();


  private countries: CountryModel[] = [
    {
      id: 1,
      country: 'France',
      isChecked: false
    },
    {
      id: 2,
      country: 'Etats Unis',
      isChecked: false
    },
    {
      id: 3,
      country: 'Italie',
      isChecked: false
    },
    {
      id: 4,
      country: 'Espagne',
      isChecked: false
    },
    {
      id: 5,
      country: 'Falkland Islands (Malvinas)',
      isChecked: false
    },
    {
      id: 6,
      country: 'Fiji',
      isChecked: false
    },
    {
      id: 7,
      country: 'Finland',
      isChecked: false
    },
    {
      id: 8,
      country: 'French Guiana',
      isChecked: false
    }
  ];

  private cities: CityModel[] = [
    {
      id: 1,
      city: 'Paris',
      isChecked: false
    },
    {
      id: 2,
      city: 'Marseille',
      isChecked: false
    },
    {
      id: 3,
      city: 'Lyon',
      isChecked: false
    },
    {
      id: 4,
      city: 'Toulouse',
      isChecked: false
    },
    {
      id: 5,
      city: 'Nice',
      isChecked: false
    },
    {
      id: 6,
      city: 'Nantes',
      isChecked: false
    },
    {
      id: 7,
      city: 'Montpellier',
      isChecked: false
    },
    {
      id: 8,
      city: 'Strasbourg',
      isChecked: false
    },
    {
      id: 9,
      city: 'Bordeaux',
      isChecked: false
    },
    {
      id: 10,
      city: 'Lille',
      isChecked: false
    },
  ];

  constructor() { }

  findCountries() {
    this._countriesSub.next(this.countries);
  }

  findCities() {
    this._citiesSub.next(this.cities);
  }



}
