import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { AnnouncerStatus } from "./announcerEngine";
import type { Station } from "./types/station";

type Props = {
  status: AnnouncerStatus;
  onStart: () => void;
  error?: string;
  selectedStation: Station;
  searchQuery: string;
  searchResults: Station[];
  onSearchQueryChange: (query: string) => void;
  onSelectStation: (station: Station) => void;
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

export const DepartureAnnouncerScreen = ({
  status,
  onStart,
  error,
  selectedStation,
  searchQuery,
  searchResults,
  onSearchQueryChange,
  onSelectStation,
}: Props) => {
  const isRunning = status === "running";

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Departure Announcer</Text>
      <Text style={styles.status}>{statusLabel(status)}</Text>
      <Text style={styles.selectedStation}>
        Ausgewählte Station: {selectedStation.name} ({selectedStation.diva})
      </Text>

      <TextInput
        accessibilityLabel="Station suchen"
        editable={!isRunning}
        onChangeText={onSearchQueryChange}
        placeholder="Station suchen"
        style={[styles.input, isRunning ? styles.inputDisabled : undefined]}
        value={searchQuery}
      />

      <View style={styles.resultsContainer}>
        {searchResults.map((station) => (
          <TouchableOpacity
            accessibilityLabel={`Station wählen: ${station.name}`}
            accessibilityRole="button"
            disabled={isRunning}
            key={station.diva}
            onPress={() => onSelectStation(station)}
            style={[
              styles.resultButton,
              isRunning ? styles.resultButtonDisabled : undefined,
            ]}
          >
            <Text style={styles.resultButtonText}>{station.name}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {error ? <Text style={styles.error}>Fehler: {error}</Text> : null}
      <TouchableOpacity
        accessibilityLabel={isRunning ? "Announcer läuft..." : "Announcer starten"}
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
  selectedStation: {
    fontSize: 14,
    marginBottom: 12,
  },
  input: {
    alignSelf: "stretch",
    borderColor: "#9e9e9e",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  inputDisabled: {
    backgroundColor: "#f2f2f2",
    color: "#7a7a7a",
  },
  resultsContainer: {
    alignSelf: "stretch",
    marginBottom: 12,
    maxHeight: 180,
  },
  resultButton: {
    borderColor: "#0057d9",
    borderRadius: 8,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  resultButtonDisabled: {
    borderColor: "#8ca6d1",
  },
  resultButtonText: {
    color: "#003a99",
    fontSize: 14,
    fontWeight: "500",
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
