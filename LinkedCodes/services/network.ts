import NetInfo from "@react-native-community/netinfo";

export const checkIfOnline = async () => {
	const state = await NetInfo.fetch();
	return state.isConnected;
};
