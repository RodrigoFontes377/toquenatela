import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";

export default function ReactionHistoryScreen() {
  const [ranking, setRanking] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      const fetchReactionData = async () => {
        try {
          const existingData = await AsyncStorage.getItem("reactionData");
          const data = existingData ? JSON.parse(existingData) : {};

          const ranked = Object.keys(data)
            .map((name) => ({
              name,
              bestTime: Math.min(...data[name]),
              history: data[name],
            }))
            .sort((a, b) => a.bestTime - b.bestTime);

          setRanking(ranked);
        } catch (error) {
          console.error("Erro ao carregar os dados:", error);
        }
      };

      fetchReactionData();
    }, [])
  );

  const deletePlayerHistory = async (playerName) => {
    Alert.alert(
      "Apagar Histórico",
      `Você tem certeza que deseja apagar o histórico de ${playerName}?`,
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Apagar",
          onPress: async () => {
            try {
              const existingData = await AsyncStorage.getItem("reactionData");
              const data = existingData ? JSON.parse(existingData) : {};

              delete data[playerName];

              await AsyncStorage.setItem("reactionData", JSON.stringify(data));

              setRanking((prev) =>
                prev.filter((player) => player.name !== playerName)
              );

              Alert.alert("Sucesso", `Histórico de ${playerName} apagado.`);
            } catch (error) {
              console.error("Erro ao apagar o histórico:", error);
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Ranking</Text>
      <FlatList
        data={ranking}
        keyExtractor={(item) => item.name}
        renderItem={({ item, index }) => (
          <View style={styles.playerCard}>
            <View style={styles.playerInfo}>
              <Text style={styles.playerName}>
                {index + 1}. {item.name} - Melhor Tempo: {item.bestTime} ms
              </Text>
              <Text style={styles.history}>
                Histórico: {item.history.join(", ")} ms
              </Text>
            </View>
            <TouchableOpacity onPress={() => deletePlayerHistory(item.name)}>
              <Ionicons name="trash" size={24} color="#FF5555" />
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  playerCard: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#ffffff",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    width: "100%",
    elevation: 3,
  },
  playerInfo: { flex: 1 },
  playerName: { fontSize: 18, fontWeight: "bold" },
  history: { fontSize: 16, marginTop: 5 },
});
