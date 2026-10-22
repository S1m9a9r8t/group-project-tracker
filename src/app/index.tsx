import { useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

type Project = {
  id: string;
  name: string;
};

export default function ProjectsScreen() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState("");

  function addProject() {
    if (name.trim() === "") return;

    const newProject: Project = {
      id: Date.now().toString(),
      name: name.trim(),
    };

    setProjects([...projects, newProject]);
    setName("");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Projects</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="New project name"
          placeholderTextColor="#888"
          value={name}
          onChangeText={setName}
        />
        <Pressable style={styles.button} onPress={addProject}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={projects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.empty}>No projects yet. Add your first one!</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20, paddingTop: 60 },
  title: { fontSize: 28, fontWeight: "bold", color: "#111", marginBottom: 20 },
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
