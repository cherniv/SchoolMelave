const Device = {
	isAndroid: !true,
	isIos: false,
}

import {
	PermissionsAndroid,
} from 'react-native';

import * as firebase from 'firebase'

var watchId;

class LocationDetector {
	stopObserving() {
		navigator.geolocation.clearWatch(watchId);
		navigator.geolocation.stopObserving();
	}
	watchPosition() {
		return new Promise((res, rej) => {
			var hasPermissionCallback = (additionalSettings = null) => {
				watchId = navigator.geolocation.watchPosition(
		      	(position) => {   
			        var {latitude, longitude} = position.coords;
			        var timestamp = (new Date()).getTime();
			        console.log('watch latitude: ', latitude)
			        console.log('watch longitude: ', longitude) 
			        firebase.database().ref('data').push({latitude, longitude, timestamp})
		      },
		      (error) => console.log('HERE4', JSON.stringify(error)),
		      additionalSettings
	    	);
			}


			if (!Device.isAndroid) {
				hasPermissionCallback({enableHighAccuracy: true, timeout: 10000, maximumAge: 0, distanceFilter: 0});
			} else {
				try {
			    PermissionsAndroid.request(
			      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
			      {
			        'title': 'Get Location Permission',
			        'message': 'This allows our app to get your location'
			      }
			    ).then(granted => {
				    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
				      console.log("You can use the camera")
				      hasPermissionCallback({ distanceFilter: 0});
				    } else {
				      console.log("Camera permission denied")
				      alert('You can still allow this permission in Settings -> Apps -> Our App -> Permissions -> Location')
				    }
					})
				  } catch (err) {
				    console.warn(err)
				  }
			}
		});
	}
}

module.exports = new LocationDetector;