import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    FlatList,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { useStore } from "../../store";

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { projects, members, addMember } = useStore();
  const [memberName, setMemberName] = useState("");

  const project = projects.find((p) => p.id === id);
  const projectMembers = members.filter((m) => m.projectId === id);

  function handleAddMember() {
    if (memberName.trim() === "") return;
    addMember(memberName.trim(), id);
    setMemberName("");
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Project not found.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{project.name}</Text>
      <Text style={styles.section}>Team members ({projectMembers.length})</Text>

      <View style={styles.row}>
        <TextInput
          style={styles.input}
          placeholder="Member name"
          placeholderTextColor="#888"
          value={memberName}
          onChangeText={setMemberName}
        />
        <Pressable style={styles.button} onPress={handleAddMember}>
          <Text style={styles.buttonText}>Add</Text>
        </Pressable>
      </View>

      <FlatList
        data={projectMembers}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardText}>{item.name}</Text>
          </View>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No members yet.</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", color: "#111", marginBottom: 12 },
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
