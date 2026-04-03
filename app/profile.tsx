import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Pressable,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
const { width, height } = Dimensions.get("window");
export default function ProfileScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Pressable style={styles.overlay} onPress={() => router.back()} />
      <View pointerEvents="box-none" style={styles.cardWrapper}>
        <Pressable
          style={styles.profileCard}
          onPress={(e) => e.stopPropagation()}
        >
          {/* Back Button */}
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.replace("/")}
          >
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          {/* Avatar Circle */}
          <View style={styles.avatarContainer}>
            <View style={styles.avatarCircle}>
              <Ionicons name="person-outline" size={40} color="white" />
            </View>
          </View>

          {/* User Info */}
          <View style={styles.infoSection}>
            <Text style={styles.userName}>Alex Johnson</Text>
            <Text style={styles.userTitle}>Student | CS-2026-042</Text>
          </View>

          {/* Menu Items */}
          <View style={styles.menuList}>
            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Attendances</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>My Leaves</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Preferences</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuText}>Policy Documents</Text>
            </TouchableOpacity>
          </View>
          {/* </View> */}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f7f9", // Light grayish background
    alignItems: "center",
    paddingTop: 50,
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: width,
    height: height,
    zIndex: 1, // Bottom layer
  },
  backIcon: {
    position: "absolute",
    top: 50,
    left: 20,
    zIndex: 1,
  },
  cardWrapper: {
    flex: 1,
    justifyContent: "center", // Centers vertically
    alignItems: "center", // Centers horizontally
    zIndex: 2,
  },
  profileCard: {
    width: 300,
    height: 600,
    backgroundColor: "#FFF",
    borderRadius: 30,
    paddingVertical: 40,
    paddingHorizontal: 20,
    alignItems: "center",
    // Shadow for Android
    elevation: 15,
    // Shadow for iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
  },
  avatarContainer: {
    marginBottom: 20,
  },
  avatarCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#000", // Black background like the image
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#FFD700", // Gold border
  },
  infoSection: {
    alignItems: "center",
    marginBottom: 40,
  },
  userName: {
    fontSize: 22,
    fontWeight: "800",
    color: "#000",
    marginBottom: 5,
  },
  userTitle: {
    fontSize: 14,
    color: "#A0A0A0",
    fontWeight: "500",
  },
  menuList: {
    width: "100%",
    alignItems: "center",
  },
  menuItem: {
    paddingVertical: 15,
    width: "100%",
    alignItems: "center",
  },
  menuText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
});
