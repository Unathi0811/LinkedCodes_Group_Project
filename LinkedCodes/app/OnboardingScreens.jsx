import { StyleSheet, Text, View, Button, Image } from 'react-native';
import React from 'react';
import Onboarding from 'react-native-onboarding-swiper';
import { useNavigation } from '@react-navigation/native';

const Square = ({ isLight, selected }) => {
    let backgroundColor;
    if (isLight) {
        backgroundColor = selected ? 'rgba(0, 0, 0, 0.8)' : 'rgba(0, 0, 0, 0.3)';
    } else {
        backgroundColor = selected ? '#fff' : 'rgba(255, 255, 255, 0.5)';
    }
    return (
        <View
            style={{
                width: 6,
                height: 6,
                marginHorizontal: 3,
                backgroundColor,
            }}
        />
    );
};

const backgroundColor = isLight => (isLight ? '#000' : '#fff');
const color = isLight => backgroundColor(!isLight);

const Done = ({ isLight, ...props }) => {
    const navigation = useNavigation();

    return (
        <Button
            title={'Get Started'}
            buttonStyle={{
                backgroundColor: backgroundColor(isLight),
            }}
            containerViewStyle={{
                marginVertical: 10,
                width: 70,
                backgroundColor: backgroundColor(isLight),
            }}
            textStyle={{ color: color(isLight) }}
            {...props}
            onPress={() => navigation.navigate('Gov_User_screen')}
        />
    );
};

const Next = ({ isLight, ...props }) => (
    <Button
        title={'Next'}
        buttonStyle={{
            backgroundColor: backgroundColor(isLight),
        }}
        containerViewStyle={{
            marginVertical: 10,
            width: 70,
            backgroundColor: backgroundColor(isLight),
        }}
        textStyle={{ color: color(isLight) }}
        {...props}
    />
);

const OnboardingScreens = () => {
    return (
        <Onboarding
            DotComponent={Square}
            NextButtonComponent={Next}
            DoneButtonComponent={Done}
            showSkip={false}
            titleStyles={{ color: '#000' }}
            pages={[
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../assets/maintenance.png')} />,
                    title: 'Welcome to InfraSmart',
                    subtitle: 'Revolutionizing infrastructure management with cutting-edge technology. Manage roads, bridges, and public facilities like never before.',
                    titleStyles: { color: '#000' },
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../assets/analytics.png')} />,
                    title: 'Real-Time Monitoring',
                    subtitle: 'Get live updates on road conditions, traffic, and more with our advanced sensor technology. Stay informed and proactive.',
                    titleStyles: { color: '#000' },
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../assets/prediction.png')} />,
                    title: 'Predictive Maintenance',
                    subtitle: 'Analyze data to predict when repairs are needed. Schedule maintenance before issues become critical and keep your infrastructure in top shape.',
                    titleStyles: { color: '#000' },
                },
                {
                    backgroundColor: '#fff',
                    image: <Image style={styles.image} source={require('../assets/reporting.png')} />,
                    title: 'Instant Incident Reporting',
                    subtitle: 'Report issues directly through the app with photos and descriptions. Track maintenance tasks and view trends with our analytics dashboard.',
                    titleStyles: { color: '#000' },
                },
            ]}
        />
    );
};

export default OnboardingScreens;

const styles = StyleSheet.create({
    image: {
        width: 230,
        height: 230,
    }
});
