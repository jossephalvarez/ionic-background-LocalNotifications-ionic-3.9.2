import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, Platform} from 'ionic-angular';
import {BackgroundMode} from '@ionic-native/background-mode';
import {LocalNotifications} from "@ionic-native/local-notifications";
import {Geolocation} from '@ionic-native/geolocation';

@IonicPage()
@Component({
  selector: 'page-pokemon-go-simulate',
  templateUrl: 'pokemon-go-simulate.html',
})
export class PokemonGoSimulatePage {
  notificationAlreadyReceived = false;
  originalCoords;
  // DISTANCE_TO_MOVE = 0.003069;
  DISTANCE_TO_MOVE = 0.000001;

  constructor(public navCtrl: NavController, public platform: Platform, public navParams: NavParams, public backgroundMode: BackgroundMode, public localNotifications: LocalNotifications, public geolocation: Geolocation,) {

    platform.ready().then(() => {

      this.backgroundMode.on('activate').subscribe(() => {
        console.log('activated');
        if (this.notificationAlreadyReceived === false) {
          this.showNotification("HOLAAA");
        }

        //TODO NO FUNCION EL GETLOCATION EN MODO BACKGROUND ; LO QUE SE PUEDE INTENTAR ES LLAMAR A HHTPREQUEST
        // setInterval(this.trackPosition, 2000);
      }, error => alert("ERROR BACKGROUND MODE" + JSON.stringify(error)));
      this.backgroundMode.enable();

      geolocation.getCurrentPosition()
        .then(position => {
          this.originalCoords = position.coords;
          this.showNotification("COORDS CONSTRUCTOR" + this.originalCoords.latitude);
        })
        .catch((error) => {
          alert('error' + error);
        });


    }, error => alert("ERROR READY" + JSON.stringify(error)))
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PokemonGoSimulatePage');
  }

  showNotification(text) {
    this.localNotifications.schedule({
      text: text
    });

    this.notificationAlreadyReceived = true;
  }

  trackPosition = () => {
    this.geolocation
      .getCurrentPosition()
      .then(position => {
        this.handleMovement(position.coords);
      })
      .catch(error => {
        console.log("error", error);
        this.showNotification("error getCurrentPosition" + JSON.stringify(error));
      });
  };
  handleMovement = coords => {
    const distanceMoved = this.getDistanceFromLatLonInKm(
      this.originalCoords.latitude,
      this.originalCoords.longitude,
      coords.latitude,
      coords.longitude
    );
    if (
      distanceMoved > this.DISTANCE_TO_MOVE &&
      this.notificationAlreadyReceived === false
    ) {
      this.showNotification('There is a legendary Pokemon near you');
    }
  };

  getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    var R = 6371; // Radius of the earth in km
    var dLat = this.deg2rad(lat2 - lat1);  // deg2rad below
    var dLon = this.deg2rad(lon2 - lon1);
    var a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.deg2rad(lat1)) * Math.cos(this.deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2)
    ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
  }

  deg2rad(deg) {
    return deg * (Math.PI / 180)
  }


}
