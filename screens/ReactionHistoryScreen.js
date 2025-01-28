import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";

export default function ReactionHistoryScreen() {
  const [ranking, setRanking] = useState([]);

  const loadRanking = async () => {
    const storedData = await AsyncStorage.getItem("reactionData");
    const data = storedData ? JSON.parse(storedData) : {};
    const rankingArray = Object.keys(data)
      .map((name) => ({
        name,
        bestTime: Math.min(...data[name]),
      }))
      .sort((a, b) => a.bestTime - b.bestTime);

    setRanking(rankingArray);
  };

  useFocusEffect(
    useCallback(() => {
      loadRanking();
    }, [])
  );

  const clearData = async () => {
    Alert.alert("Confirmação", "Deseja apagar o ranking?", [
      { text: "Cancelar", style: "cancel" },
      {
        text: "Apagar",
        onPress: async () => {
          await AsyncStorage.removeItem("reactionData");
          setRanking([]);
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <Text style={styles.item}>
            {index + 1}. {item.name} - Melhor Tempo: {item.bestTime} ms
          </Text>
        )}
      />
      <TouchableOpacity onPress={clearData} style={styles.clearButton}>
        <Text style={styles.clearButtonText}>Apagar Ranking</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  item: { fontSize: 18, marginVertical: 10 },
  clearButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "red",
    borderRadius: 5,
  },
  clearButtonText: { color: "white", fontWeight: "bold" },
});
