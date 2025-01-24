import React from "react";
import { Image } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import ReactionGameScreen from "./screens/ReactionGameScreen";
import ReactionHistoryScreen from "./screens/ReactionHistoryScreen";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ focused }) => {
            let iconName;

            if (route.name === "Jogar") {
              iconName = require("./assets/play.png");
            } else if (route.name === "Ranking") {
              iconName = require("./assets/ranking.png");
            } else if (route.name === "Galeria") {
              iconName = require("./assets/gallery.png");
            }

            return (
              <Image
                source={iconName}
                style={{
                  width: 24,
                  height: 24,
                  tintColor: focused ? "#007BFF" : "#888",
                }}
              />
            );
          },
          tabBarActiveTintColor: "#007BFF",
          tabBarInactiveTintColor: "#888",
        })}
      >
        <Tab.Screen name="Jogar" component={ReactionGameScreen} />
        <Tab.Screen name="Ranking" component={ReactionHistoryScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
