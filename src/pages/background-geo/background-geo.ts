import {Component, ElementRef, ViewChild} from '@angular/core';
import {IonicPage, NavController, NavParams} from 'ionic-angular';
import {
  BackgroundGeolocation,
  BackgroundGeolocationConfig,
  BackgroundGeolocationResponse
} from '@ionic-native/background-geolocation';
import {Geolocation} from "@ionic-native/geolocation";

declare var google;

@IonicPage()
@Component({
  selector: 'page-background-geo',
  templateUrl: 'background-geo.html',
})
export class BackgroundGeoPage {
  @ViewChild('map') mapElement: ElementRef;
  map: any;
  lat: any;
  lng: any;

  logs = [];
  currentMapTrack = null;

  constructor(public navCtrl: NavController, public navParams: NavParams,
              private backgroundGeolocation: BackgroundGeolocation, private geolocation: Geolocation) {

    /*geolocation.getCurrentPosition()
      .then(position => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.loadMap();
      })
      .catch((error) => {
        this.navCtrl.pop();
      });*/
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BackgroundGeoPage');
  }

  loadMap() {
    this.lat = 37.3675506;
    this.lng = -6.0452695;
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 13,
      center: {lat: parseFloat(this.lat), lng: parseFloat(this.lng)},
      zoomControl: true,
      draggable: true,
      scaleControl: false,
      scrollwheel: false,
      disableDoubleClickZoom: false,
      disableDefaultUI: false,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });
    //this.printPolylines();
    this.addMarkers();
  }


  startBackgroundGeolocation() {
    this.backgroundGeolocation.isLocationEnabled()
      .then((rta) => {
        if (rta) {
          this.start();
        } else {
          this.backgroundGeolocation.showLocationSettings();
        }
      })
  }

  start() {

    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 10,
      stationaryRadius: 1,
      distanceFilter: 1,
      debug: true,
      stopOnTerminate: false,
      // Android only section
      locationProvider: 1, // https://github.com/mauron85/cordova-plugin-background-geolocation/blob/master/PROVIDERS.md
      startForeground: true,
      interval: 6000,
      fastestInterval: 5000,
      activitiesInterval: 10000,
      notificationTitle: 'Background tracking',
      notificationText: 'enabled',
      notificationIconColor: '#FEDD1E',
      notificationIconLarge: 'mappointer_large',
      notificationIconSmall: 'mappointer_small'
    };

    console.log('start');

    this.backgroundGeolocation
      .configure(config)
      .subscribe((location: BackgroundGeolocationResponse) => {
        console.log(location);
        this.logs.push({lat: location.latitude, lng: location.longitude});
        //version 1
        //this.logs.push(`${location.latitude},${location.longitude}`);
      });

    // start recording location
    this.backgroundGeolocation.start();

  }

  stopBackgroundGeolocation() {
    this.backgroundGeolocation.stop().then(() => {
      this.loadMap();
    }, error => console.log(error))
  }

  printPolylines() {
    if (this.logs.length > 0) {
      this.logs.forEach(coord => {
        alert(coord.lat + "-" + coord.lng);
        this.redrawPath(coord);
      })
    }
  }

  redrawPath(path) {
    if (path.lat && path.lng) {
      this.currentMapTrack = new google.maps.Polyline({
        path: path,
        geodesic: true,
        strokeColor: '#ff00ff',
        strokeOpacity: 1.0,
        strokeWeight: 3
      });
      this.currentMapTrack.setMap(this.map);
    }
  }

  addMarkers() {
    if (this.logs.length > 0) {
      this.logs.forEach(coord => {
        alert(coord.lat + "-" + coord.lng);
        let urlIcon = {
          url: "http://maps.google.com/mapfiles/ms/icons/yellow-dot.png",
          scaledSize: new google.maps.Size(27, 43)
        };
        var marker = new google.maps.Marker({
          position: coord,
          map: this.map,
          icon: urlIcon
        });
        marker.setMap(this.map);
      })
    }
  }


}
