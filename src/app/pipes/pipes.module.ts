import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryFilterPipe } from './country-filter.pipe';
import { CityFilterPipe } from './city-filter.pipe';



@NgModule({
  declarations: [
    CountryFilterPipe,
    CityFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CountryFilterPipe,
    CityFilterPipe
  ]
})
export class PipesModule {}
