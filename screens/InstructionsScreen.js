import React from "react";
import { View, Text, StyleSheet, ImageBackground } from "react-native";

export default function InstructionsScreen() {
  return (
    <ImageBackground
      source={require("../assets/WhatsApp Image 2025-01-29 at 15.34.38.jpeg")}
      style={styles.background}
    >
      <View style={styles.container}>
        <Text style={styles.title}>Instruções do Jogo</Text>
        <Text style={styles.instructions}>
          1. Digite seu nome na tela de jogo.{"\n\n"}
          2. Pressione "Iniciar" e aguarde o sinal.{"\n\n"}
          3. Quando o sinal aparecer, toque na tela o mais rápido possível.
          {"\n\n"}
          4. Seu tempo de reação será registrado e salvo.{"\n\n"}
          5. Confira seu desempenho na tela de ranking.
        </Text>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: { flex: 1 },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "white",
    letterSpacing: 1.5,
  },
  instructions: {
    fontSize: 18,
    textAlign: "center",
    color: "white",
    letterSpacing: 1.2,
  },
});
