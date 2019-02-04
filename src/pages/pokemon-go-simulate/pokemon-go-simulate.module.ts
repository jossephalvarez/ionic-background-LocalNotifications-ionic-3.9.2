import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PokemonGoSimulatePage } from './pokemon-go-simulate';

@NgModule({
  declarations: [
    PokemonGoSimulatePage,
  ],
  imports: [
    IonicPageModule.forChild(PokemonGoSimulatePage),
  ],
})
export class PokemonGoSimulatePageModule {}
