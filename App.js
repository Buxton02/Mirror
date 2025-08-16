import 'react-native-gesture-handler';
import 'react-native-reanimated'; // <-- This must come first

import React, { useCallback } from 'react';
import * as SplashScreen from 'expo-splash-screen';
import * as Font from 'expo-font';

import { SafeAreaView, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Log from './src/components/JournalMain/Log';
import Home from './src/pages/Home';
import Chat from './src/pages/Chat';
import Account from './src/pages/Account';
import Journal from './src/pages/Journal';
import Login from './src/pages/Login';
import Signup from './src/pages/Signup';


SplashScreen.preventAutoHideAsync();

const Tab = createBottomTabNavigator();

export default function App() {
  const [fontsLoaded] = Font.useFonts({
    Quicksand: require('./src/assets/fonts/Quicksand-VariableFont_wght.ttf'),
    Montserrat: require('./src/assets/fonts/Montserrat-VariableFont_wght.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;

  return (
    <SafeAreaView style={styles.safeArea} onLayout={onLayoutRootView}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: 'none' },
          }}
        >
          <Tab.Screen name="Login" component={Login}/>
          <Tab.Screen name="Signup" component={Signup} />
          

          <Tab.Screen name="Home" component={Home} />
          <Tab.Screen name="Chat" component={Chat} />
          <Tab.Screen name="Journal" component={Journal} />
          <Tab.Screen name="Account" component={Account} />
          <Tab.Screen name="Log" component={Log}/>
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
  },
});
