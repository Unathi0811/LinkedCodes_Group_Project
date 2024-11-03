import React, { useEffect, useState } from "react";
import * as Location from "expo-location";

export default function useLocation() {
	const [errorMsg, setErrorMsg] = useState("");
	const [longitude, setLongitude] = useState(null);
	const [latitude, setLatitude] = useState(null);

	const getUserLocation = async () => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			setErrorMsg("Permission to access location was not granted");
			return;
		}

		let { coords } = await Location.getCurrentPositionAsync();
		if (coords) {
			const { latitude, longitude } = coords;
			// console.log('Latitude and Longitude:', latitude, longitude);

			setLatitude(latitude);
			setLongitude(longitude);

			let response = await Location.reverseGeocodeAsync({
				latitude,
				longitude,
			});
			// console.log('User Location:', response);

			// Add the user's location to Firestore
		}
	};

	useEffect(() => {
		getUserLocation();
	}, []);

	return { latitude, longitude, errorMsg };
}
