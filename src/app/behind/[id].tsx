import { useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useStore } from "../../store";

function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

function daysLate(due: string, today: string) {
  const ms = new Date(today).getTime() - new Date(due).getTime();
  return Math.round(ms / 86400000);
}

export default function BehindScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { projects, members, tasks } = useStore();
  const today = todayString();

  const project = projects.find((p) => p.id === id);
  const projectMembers = members.filter((m) => m.projectId === id);
  const projectTasks = tasks.filter((t) => t.projectId === id);

  const rows = projectMembers
    .map((member) => {
      const mine = projectTasks.filter((t) => t.assignedMemberId === member.id);
      const overdue = mine.filter((t) => !t.done && t.dueDate < today);
      const done = mine.filter((t) => t.done).length;
      return { member, total: mine.length, done, overdue };
    })
    .sort((a, b) => b.overdue.length - a.overdue.length);

  const totalOverdue = rows.reduce((sum, r) => sum + r.overdue.length, 0);

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
    >
      <Text style={styles.title}>{project.name}</Text>

      <View
        style={[
          styles.summary,
          totalOverdue > 0 ? styles.summaryBad : styles.summaryGood,
        ]}
      >
        <Text style={styles.summaryText}>
          {totalOverdue > 0
            ? `${totalOverdue} overdue task${totalOverdue === 1 ? "" : "s"}`
            : "Everyone is on track 🎉"}
        </Text>
      </View>

      {rows.length === 0 && (
        <Text style={styles.empty}>Add members and tasks first.</Text>
      )}

      {rows.map(({ member, total, done, overdue }) => {
        const percent = total === 0 ? 0 : Math.round((done / total) * 100);
        const behind = overdue.length > 0;
        return (
          <View key={member.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.name}>{member.name}</Text>
              <View
                style={[
                  styles.badge,
                  behind ? styles.badgeBad : styles.badgeGood,
                ]}
              >
                <Text style={styles.badgeText}>
                  {behind ? "Behind" : "On track"}
                </Text>
              </View>
            </View>

            <Text style={styles.sub}>
              {done} of {total} tasks done
            </Text>
            <View style={styles.barBg}>
              <View style={[styles.barFill, { width: `${percent}%` }]} />
            </View>

            {overdue.map((t) => (
              <Text key={t.id} style={styles.overdue}>
                • {t.title} — {daysLate(t.dueDate, today)} day
                {daysLate(t.dueDate, today) === 1 ? "" : "s"} late
              </Text>
            ))}
          </View>
        );
      })}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 20 },
  title: { fontSize: 26, fontWeight: "bold", color: "#111", marginBottom: 16 },
  summary: { padding: 16, borderRadius: 8, marginBottom: 20 },
  summaryBad: { backgroundColor: "#fee2e2" },
  summaryGood: { backgroundColor: "#dcfce7" },
  summaryText: { fontSize: 16, fontWeight: "600", color: "#111" },
  card: {
    backgroundColor: "#f3f4f6",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 18, fontWeight: "600", color: "#111" },
  badge: { borderRadius: 12, paddingHorizontal: 10, paddingVertical: 4 },
  badgeBad: { backgroundColor: "#dc2626" },
  badgeGood: { backgroundColor: "#16a34a" },
  badgeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
  sub: { color: "#666", marginTop: 6, marginBottom: 8 },
  barBg: {
    height: 8,
    backgroundColor: "#d1d5db",
    borderRadius: 4,
    overflow: "hidden",
  },
  barFill: { height: 8, backgroundColor: "#4f46e5" },
  overdue: { color: "#dc2626", marginTop: 8 },
  empty: { color: "#888", textAlign: "center", marginVertical: 12 },
});
