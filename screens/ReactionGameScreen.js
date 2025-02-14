import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
  ImageBackground,
} from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function ReactionGameScreen() {
  const [isWaiting, setIsWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] =
    MediaLibrary.usePermissions();

  if (!permission) {
    console.log("Carregando permissões da câmera...");
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Precisamos da permissão para acessar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  if (!mediaPermission) {
    console.log("Carregando permissões da biblioteca...");
    return <View />;
  }

  if (!mediaPermission.granted) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Precisamos da permissão para acessar a câmera.</Text>
        <Button onPress={requestMediaPermission} title="Conceder Permissão" />
      </View>
    );
  }

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
      await saveReactionTimeAndPhoto(playerName, time);
    } else {
      Alert.alert("Atenção", 'Pressione o botão "Iniciar" para começar.');
    }
  };

  async function takePhoto() {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      console.log("Foto capturada:", photo.uri);
      return photo;
    }
  }

  const saveReactionTimeAndPhoto = async (name, time) => {
    try {
      const photo = await takePhoto();
      if (photo && photo.uri) {
        const asset = await MediaLibrary.createAssetAsync(photo.uri);
        console.log("Foto salva na galeria:", asset.uri);
      } else {
        console.error("Erro: Foto não capturada.");
      }

      // Salvar tempo de reação
      const storedData = await AsyncStorage.getItem("reactionData");
      const data = storedData ? JSON.parse(storedData) : {};
      if (!data[name]) {
        data[name] = [];
      }
      data[name].push(time);

      await AsyncStorage.setItem("reactionData", JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao salvar a foto e os dados:", error);
    }
  };

  return (
    <ImageBackground
      source={require("../assets/WhatsApp Image 2025-01-28 at 16.59.35.jpeg")}
      style={styles.background}
    >
      <View style={styles.overlay}>
        <CameraView
          ref={cameraRef}
          style={styles.hiddenCamera}
          facing="front"
        />
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
          style={[styles.touchZone, isWaiting ? styles.waiting : styles.ready]}
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
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  background: { flex: 1 },
  camera: {
    flex: 1,
    position: "absolute",
    width: "100%",
    height: "50%",
    top: 0,
  },
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
  hiddenCamera: {
    display: "none",
  },
});
