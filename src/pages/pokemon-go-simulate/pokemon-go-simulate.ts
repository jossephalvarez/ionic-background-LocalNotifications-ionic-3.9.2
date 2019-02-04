import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';


@IonicPage()
@Component({
  selector: 'page-pokemon-go-simulate',
  templateUrl: 'pokemon-go-simulate.html',
})
export class PokemonGoSimulatePage {

  constructor(public navCtrl: NavController, public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PokemonGoSimulatePage');
  }

}
