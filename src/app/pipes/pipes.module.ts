import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CountryFilterPipe } from './country-filter.pipe';
import { CitiesFilterPipe } from './cities-filter.pipe';



@NgModule({
  declarations: [
    CountryFilterPipe,
    CitiesFilterPipe
  ],
  imports: [
    CommonModule
  ],
  exports: [
    CountryFilterPipe,
    CitiesFilterPipe
  ]
})
export class PipesModule {}
