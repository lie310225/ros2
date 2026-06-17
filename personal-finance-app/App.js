import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { initializeStorage } from './src/storage';
import AddTransactionScreen from './src/screens/AddTransactionScreen';
import BalanceSheetScreen from './src/screens/BalanceSheetScreen';
import IncomeStatementScreen from './src/screens/IncomeStatementScreen';
import CashFlowStatementScreen from './src/screens/CashFlowStatementScreen';
import FinancialAdviceScreen from './src/screens/FinancialAdviceScreen';

const Tab = createBottomTabNavigator();

export default function App() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const init = async () => {
      await initializeStorage();
      setIsReady(true);
    };
    init();
  }, []);

  if (!isReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>加载中...</Text>
      </View>
    );
  }

  return (
    <>
      <StatusBar style="auto" />
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={{
            tabBarActiveTintColor: '#4dabf7',
            tabBarInactiveTintColor: 'gray',
            tabBarStyle: {
              paddingBottom: 5,
              height: 60,
            },
            tabBarLabelStyle: {
              fontSize: 12,
            },
          }}
        >
          <Tab.Screen
            name="记账"
            component={AddTransactionScreen}
            options={{
              tabBarLabel: '记账',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>💰</Text>
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="资产负债表"
            component={BalanceSheetScreen}
            options={{
              tabBarLabel: '资产负债',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>📊</Text>
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="利润表"
            component={IncomeStatementScreen}
            options={{
              tabBarLabel: '利润表',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>📈</Text>
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="现金流量表"
            component={CashFlowStatementScreen}
            options={{
              tabBarLabel: '现金流',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>💵</Text>
              ),
              headerShown: false,
            }}
          />
          <Tab.Screen
            name="财务建议"
            component={FinancialAdviceScreen}
            options={{
              tabBarLabel: '建议',
              tabBarIcon: ({ color, size }) => (
                <Text style={{ fontSize: size, color }}>💡</Text>
              ),
              headerShown: false,
            }}
          />
        </Tab.Navigator>
      </NavigationContainer>
    </>
  );
}
