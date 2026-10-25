import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useStore } from "../../store";

function todayString() {
  return new Date().toISOString().slice(0, 10);
}

function isValidDate(text: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(text)) return false;
  return !isNaN(new Date(text).getTime());
}

export default function ProjectScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { projects, members, tasks, addMember, addTask, toggleTask } =
    useStore();

  const [memberName, setMemberName] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [dueDate, setDueDate] = useState(todayString());
  const [selectedMemberId, setSelectedMemberId] = useState("");
  const [error, setError] = useState("");
  const [currentMemberId, setCurrentMemberId] = useState("");
  const [notice, setNotice] = useState("");

  function handleToggle(task: { id: string; assignedMemberId: string }) {
    if (currentMemberId === "") {
      setNotice('Choose who you are first (see "I am" above).');
      return;
    }
    if (currentMemberId !== task.assignedMemberId) {
      setNotice("Only the assigned member can tick this task.");
      return;
    }
    setNotice("");
    toggleTask(task.id);
  }

  const project = projects.find((p) => p.id === id);
  const projectMembers = members.filter((m) => m.projectId === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  function handleAddMember() {
    if (memberName.trim() === "") return;
    addMember(memberName.trim(), id);
    setMemberName("");
  }

  function handleAddTask() {
    if (taskTitle.trim() === "") {
      setError("Please enter a task title.");
      return;
    }
    if (selectedMemberId === "") {
      setError("Please choose who the task is for.");
      return;
    }
    if (!isValidDate(dueDate)) {
      setError("Date must look like 2026-11-30.");
      return;
    }
    addTask(taskTitle.trim(), dueDate, id, selectedMemberId);
    setTaskTitle("");
    setSelectedMemberId("");
    setError("");
  }

  function memberNameFor(memberId: string) {
    return members.find((m) => m.id === memberId)?.name ?? "Unknown";
  }

  if (!project) {
    return (
      <View style={styles.container}>
        <Text style={styles.empty}>Project not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={{ paddingBottom: 40 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={styles.title}>{project.name}</Text>

      {/* ---------- Members ---------- */}
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

      {projectMembers.length === 0 && (
        <Text style={styles.empty}>No members yet.</Text>
      )}
      {projectMembers.map((m) => (
        <View key={m.id} style={styles.card}>
          <Text style={styles.cardText}>{m.name}</Text>
        </View>
      ))}

      <Pressable
        style={[
          styles.button,
          styles.fullButton,
          { backgroundColor: "#dc2626", marginTop: 20 },
        ]}
        onPress={() =>
          router.push({ pathname: "/behind/[id]", params: { id } })
        }
      >
        <Text style={styles.buttonText}>Who's behind?</Text>
      </Pressable>

      {/* ---------- Who am I ---------- */}
      {projectMembers.length > 0 && (
        <View style={{ marginTop: 20 }}>
          <Text style={styles.hint}>I am:</Text>
          <View style={styles.chips}>
            {projectMembers.map((m) => {
              const selected = m.id === currentMemberId;
              return (
                <Pressable
                  key={m.id}
                  style={[styles.chip, selected && styles.chipSelected]}
                  onPress={() => {
                    setCurrentMemberId(m.id);
                    setNotice("");
                  }}
                >
                  <Text
                    style={[
                      styles.chipText,
                      selected && styles.chipTextSelected,
                    ]}
                  >
                    {m.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* ---------- Tasks ---------- */}
      <Text style={[styles.section, { marginTop: 24 }]}>
        Tasks ({projectTasks.length})
      </Text>

      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder="Task title"
        placeholderTextColor="#888"
        value={taskTitle}
        onChangeText={setTaskTitle}
      />

      <TextInput
        style={[styles.input, { marginBottom: 10 }]}
        placeholder="Due date (YYYY-MM-DD)"
        placeholderTextColor="#888"
        value={dueDate}
        onChangeText={setDueDate}
      />

      <Text style={styles.hint}>Assign to:</Text>
      <View style={styles.chips}>
        {projectMembers.length === 0 && (
          <Text style={styles.hint}>Add a member first.</Text>
        )}
        {projectMembers.map((m) => {
          const selected = m.id === selectedMemberId;
          return (
            <Pressable
              key={m.id}
              style={[styles.chip, selected && styles.chipSelected]}
              onPress={() => setSelectedMemberId(m.id)}
            >
              <Text
                style={[styles.chipText, selected && styles.chipTextSelected]}
              >
                {m.name}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {error !== "" && <Text style={styles.error}>{error}</Text>}

      <Pressable
        style={[styles.button, styles.fullButton]}
        onPress={handleAddTask}
      >
        <Text style={styles.buttonText}>Add task</Text>
      </Pressable>

      <View style={{ height: 16 }} />

      {projectTasks.length === 0 && (
        <Text style={styles.empty}>No tasks yet.</Text>
      )}
      {notice !== "" && <Text style={styles.error}>{notice}</Text>}

      {projectTasks.map((t) => (
        <View key={t.id} style={[styles.card, styles.taskRow]}>
          <Pressable
            style={[styles.checkbox, t.done && styles.checkboxDone]}
            onPress={() => handleToggle(t)}
          >
            {t.done && <Text style={styles.checkmark}>✓</Text>}
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={[styles.cardText, t.done && styles.doneText]}>
              {t.title}
            </Text>
            <Text style={styles.cardSub}>
              {memberNameFor(t.assignedMemberId)} · due {t.dueDate}
            </Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 20 },
  section: { fontSize: 18, fontWeight: "600", color: "#111", marginBottom: 12 },
  row: { flexDirection: "row", gap: 10, marginBottom: 16 },
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
    paddingVertical: 12,
    justifyContent: "center",
  },
  fullButton: { alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 10,
  },
  cardText: { fontSize: 16, color: "#111" },
  cardSub: { fontSize: 13, color: "#666", marginTop: 4 },
  empty: { color: "#888", textAlign: "center", marginVertical: 12 },
  hint: { color: "#666", marginBottom: 8 },
  chips: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 12 },
  chip: {
    borderWidth: 1,
    borderColor: "#4f46e5",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  chipSelected: { backgroundColor: "#4f46e5" },
  chipText: { color: "#4f46e5" },
  chipTextSelected: { color: "#fff", fontWeight: "bold" },
  error: { color: "#dc2626", marginBottom: 10 },
  taskRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#4f46e5",
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxDone: { backgroundColor: "#16a34a", borderColor: "#16a34a" },
  checkmark: { color: "#fff", fontWeight: "bold" },
  doneText: { textDecorationLine: "line-through", color: "#888" },
});
