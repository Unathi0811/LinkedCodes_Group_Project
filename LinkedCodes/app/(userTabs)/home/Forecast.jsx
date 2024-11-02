import React, { useState, useEffect } from "react";
import {
	View,
	Text,
	Image,
	StyleSheet,
	ActivityIndicator,
	Alert,
	ScrollView,
} from "react-native";
import * as Location from "expo-location";
import axios from "axios";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Tabs } from "expo-router";

const API_KEY = "4f2f439b78ba6d3fc2a94a59bd39287a";

const Forecast = () => {
	const [weather, setWeather] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	useEffect(() => {
		const fetchWeather = async (latitude, longitude) => {
			const BASE_URL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${API_KEY}&units=metric`;

			try {
				const response = await axios.get(BASE_URL);
				setWeather(response.data);
			} catch (error) {
				setError(error.message);
			} finally {
				setLoading(false);
			}
		};

		const getLocation = async () => {
			try {
				const { status } =
					await Location.requestForegroundPermissionsAsync();
				if (status !== "granted") {
					Alert.alert(
						"Permission Denied",
						"Unable to get permissions from device to use location."
					);
					setLoading(false);
					return;
				}

				const location = await Location.getCurrentPositionAsync({
					accuracy: Location.Accuracy.High,
				});
				const { latitude, longitude } = location.coords;
				fetchWeather(latitude, longitude);
			} catch (error) {
				Alert.alert("Error", "Unable to get your location");
				setLoading(false);
			}
		};

		getLocation();
	}, []);

	const getDailyWeather = () => {
		const dailyWeather = {};

		weather.list.forEach((item) => {
			const date = new Date(item.dt * 1000).toLocaleDateString();
			if (!dailyWeather[date]) {
				dailyWeather[date] = item;
			}
		});
		return Object.values(dailyWeather);
	};

	const getTodayWeather = () => {
		if (!weather) return null;
		const todayDate = new Date().toLocaleDateString();
		return weather.list.find(
			(item) =>
				new Date(item.dt * 1000).toLocaleDateString() === todayDate
		);
	};

	const dailyWeather = weather ? getDailyWeather() : [];
	const todayWeather = getTodayWeather();

	if (loading) {
		return (
			<View
				style={{
					flex: 1,
					justifyContent: "center",
					alignItems: "center",
				}}
			>
				<ActivityIndicator
					size="large"
					color="#202A44"
				/>
			</View>
		);
	}

	if (error) {
		return <Text>Error: {error}</Text>;
	}


	return (
		<>
			<Tabs.Screen
				options={{
					tabBarStyle: {
						height: 0,
						display: "none",
					},
				}}
			/>
			<SafeAreaView style={{ flex: 1 }}>
				<View style={styles.todayWeatherCard}>
					<View style={{ alignItems: "center" }}>

						<Text
							style={{
								fontSize: 35,
								fontWeight: "bold",
								marginBottom: 20,
							}}
						>
							Today
						</Text>
					</View>
					<Text style={styles.todayDate}>
						{new Date(todayWeather.dt * 1000).toLocaleDateString(
							"en-US",
							{
								weekday: "short",
							}
						)}{" "}
						,{" "}
						{new Date(todayWeather.dt * 1000).toLocaleDateString()}
					</Text>
					<View
						style={{
							flexDirection: "row",
							justifyContent: "center",
						}}
					>
						<Text
							style={{
								fontSize: 50,
								fontWeight: "bold",
								color: "#202A44",
							}}
						>
							{todayWeather?.main?.temp || 0}
						</Text>
						<Text style={{ fontSize: 40, color: "#202A44" }}>
							°C
						</Text>
					</View>
					<View style={{ alignItems: "center" }}>
						<Text style={{ fontSize: 18, marginBottom: 10 }}>
							{todayWeather?.weather?.[0]?.description ||
								"Loading..."}
						</Text>
					</View>
				</View>
				<ScrollView style={styles.container}>
					{todayWeather && (
						<View style={{}}>
							<View style={styles.Block}>
								<View style={styles.firstBlock}>
									<Text style={styles.todayInfoText}>
										Pressure:{" "}
										<FontAwesome
											name="tachometer"
											size={12}
										/>{" "}
										{todayWeather.main.pressure} hPa
									</Text>
									<Text style={styles.todayInfoText}>
										Humidity:{" "}
										<FontAwesome
											name="tint"
											size={12}
										/>{" "}
										{todayWeather.main.humidity}%
									</Text>
									<Text style={styles.todayInfoText}>
										Wind Speed:{" "}
										<MaterialIcons
											name="air"
											size={12}
										/>{" "}
										{todayWeather.wind.speed} m/s
									</Text>
								</View>
								<View style={styles.secondBlock}>
									<Text style={styles.todayInfoText}>
										Wind Direction:{" "}
										<MaterialIcons
											name="navigation"
											size={12}
										/>{" "}
										{todayWeather.wind.deg}°
									</Text>
									<Text style={styles.todayInfoText}>
										Cloud Cover:{" "}
										<MaterialIcons
											name="cloud"
											size={12}
										/>{" "}
										{todayWeather.clouds.all}%
									</Text>
									<Text style={styles.todayInfoText}>
										Rain:{" "}
										<MaterialIcons
											name="water"
											size={12}
										/>{" "}
										{todayWeather.rain
											? todayWeather.rain["1h"]
											: "0"}{" "}
										mm
									</Text>
								</View>
							</View>
						</View>
					)}

					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							marginBottom: 12,
						}}
					>
						Weather Forecast
					</Text>
					<Text
						style={{
							fontSize: 18,
							fontWeight: "bold",
							marginBottom: 30,
						}}
					>
						{weather.city.name},{weather.city.country}
					</Text>

					<ScrollView
						horizontal
						style={{}}
					>
						{weather && (
							<View style={{ flexDirection: "row" }}>
								{dailyWeather.map((item, index) => (
									<View
										key={index}
										style={styles.weatherItem}
									>
										<Text style={styles.dateText}>
											{new Date(
												item.dt * 1000
											).toLocaleDateString()}
											,{" "}
											{new Date(
												item.dt * 1000
											).toLocaleDateString("en-US", {
												weekday: "long",
											})}
										</Text>

										<View style={styles.weatherDetails}>
											<View
												style={{ alignItems: "center" }}
											>
												<Text
													style={{
														fontSize: 18,
														marginBottom: 12,
														color: "#EAF1FF",
													}}
												>
													{
														item.weather[0]
															.description
													}
												</Text>
											</View>

											<View
												style={{
													justifyContent: "center",
													alignItems: "center",
												}}
											>
												<Image
													source={{
														uri: `http://openweathermap.org/img/wn/${item.weather[0].icon}.png`,
														cache: "force-cache",
													}}
													style={{
														width: 70,
														height: 60,
														marginRight: 10,
													}}
												/>
												<Text
													style={{
														fontSize: 25,
														marginBottom: 12,
														color: "#EAF1FF",
													}}
												>
													{" "}
													<MaterialIcons
														name="thermostat"
														size={12}
													/>{" "}
													{item.main.temp}°C
												</Text>
											</View>

											<View
												style={{
													flexDirection: "row",
													alignItems: "center",
													justifyContent: "center",
												}}
											>
												<View style={{ width: "50%" }}>
													<Text
														style={styles.infoText}
													>
														Pressure:{" "}
														<FontAwesome
															name="tachometer"
															size={12}
														/>{" "}
														{item.main.pressure} hPa
													</Text>
													<Text
														style={styles.infoText}
													>
														Humidity:{" "}
														<FontAwesome
															name="tint"
															size={12}
														/>{" "}
														{item.main.humidity}%
													</Text>
													<Text
														style={styles.infoText}
													>
														Wind Speed:{" "}
														<MaterialIcons
															name="air"
															size={12}
														/>{" "}
														{item.wind.speed} m/s
													</Text>
												</View>

												<View
													style={{
														width: "50%",
														borderLeftWidth: 1,
														borderLeftColor:
															"#EAF1FF",
													}}
												>
													<Text
														style={styles.infoText}
													>
														{" "}
														Wind Direction:{" "}
														<MaterialIcons
															name="navigation"
															size={12}
														/>{" "}
														{item.wind.deg}°
													</Text>
													<Text
														style={styles.infoText}
													>
														{" "}
														Cloud Cover:{" "}
														<MaterialIcons
															name="cloud"
															size={12}
														/>{" "}
														{item.clouds.all} %
													</Text>
													<Text
														style={styles.infoText}
													>
														{" "}
														Rain:{" "}
														<MaterialIcons
															name="water"
															size={12}
														/>{" "}
														{item.rain
															? item.rain["1h"]
															: "0"}{" "}
														mm
													</Text>
												</View>
											</View>
										</View>
									</View>
								))}
							</View>
						)}
					</ScrollView>
				</ScrollView>
			</SafeAreaView>
		</>
	);
};

const styles = StyleSheet.create({
	container: {
		flex: 1,
		paddingHorizontal: 10,
	},
	Block: {
		backgroundColor: "#F2f9FB",
		alignItems: "center",
		flexDirection: "row",
		justifyContent: "center",
		borderRadius: 5,
		
	},
	firstBlock: {
		fontSize: 16,
		width: "48%",
		padding: 5,
	},
	secondBlock: {
		fontSize: 16,
		width: "48%",
		marginHorizontal: 5,
		padding: 5,
	},
	todayWeatherCard: {
		padding: 5,
		borderRadius: 8,
		backgroundColor: "#F2f9FB",
		// marginBottom: 30,
		elevation: 5,
		width: "100%",
		// height: "43%",
	},
	todayDate: {
		fontSize: 16,
		fontWeight: "bold",
		marginBottom: 10,
		textAlign: "center",
	},
	todayInfoText: {
		fontSize: 15,
		marginTop: 15,
	},
	card: {
		padding: 16,
		borderRadius: 8,
		backgroundColor: "#EAF1FF",
	},

	weatherItem: {
		width: 300,
		marginRight: 5,
		padding: 12,
		borderRadius: 8,
		backgroundColor: "#202A44",
		// height: "97%",
	},
	dateText: {
		fontSize: 20,
		fontWeight: "bold",
		marginBottom: 30,
		color: "#EAF1FF",
	},

	infoText: {
		fontSize: 14,
		color: "#EAF1FF",
		marginBottom: 15,
	},
});

export default Forecast;
