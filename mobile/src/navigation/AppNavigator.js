import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Ionicons } from '@expo/vector-icons';
import { View, Text } from 'react-native';

import HomeScreen from '../screens/expenses/HomeScreen';
import AddExpenseScreen from '../screens/expenses/AddExpenseScreen';
import EditExpenseScreen from '../screens/expenses/EditExpenseScreen';
import AnalyticsScreen from '../screens/analytics/AnalyticsScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();

// Helper to render header titles with icons
const HeaderTitle = ({ title, icon }) => (
  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Ionicons name={icon} size={24} color="#e94560" style={{ marginRight: 8 }} />
    <Text style={{ color: '#e94560', fontSize: 22, fontWeight: '800' }}>{title}</Text>
  </View>
);

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: '#1a1a2e', height: 110 },
        headerTintColor: '#e94560',
        headerTitleStyle: { fontWeight: '800', fontSize: 22 },
        headerShadowVisible: false,
      }}
    >
      <HomeStack.Screen
        name="HomeScreen"
        component={HomeScreen}
        options={{
          headerTitle: () => <HeaderTitle title="My Expenses" icon="wallet" />,
        }}
      />
      <HomeStack.Screen
        name="AddExpense"
        component={AddExpenseScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Add Expense" icon="add-circle" />,
        }}
      />
      <HomeStack.Screen
        name="EditExpense"
        component={EditExpenseScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Edit Expense" icon="create" />,
        }}
      />
    </HomeStack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarStyle: {
          backgroundColor: '#1a1a2e',
          borderTopColor: '#16213e',
          height: 65,
          paddingBottom: 10,
        },
        tabBarActiveTintColor: '#e94560',
        tabBarInactiveTintColor: '#8892b0',
        headerStyle: { backgroundColor: '#1a1a2e', height: 110 },
        headerTintColor: '#e94560',
        headerTitleStyle: { fontWeight: '800', fontSize: 22 },
        headerShadowVisible: false,
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') {
            iconName = 'list';
          } else if (route.name === 'Analytics') {
            iconName = 'bar-chart';
          }
          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen
        name="Home"
        component={HomeStackNavigator}
        options={{
          headerShown: false,
          tabBarLabel: 'Expenses',
        }}
      />
      <Tab.Screen
        name="Analytics"
        component={AnalyticsScreen}
        options={{
          headerTitle: () => <HeaderTitle title="Analytics" icon="analytics" />,
          tabBarLabel: 'Analytics',
        }}
      />
    </Tab.Navigator>
  );
}
