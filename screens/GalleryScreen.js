import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  const loadPhotos = async () => {
    try {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const photoUris = files
        .filter((file) => file.endsWith(".jpg")) // Garante apenas imagens JPG
        .map((file) => `${FileSystem.documentDirectory}${file}`); // Monta URIs completas
      setPhotos(photoUris);
    } catch (error) {
      console.error("Erro ao carregar fotos:", error);
    }
  };

  // Carrega fotos ao iniciar o componente
  useEffect(() => {
    loadPhotos();
  }, []);

  // Função para exibir fotos
  const renderPhoto = ({ item }) => (
    <Image source={{ uri: item }} style={styles.photo} />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galeria</Text>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={renderPhoto}
          style={styles.gallery}
        />
      ) : (
        <Text style={styles.text}>Nenhuma foto capturada.</Text>
      )}
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
  text: { fontSize: 16, color: "gray" },
  gallery: { width: "100%" },
  photo: { width: 100, height: 100, margin: 10 },
});
