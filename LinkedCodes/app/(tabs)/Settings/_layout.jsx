import { StatusBar } from 'expo-status-bar'
import { Stack } from 'expo-router'

const Layout = () => {
    return (
        <>
            <StatusBar style="light" />
            <Stack screenOptions={{ headerShown: false}} />
        </>
    )
}

export default Layout