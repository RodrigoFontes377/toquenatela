import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList, Image } from "react-native";
import * as FileSystem from "expo-file-system";

export default function GalleryScreen() {
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const loadPhotos = async () => {
      const files = await FileSystem.readDirectoryAsync(
        FileSystem.documentDirectory
      );
      const photoUris = files
        .filter((file) => file.endsWith(".jpg"))
        .map((file) => `${FileSystem.documentDirectory}${file}`);
      setPhotos(photoUris);
    };

    loadPhotos();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Galeria</Text>
      {photos.length > 0 ? (
        <FlatList
          data={photos}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <Image source={{ uri: item }} style={styles.photo} />
          )}
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
    padding: 20,
    backgroundColor: "#f8f9fa",
  },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  text: { fontSize: 16, color: "#555" },
  photo: { width: 100, height: 100, margin: 10 },
});
