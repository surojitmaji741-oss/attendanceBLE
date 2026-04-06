import React, { useState, useEffect, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Platform,
  ActivityIndicator,
  Modal,
  LayoutAnimation,
  Animated,
} from "react-native";

// EXPO SDK Modules
import * as Device from "expo-device";
import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";
import { LinearGradient } from "expo-linear-gradient";

// Native Module (Requires Development Build)
import BLEAdvertiser from "react-native-ble-advertiser";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { Href, usePathname, useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AttendanceCalendar from "./weeklymonthly";
import FloatingNav from "../../components/FloatingNav";

const StudentApp = () => {
  const router = useRouter();
  const [isAdvertising, setIsAdvertising] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deviceId, setDeviceId] = useState<string | null>(null);

  const [studentData] = useState({
    name: "Surajit Maji",
    roll: "002-BCS-2024-307",
    streak: 12,
    points: 1250,
  });
  // for check in
  const [modalVisible, setModalVisible] = useState(false);
  const [points, setPoints] = useState(1250);
  useEffect(() => {
    checkDailyLogin();
  }, []);
  const checkDailyLogin = async () => {
    const lastDate = await AsyncStorage.getItem("last_login");
    const today = new Date().toDateString();

    if (lastDate !== today) {
      // New day, trigger check-in
      setModalVisible(true);
      await AsyncStorage.setItem("last_login", today);
      setPoints((prev) => prev + 10); // Reward 10 coins
    }
  };
  // 1. LIFECYCLE: Fetch the ID as soon as the app opens
  useEffect(() => {
    const initializeId = async () => {
      const id = await fetchPersistentID();
      setDeviceId(id);
    };
    initializeId();
  }, []);

  // 2. LOGIC: How we get a unique, permanent ID
  const fetchPersistentID = async () => {
    try {
      if (Platform.OS === "android") {
        // return Application.androidId; // Unique to device + app signing key
        // Call it as a function and await it
        return await Application.getAndroidId();
      } else {
        let iosId = await SecureStore.getItemAsync("device_id");
        if (!iosId) {
          iosId = await Application.getIosIdForVendorAsync();
          if (iosId) await SecureStore.setItemAsync("device_id", iosId);
        }
        return iosId;
      }
    } catch (e) {
      console.error("ID Fetch Error", e);
      return null;
    }
  };
  if (Platform.OS === "android") {
    if (
      require("react-native").UIManager.setLayoutAnimationEnabledExperimental
    ) {
      require("react-native").UIManager.setLayoutAnimationEnabledExperimental(
        true,
      );
    }
  }
  const [selectedDept, setSelectedDept] = useState("Select Department");
  const [selectedRoom, setSelectedRoom] = useState("Select Room");
  const [isDeptOpen, setIsDeptOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);

  const departments = ["Computer Science", "Mechanical", "Electrical"];
  const rooms = ["Lab 1", "Lab 2", "Seminar Hall"];
  const toggleDropdown = (type: "dept" | "room") => {
    // This line triggers the smooth transition for the next render
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);

    if (type === "dept") {
      setIsDeptOpen(!isDeptOpen);
      setIsRoomOpen(false); // Close room if dept is clicked
    } else {
      setIsRoomOpen(!isRoomOpen);
      setIsDeptOpen(false); // Close dept if room is clicked
    }
  };
  // 3. ACTION: Starting the Bluetooth Signal
  const toggleAttendance = async () => {
    if (!Device.isDevice) {
      Alert.alert(
        "Hardware Error",
        "Bluetooth advertising requires a physical device.",
      );
      return;
    }

    setLoading(true);
    try {
      if (!isAdvertising) {
        const major = selectedDept || 1;
        const minor = selectedRoom || 0;
        // Prepare the payload (The UUID is the "Passport" for the teacher's scanner)
        const shortId = deviceId ? deviceId.substring(0, 12) : "000000000000";
        const attendanceUUID = `44919323-225c-433b-8211-${shortId}`;

        // Bluetooth settings
        BLEAdvertiser.setCompanyId(0x004c); // Identifying as an Apple-standard frame for compatibility
        await BLEAdvertiser.broadcast(attendanceUUID, [major, minor, 0], {});

        setIsAdvertising(true);
      } else {
        await BLEAdvertiser.stopBroadcast();
        setIsAdvertising(false);
      }
    } catch (error) {
      console.error(error);
      Alert.alert(
        "Bluetooth Error",
        "Turn on Bluetooth and Location to start.",
      );
    } finally {
      setLoading(false);
    }
  };
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 18) return "Good afternoon";
    return "Good evening";
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Modal visible={modalVisible} transparent={true} animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Daily Reward!</Text>
              <Text>You earned +10 coins for checking in today.</Text>
              <TouchableOpacity
                style={styles.modalButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={{ color: "#FFF" }}>Collect</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
        <View style={styles.header}>
          <View
            style={{
              flexDirection: "row",
              // justifyContent: "space-between",
              gap: 15,
              alignItems: "center",
            }}
          >
            <TouchableOpacity onPress={() => router.push("/profile")}>
              <Ionicons
                name="person-circle-outline"
                size={65}
                color="#3a7bd5"
              />
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text style={styles.greetingText}>{getGreeting()}, 👋</Text>
              <Text style={styles.nameText}>{studentData.name}</Text>
            </View>
            <TouchableOpacity
              onPress={() => router.push("/profile")}
              style={styles.coinBadge}
            >
              <Text style={styles.coinText}>{points}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.notificationCircle}>
              <Ionicons name="notifications-outline" size={20} color="#333" />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.actionSection}>
          {!(
            selectedDept !== "Select Department" &&
            selectedRoom !== "Select Room"
          ) ? (
            <>
              <View style={styles.attendanceContainer}>
                <Text style={styles.confirmationText}>
                  Please select your department and room to mark attendance.
                </Text>
                {/* DEPARTMENT DROPDOWN */}
                <View style={styles.dropdownWrapper}>
                  <Text style={styles.label}>Department</Text>
                  <TouchableOpacity
                    style={styles.dropdownHeader}
                    onPress={() => toggleDropdown("dept")}
                  >
                    <Text style={styles.dropdownHeaderText}>
                      {selectedDept}
                    </Text>
                    <Ionicons
                      name={isDeptOpen ? "chevron-up" : "chevron-down"}
                      size={20}
                      color="#666"
                    />
                  </TouchableOpacity>

                  {isDeptOpen && (
                    <View style={styles.dropdownList}>
                      {departments.map((item) => (
                        <TouchableOpacity
                          key={item}
                          style={styles.dropdownItem}
                          onPress={() => {
                            LayoutAnimation.configureNext(
                              LayoutAnimation.Presets.easeInEaseOut,
                            );
                            setSelectedDept(item);
                            setIsDeptOpen(false);
                          }}
                        >
                          <Text style={styles.itemText}>{item}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}
                </View>

                {/* ROOM DROPDOWN (Only shows if Dept is selected) */}
                {selectedDept !== "Select Department" && (
                  <View style={styles.dropdownWrapper}>
                    <Text style={styles.label}>Room</Text>
                    <TouchableOpacity
                      style={styles.dropdownHeader}
                      onPress={() => toggleDropdown("room")}
                    >
                      <Text style={styles.dropdownHeaderText}>
                        {selectedRoom}
                      </Text>
                      <Ionicons
                        name={isRoomOpen ? "chevron-up" : "chevron-down"}
                        size={20}
                        color="#666"
                      />
                    </TouchableOpacity>

                    {isRoomOpen && (
                      <View style={styles.dropdownList}>
                        {rooms.map((item) => (
                          <TouchableOpacity
                            key={item}
                            style={styles.dropdownItem}
                            onPress={() => {
                              LayoutAnimation.configureNext(
                                LayoutAnimation.Presets.easeInEaseOut,
                              );
                              setSelectedRoom(item);
                              setIsRoomOpen(false);
                            }}
                          >
                            <Text style={styles.itemText}>{item}</Text>
                          </TouchableOpacity>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </>
          ) : (
            <View style={styles.attendanceContainer}>
              <Text style={styles.confirmationText}>
                Ready for {selectedDept} - {selectedRoom}
              </Text>
              <TouchableOpacity
                onPress={toggleAttendance}
                disabled={loading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={
                    isAdvertising
                      ? ["#FF4B2B", "#FF416C"]
                      : ["#00d2ff", "#3a7bd5"]
                  }
                  style={styles.mainButton}
                >
                  {loading ? (
                    <ActivityIndicator color="#FFF" />
                  ) : (
                    <Text style={styles.buttonText}>
                      {isAdvertising ? "Stop Broadcasting" : "Mark Attendance"}
                    </Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <Text style={styles.statusNote}>
                {isAdvertising
                  ? "📡 Signal active. Stay near the teacher."
                  : "Ready to scan for teacher's device."}
              </Text>
              <Text style={styles.idValue}>
                Verified Device ID: {deviceId || "Detecting..."}
              </Text>
            </View>
          )}
        </View>
        {/* --- RECORD ATTENDANCE SECTION --- */}
        <AttendanceCalendar />
        {/* --- MANAGEMENT SECTION --- */}
        <View style={styles.managementSection}>
          {/* Header Row */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Management</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>

          {/* Horizontal Cards */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cardsContainer}
          >
            {/* Calendar Card */}
            <TouchableOpacity style={styles.managementCard}>
              <View style={styles.iconArrowRow}>
                <View style={styles.iconCircle}>
                  <Ionicons name="calendar" size={24} color="#A78BFA" />
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="arrow-up-outline"
                    size={14}
                    color="#333"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              </View>
              <Text style={styles.cardLabel}>Calendar</Text>
            </TouchableOpacity>

            {/* Rewards Card */}
            <TouchableOpacity style={styles.managementCard}>
              <View style={styles.iconArrowRow}>
                <View
                  style={[styles.iconCircle, { backgroundColor: "#E0F2FE" }]}
                >
                  <Ionicons name="medal" size={24} color="#38BDF8" />
                </View>
                <View style={styles.arrowCircle}>
                  <Ionicons
                    name="arrow-up-outline"
                    size={14}
                    color="#333"
                    style={{ transform: [{ rotate: "45deg" }] }}
                  />
                </View>
              </View>
              <Text style={styles.cardLabel}>Rewards</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
        {/* Leaderboard Preview */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Leaderboard</Text>
          <View style={styles.leaderboardItem}>
            <Text style={styles.rank}>1.</Text>
            <Text style={styles.leaderName}>Sarah Miller</Text>
            <Text style={styles.leaderPoints}>1500 </Text>
          </View>
          <View style={[styles.leaderboardItem, styles.highlightRank]}>
            <Text style={styles.rank}>4.</Text>
            <Text style={styles.leaderName}>You (Alex)</Text>
            <Text style={styles.leaderPoints}>{points}</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f0f2f5" },
  scrollContent: { padding: 25 },
  header: { marginBottom: 40, marginTop: 20 },
  welcomeText: { fontSize: 16, color: "#666" },
  greetingText: { fontSize: 16, color: "#666", fontWeight: "800" },
  nameText: { fontSize: 24, fontWeight: "600", color: "#1a1a1a" },
  notificationCircle: {
    padding: 10,
    backgroundColor: "#FFF",
    borderRadius: 20,
    elevation: 2,
  },
  rollText: { fontSize: 16, color: "#3a7bd5", fontWeight: "bold" },
  actionSection: { alignItems: "center", marginVertical: 20 },
  dropdownWrapper: {
    width: "90%",
    marginBottom: 15,
    zIndex: 10, // Ensures list overlaps other elements
  },
  label: {
    fontSize: 12,
    color: "#888",
    marginBottom: 5,
    marginLeft: 5,
  },
  dropdownHeader: {
    backgroundColor: "#FFF",
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#DDD",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  dropdownHeaderText: {
    fontSize: 16,
    color: "#333",
  },
  dropdownList: {
    backgroundColor: "#FFF",
    borderWidth: 1,
    borderColor: "#DDD",
    borderRadius: 8,
    marginTop: 5,
    overflow: "hidden",
  },
  dropdownItem: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  itemText: {
    fontSize: 16,
    color: "#555",
  },
  attendanceContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 20,
    padding: 25,
    width: "100%",
    alignItems: "center",
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 5,
  },
  confirmationText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333333",
    textAlign: "center",
    marginBottom: 20,
    lineHeight: 24,
  },
  mainButton: {
    width: 180,
    height: 180,
    borderRadius: 140, // Large circular button
    justifyContent: "center",
    alignItems: "center",
    elevation: 10,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 10,
  },
  buttonText: {
    color: "#FFF",
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
  },
  statusNote: { marginTop: 20, color: "#666", fontStyle: "italic" },
  idCard: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 15,
    marginTop: 40,
  },
  idTitle: { fontSize: 12, color: "#999", textTransform: "uppercase" },
  idValue: {
    fontSize: 14,
    fontFamily: Platform.OS === "ios" ? "Courier" : "monospace",
    color: "#333",
  },
  // { leaderboard style}
  section: {
    backgroundColor: "#FFF",
    borderRadius: 15,
    padding: 15,
    elevation: 2,
  },
  sectionTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 15 },
  leaderboardItem: {
    flexDirection: "row",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#EEE",
  },
  highlightRank: {
    backgroundColor: "#E7F1FF",
    borderRadius: 10,
    paddingHorizontal: 5,
  },
  rank: { width: 30, fontWeight: "bold" },
  leaderName: { flex: 1 },
  leaderPoints: { color: "#28A745", fontWeight: "bold" },
  // for coin badge and modal
  coinBadge: {
    backgroundColor: "#FFD700", // Gold color for coins
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 15,
    marginRight: 10,
    elevation: 3,
  },
  coinText: { fontSize: 12, fontWeight: "bold" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 30,
    borderRadius: 20,
    alignItems: "center",
  },
  modalButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#28A745",
    borderRadius: 10,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFD700", // Gold color
    marginBottom: 10,
  },
  // management section
  managementSection: {
    marginTop: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingRight: 20,
    marginBottom: 10,
  },
  seeAllText: {
    color: "#6366F1",
    fontSize: 14,
  },
  cardsContainer: {
    paddingRight: 20, // Space at the end of scroll
    paddingBottom: 10, // Space for shadows
  },
  managementCard: {
    width: 150,
    height: 140,
    backgroundColor: "#FFFFFF",
    borderRadius: 24,
    padding: 15,
    marginRight: 15,
    justifyContent: "space-between",
    // Shadow / Elevation
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  iconArrowRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  iconCircle: {
    width: 45,
    height: 45,
    borderRadius: 12,
    backgroundColor: "#F5F3FF",
    justifyContent: "center",
    alignItems: "center",
  },
  arrowCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#F1F5F9",
    justifyContent: "center",
    alignItems: "center",
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E293B",
    marginBottom: 5,
  },
  // Floating Tab Styles
  tabWrapper: {
    position: "absolute",
    bottom: 30,
    width: "100%",
    alignItems: "center",
  },
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFF",
    width: "85%",
    height: 70,
    borderRadius: 35,
    justifyContent: "space-around",
    alignItems: "center",
    elevation: 15,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 15,
  },
  tabIcon: { padding: 10 },
  activeTabIcon: {
    backgroundColor: "#1B4D3E",
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default StudentApp;
