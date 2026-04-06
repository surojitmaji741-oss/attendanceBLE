import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

// --- DATA CONSTANTS (Normally from a database) ---
const ATTENDANCE = [10, 15, 17, 18, 20];
const HOLIDAYS = [7, 14, 21, 28];

const AttendanceCalendar = () => {
  const [viewType, setViewType] = useState<"Weekly" | "Monthly">("Weekly");

  const today = new Date();
  const currentDayNumber = today.getDate();
  const currentMonthName = today.toLocaleString("default", { month: "long" });

  // --- LOGIC: CALCULATE THE WEEK ---
  const getWeekDays = () => {
    const startOfWeek = new Date(today);
    const day = today.getDay();
    const diff = today.getDate() - day + (day === 0 ? -6 : 1);
    startOfWeek.setDate(diff);

    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date(startOfWeek);
      d.setDate(startOfWeek.getDate() + i);
      return {
        dayName: d.toLocaleDateString("en-US", { weekday: "short" }),
        date: d.getDate(),
        isToday: d.toDateString() === today.toDateString(),
      };
    });
  };

  const getStatusColor = (date: number) => {
    if (HOLIDAYS.includes(date)) return "#FF9800";
    if (ATTENDANCE.includes(date)) return "#4CAF50";
    if (date < currentDayNumber) return "#F44336";
    return "#E0E0E0";
  };
  return (
    <View style={styles.card}>
      <View style={styles.headerRow}>
        <Text
          style={styles.monthText}
        >{`${currentMonthName} ${today.getFullYear()}`}</Text>
        <View style={styles.toggleContainer}>
          {["Weekly", "Monthly"].map((mode) => (
            <TouchableOpacity
              key={mode}
              onPress={() => setViewType(mode as any)}
              style={[
                styles.toggleBtn,
                viewType === mode && styles.activeToggle,
              ]}
            >
              <Text
                style={[
                  styles.toggleLabel,
                  viewType === mode && styles.activeLabel,
                ]}
              >
                {mode}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {viewType === "Weekly" ? (
        <View style={styles.daysRow}>
          {getWeekDays().map((item) => (
            <View key={item.date} style={styles.dayWrapper}>
              <View style={[styles.dayCard, item.isToday && styles.todayCard]}>
                <Text
                  style={[styles.dayName, item.isToday && { color: "#A5F3E0" }]}
                >
                  {item.dayName}
                </Text>
                <Text
                  style={[styles.dayDate, item.isToday && { color: "#FFF" }]}
                >
                  {item.date}
                </Text>
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(item.date) },
                ]}
              />
            </View>
          ))}
        </View>
      ) : (
        <View style={styles.gridDays}>
          {Array.from({ length: 30 }, (_, i) => i + 1).map((date) => (
            <View key={date} style={styles.gridCell}>
              <View
                style={[
                  styles.dateCircle,
                  date === currentDayNumber && styles.todayCircle,
                ]}
              >
                <Text
                  style={[
                    styles.gridDateText,
                    date === currentDayNumber && { color: "#FFF" },
                  ]}
                >
                  {date}
                </Text>
              </View>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor(date) },
                ]}
              />
            </View>
          ))}
        </View>
      )}
      <View style={styles.legend}>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#4CAF50" }]} />
          <Text style={styles.legendText}>Present</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#F44336" }]} />
          <Text style={styles.legendText}>Absent</Text>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.dot, { backgroundColor: "#FF9800" }]} />
          <Text style={styles.legendText}>Holiday</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#FFF",
    borderRadius: 20,
    padding: 20,
    elevation: 4,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 15,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  monthText: { fontSize: 16, fontWeight: "bold", color: "#1E293B" },
  toggleContainer: {
    flexDirection: "row",
    backgroundColor: "#F1F5F9",
    borderRadius: 8,
    padding: 2,
  },
  toggleBtn: { paddingVertical: 4, paddingHorizontal: 10, borderRadius: 6 },
  activeToggle: { backgroundColor: "#FFF" },
  toggleLabel: { fontSize: 11, color: "#64748B" },
  activeLabel: { color: "#000", fontWeight: "bold" },
  daysRow: { flexDirection: "row", justifyContent: "space-between" },
  dayWrapper: { alignItems: "center" },
  dayCard: {
    alignItems: "center",
    padding: 8,
    borderRadius: 12,
    backgroundColor: "#F8FAFC",
    width: 42,
  },
  todayCard: { backgroundColor: "#1E293B" },
  dayName: { fontSize: 10, color: "#64748B" },
  dayDate: { fontSize: 14, fontWeight: "bold" },
  statusDot: { width: 5, height: 5, borderRadius: 3, marginTop: 6 },
  gridDays: { flexDirection: "row", flexWrap: "wrap" },
  gridCell: { width: "14.28%", alignItems: "center", marginBottom: 12 },
  dateCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  todayCircle: { backgroundColor: "#1E293B" },
  gridDateText: { fontSize: 12, color: "#333" },
  legend: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: "#F1F5F9",
    paddingTop: 15,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 10,
  },
  dot: { width: 10, height: 10, borderRadius: 5, marginRight: 5 },
  legendText: { fontSize: 12, color: "#64748B" },
});

export default AttendanceCalendar;
