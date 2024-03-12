<template>
  <f7-app v-bind="f7params">

    <!-- Your main view, should have "view-main" class -->
    <f7-view main class="safe-areas" url="/"></f7-view>

  </f7-app>
</template>
<script>
import { ref, onMounted } from 'vue';
import { f7, f7ready } from 'framework7-vue';
import { getDevice } from 'framework7/lite-bundle';
import cordovaApp from '../js/cordova-app.js';

import routes from '../js/routes.js';
import store from '../js/store';

export default {
  setup() {
    const device = getDevice();
    // Framework7 Parameters
    const f7params = {
      name: 'WarungPOS', // App name
      theme: 'auto', // Automatic theme detection




      // App store
      store: store,
      // App routes
      routes: routes,



      // Input settings
      input: {
        scrollIntoViewOnFocus: device.cordova,
        scrollIntoViewCentered: device.cordova,
      },
      // Cordova Statusbar settings
      statusbar: {
        iosOverlaysWebView: true,
        androidOverlaysWebView: false,
      },

      location: {
        ios: {
          accuracy: 5,
          distanceFilter: 10,
        },
        android: {
          enableHighAccuracy: true,
          maximumAge: 0,
          timeout: 27000,
        },
      },
    };


    onMounted(() => {
      f7ready(() => {
        // Init cordova APIs (see cordova-app.js)
        if (device.cordova) {
          cordovaApp.init(f7);
        }

        // Call F7 APIs here
        
      });
    });

    function onDeviceReady() {
      navigator.geolocation.getCurrentPosition(async (position) => {
        let userLocation = await [position.coords.latitude, position.coords.longitude];
        console.log('User Utama : ', userLocation[0], userLocation[1]);
      });

      let watchID = navigator.geolocation.watchPosition((position) => {
        let userLocation = [position.coords.latitude, position.coords.longitude];
        console.log('Updated Location : ', userLocation[0], userLocation[1]);
      }, (error) => {
        console.error('Error occurred: ' + error.message);
      }, {
        maximumAge: 3000,
        timeout: 5000,
        enableHighAccuracy: true,
      });

      console.log("navigator.geolocation works well");
    }

    document.addEventListener("deviceready", onDeviceReady, false);

    return {
      f7params,

    }
  }
}
</script>