import React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import List_Profile from '../Homescreens/List_Profile';
import MyAccount from '../Homescreens/MyAccount';
import Groupe from '../Homescreens/Posts';
import Horizon from '../Homescreens/Horizon';
import Gallery from '../Homescreens/Gallery';
import { useRoute } from '@react-navigation/native';

const Tab = createMaterialBottomTabNavigator();

const Home = ({ navigation }) => {
  const route = useRoute();
  const { currentid } = route.params;

  return (
    <Tab.Navigator
      initialRouteName="listprofile"
      screenOptions={{ tabBarVisible: true }}
      backBehavior="initialRoute"
    >
      <Tab.Screen
        name="listprofile"
        component={List_Profile}
        initialParams={{ currentid: currentid }}
        options={{
          tabBarLabel: 'List Profile',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-list" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="groupe"
        component={Groupe}
        options={{
          tabBarLabel: 'Posts',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="forum" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Horizon"
        component={Horizon}
        options={{
          tabBarLabel: 'Horizon',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="brush" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Gallery"
        component={Gallery}
        options={{
          tabBarLabel: 'Gallery',
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="image-album" size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="myaccount"
        component={MyAccount}
        initialParams={{ currentid: currentid }}
        options={{
          tabBarLabel: 'My Account',
          tabBarIcon: ({ color }) => (
            <Ionicons name="ios-person" size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default Home;
