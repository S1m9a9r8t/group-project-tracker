import { useRouter } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useStore } from "../store";

export default function ProjectsScreen() {
  const { projects, addProject } = useStore();
  const [name, setName] = useState("");
  const router = useRouter();

  function handleAdd() {
    if (name.trim() === "") return;
    addProject(name.trim());
    setName("");
  }

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="New project name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <Pressable style={styles.button} onPress={handleAdd}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Pressable
            style={styles.card}
            onPress={() =>
              router.push({
                pathname: "/project/[id]",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.cardText}>{item.name}</Text>
          </Pressable>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No projects yet. Add your first one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  row: { flexDirection: "row", gap: 10, marginBottom: 20 },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    color: "#111",
  },
  button: {
    backgroundColor: "#4f46e5",
    borderRadius: 8,
    paddingHorizontal: 20,
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: { fontSize: 16, color: "#111" },
  empty: { color: "#888", textAlign: "center", marginTop: 30 },
});
