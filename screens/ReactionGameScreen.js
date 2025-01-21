import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Camera } from "expo-camera";
import * as FileSystem from "expo-file-system";

export default function ReactionGameScreen() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  const takeHiddenPicture = async () => {
    if (cameraRef.current) {
      try {
        const photo = await cameraRef.current.takePictureAsync({
          skipProcessing: true,
        });
        const fileName = `${FileSystem.documentDirectory}${Date.now()}.jpg`;
        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileName,
        });
      } catch (error) {
        console.error("Erro ao tirar foto:", error);
      }
    }
  };

  const startGame = () => {
    if (!playerName.trim()) {
      Alert.alert("Erro", "Insira um nome antes de começar.");
      return;
    }

    setReactionTime(null);
    setIsWaiting(true);

    const delay = Math.floor(Math.random() * 3000) + 2000;

    setTimeout(() => {
      setStartTime(Date.now());
      setIsWaiting(false);
    }, delay);
  };

  const handlePress = async () => {
    if (isWaiting) {
      Alert.alert("Calma!", "Espere o sinal para tocar.");
      return;
    }

    if (startTime) {
      const time = Date.now() - startTime;
      setReactionTime(time);
      await saveReactionTime(playerName, time);
      await takeHiddenPicture();
    } else {
      Alert.alert("Atenção", 'Pressione o botão "Iniciar" para começar.');
    }
  };

  const saveReactionTime = async (name, time) => {
    try {
      const existingData = await AsyncStorage.getItem("reactionData");
      const data = existingData ? JSON.parse(existingData) : {};

      if (!data[name]) {
        data[name] = [];
      }

      data[name].push(time);

      await AsyncStorage.setItem("reactionData", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar o tempo de reação:", error);
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>Permissão para acessar a câmera negada.</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.front}
        ref={cameraRef}
      >
        <View style={styles.overlay}>
          <Text style={styles.title}>Reaja Rápido</Text>
          <TextInput
            style={styles.input}
            placeholder="Digite seu nome"
            value={playerName}
            onChangeText={setPlayerName}
          />
          <Button title="Iniciar" onPress={startGame} color="#007BFF" />
          <View style={styles.spacer} />
          <TouchableOpacity
            style={[
              styles.touchZone,
              isWaiting ? styles.waiting : styles.ready,
            ]}
            onPress={handlePress}
          >
            <Text style={styles.zoneText}>
              {isWaiting ? "Espere..." : "Toque Agora!"}
            </Text>
          </TouchableOpacity>
          {reactionTime && (
            <Text style={styles.result}>
              Seu tempo de reação: {reactionTime} ms
            </Text>
          )}
        </View>
      </Camera>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    padding: 20,
  },
  title: { fontSize: 24, fontWeight: "bold", color: "white", marginBottom: 20 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 20,
    width: "80%",
    backgroundColor: "white",
  },
  spacer: { height: 20 },
  touchZone: {
    width: "80%",
    height: 100,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  waiting: { backgroundColor: "#FFCC00" },
  ready: { backgroundColor: "#00CC66" },
  zoneText: { fontSize: 18, color: "#FFFFFF" },
  result: { fontSize: 18, color: "white", marginTop: 20 },
});
