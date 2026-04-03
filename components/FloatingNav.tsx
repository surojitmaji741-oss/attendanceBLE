import { useRouter, usePathname, Href } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useRef, useEffect } from "react";
import { Animated, TouchableOpacity, View, StyleSheet } from "react-native";

export default function FloatingNav() {
  const router = useRouter();
  const pathname = usePathname();
  const scaleValue = useRef(new Animated.Value(1)).current;

  // Trigger animation whenever the path changes
  useEffect(() => {
    scaleValue.setValue(1);
    Animated.spring(scaleValue, {
      toValue: 1.2,
      friction: 4,
      useNativeDriver: true,
    }).start(() => {
      Animated.spring(scaleValue, {
        toValue: 1,
        useNativeDriver: true,
      }).start();
    });
  }, [pathname]); // Runs every time you switch pages

  const navigateTo = (path: Href) => {
    if (pathname !== path) {
      router.replace(path);
    }
  };
  const handleNavigate = (path: Href) => {
    if (pathname !== path) {
      // Reset and play pop animation
      scaleValue.setValue(1);
      Animated.spring(scaleValue, {
        toValue: 1.2,
        friction: 4,
        useNativeDriver: true,
      }).start(() => {
        Animated.spring(scaleValue, {
          toValue: 1,
          useNativeDriver: true,
        }).start();
      });

      navigateTo(path);
    }
  };

  return (
    <View style={styles.tabWrapper}>
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={pathname === "/" ? styles.activeTabIcon : styles.tabIcon}
          onPress={() => handleNavigate("/")}
        >
          <Animated.View
            style={
              pathname === "/" ? { transform: [{ scale: scaleValue }] } : null
            }
          >
            <Ionicons
              name={pathname === "/" ? "home" : "home-outline"}
              size={24}
              color={pathname === "/" ? "#FFF" : "#666"}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            pathname === "/profile" ? styles.activeTabIcon : styles.tabIcon
          }
          onPress={() => handleNavigate("/profile")}
        >
          <Animated.View
            style={
              pathname === "/profile"
                ? { transform: [{ scale: scaleValue }] }
                : null
            }
          >
            {pathname === "/profile" ? (
              <MaterialCommunityIcons name="handshake" size={24} color="#FFF" />
            ) : (
              <MaterialCommunityIcons
                name="handshake-outline"
                size={24}
                color="#666"
              />
            )}
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            pathname === "/profile" ? styles.activeTabIcon : styles.tabIcon
          }
          onPress={() => handleNavigate("/profile")}
        >
          <Animated.View
            style={
              pathname === "/" ? { transform: [{ scale: scaleValue }] } : null
            }
          >
            <Ionicons
              name={pathname === "/profile" ? "person" : "person-outline"}
              size={24}
              color={pathname === "/profile" ? "#FFF" : "#666"}
            />
          </Animated.View>
        </TouchableOpacity>

        <TouchableOpacity
          style={
            pathname === "/payment" ? styles.activeTabIcon : styles.tabIcon
          }
          onPress={() => handleNavigate("/payment")}
        >
          <Animated.View
            style={
              pathname === "/payment"
                ? { transform: [{ scale: scaleValue }] }
                : null
            }
          >
            <Ionicons
              name={pathname === "/payment" ? "cash" : "cash-outline"}
              size={24}
              color={pathname === "/payment" ? "#FFF" : "#666"}
            />
          </Animated.View>
        </TouchableOpacity>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
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
