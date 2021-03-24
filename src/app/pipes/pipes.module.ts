import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryFilterPipe } from './country-filter.pipe';
import { CityFilterPipe } from './city-filter.pipe';
import { CitiesFilterPipe } from './cities-filter.pipe';



@NgModule({
  declarations: [
    CountryFilterPipe,
    CityFilterPipe,
    CitiesFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CountryFilterPipe,
    CityFilterPipe,
    CitiesFilterPipe
  ]
})
export class PipesModule {}
