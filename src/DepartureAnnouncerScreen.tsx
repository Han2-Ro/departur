import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { AnnouncerStatus } from "./announcerEngine";

type Props = {
  status: AnnouncerStatus;
  onStart: () => void;
  error?: string;
};

const statusLabel = (status: AnnouncerStatus): string => {
  if (status === "idle") {
    return "Status: Idle";
  }
  if (status === "running") {
    return "Status: Announcer läuft";
  }
  return "Status: Fehler";
};

export const DepartureAnnouncerScreen = ({ status, onStart, error }: Props) => {
  const isRunning = status === "running";
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Departure Announcer</Text>
      <Text style={styles.status}>{statusLabel(status)}</Text>
      {error ? <Text style={styles.error}>Fehler: {error}</Text> : null}
      <TouchableOpacity
        accessibilityRole="button"
        disabled={isRunning}
        onPress={onStart}
        style={[styles.button, isRunning ? styles.buttonDisabled : undefined]}
      >
        <Text style={styles.buttonText}>
          {isRunning ? "Announcer läuft..." : "Announcer starten"}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: "#fff",
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 12,
  },
  status: {
    fontSize: 16,
    marginBottom: 8,
  },
  error: {
    color: "#b00020",
    marginBottom: 12,
  },
  button: {
    backgroundColor: "#0057d9",
    borderRadius: 8,
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  buttonDisabled: {
    backgroundColor: "#8ca6d1",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
