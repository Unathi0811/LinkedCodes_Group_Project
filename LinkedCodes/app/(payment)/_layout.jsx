import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <>
            <StatusBar style="dark" />
            <Stack screenOptions={{ 
                headerShown: true,
                headerTitle: 'Payment',
                headerTitleStyle: {
                    fontSize: 20,
                    fontWeight: 'bold',
                    color: '#fff'
                },
                headerStyle: {
                    backgroundColor: '#202A44',
                    elevation: 0,
                    shadowOpacity: 0,
                    },
                    headerBackTitleVisible: false,
                    headerTintColor: '#fff' 
                }} 
                />
        </>
    )
}

export default Layout