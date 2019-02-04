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

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad BackgroundGeoPage');
  }

  loadMap() {
    if (this.logs.length > 0) {
      this.lat = this.logs[0].lat;
      this.lng = this.logs[0].lng;
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
      this.addMarkers();
      this.redrawPath();
    }
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


  redrawPath() {
    var line = new google.maps.Polyline({
      path: this.logs,
      geodesic: true,
      strokeColor: '#ff0000',
      strokeOpacity: 0.4,
      strokeWeight: 8,
      editable: true // if you dont want to see the editable point change it to false
    });
    //set map
    line.setMap(this.map);
  }

  addMarkers() {
    if (this.logs.length > 0) {
      this.logs.forEach(coord => {
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
