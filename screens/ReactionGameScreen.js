import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from "react-native";
import { CameraView, CameraType, useCameraPermissions } from "expo-camera";
import * as FileSystem from "expo-file-system";

export default function ReactionGameScreen() {
  const [facing, setFacing] = useState("front");
  const [isWaiting, setIsWaiting] = useState(false);
  const [startTime, setStartTime] = useState(null);
  const [reactionTime, setReactionTime] = useState(null);
  const [playerName, setPlayerName] = useState("");
  const cameraRef = useRef(null);

  const [permission, requestPermission] = useCameraPermissions();

  if (!permission) {
    console.log("Carregando permissões da câmera...");
    return <View />;
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text>Precisamos da permissão para acessar a câmera.</Text>
        <Button onPress={requestPermission} title="Conceder Permissão" />
      </View>
    );
  }

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "front" ? "back" : "front"));
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
      await saveReactionTimeAndPhoto(playerName, time);
    } else {
      Alert.alert("Atenção", 'Pressione o botão "Iniciar" para começar.');
    }
  };

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync({ base64: true });
      return photo.base64;
    }
    return null;
  };

  const saveReactionTimeAndPhoto = async (name, time) => {
    const fileName = `${FileSystem.documentDirectory}${Date.now()}.jpg`;

    try {
      const photoBase64 = await takePhoto();
      if (photoBase64) {
        await FileSystem.writeAsStringAsync(fileName, photoBase64, {
          encoding: FileSystem.EncodingType.Base64,
        });
        console.log("Foto salva em:", fileName);
      } else {
        console.error("Erro ao capturar a foto.");
      }
    } catch (error) {
      console.error("Erro ao salvar a foto:", error);
    }
  };

  return (
    <View style={styles.container}>
      <CameraView ref={cameraRef} style={styles.camera} facing={facing}>
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
          <TouchableOpacity onPress={toggleCameraFacing} style={styles.button}>
            <Text style={styles.text}>Alternar Câmera</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
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
  button: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#007BFF",
    borderRadius: 5,
  },
  text: { fontSize: 18, color: "white", textAlign: "center" },
});
