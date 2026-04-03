import React from "react";
import { View, Text, StyleSheet, FlatList, SafeAreaView } from "react-native";
import FloatingNav from "../components/FloatingNav";

const paymentData = [
  {
    id: "1",
    title: "Tuition Fee",
    date: "March 20, 2026",
    amount: "₹35000",
    status: "Paid",
  },
  {
    id: "2",
    title: "Library Fine",
    date: "March 15, 2026",
    amount: "₹400",
    status: "Pending",
  },
  {
    id: "3",
    title: "Exam Fee",
    date: "March 01, 2026",
    amount: "₹1000",
    status: "Paid",
  },
];

export default function PaymentScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Payment History</Text>
      <FlatList
        data={paymentData}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.paymentCard}>
            <View>
              <Text style={styles.paymentTitle}>{item.title}</Text>
              <Text style={styles.paymentDate}>{item.date}</Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={styles.amountText}>{item.amount}</Text>
              <Text
                style={[
                  styles.statusText,
                  { color: item.status === "Paid" ? "#4CAF50" : "#F44336" },
                ]}
              >
                {item.status}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F8F9FB", padding: 20 },
  headerTitle: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 40,
  },
  paymentCard: {
    backgroundColor: "#FFF",
    padding: 16,
    borderRadius: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
    elevation: 2, // Android Shadow
    shadowColor: "#000", // iOS Shadow
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  paymentTitle: { fontSize: 16, fontWeight: "600", color: "#333" },
  paymentDate: { fontSize: 12, color: "#999", marginTop: 4 },
  amountText: { fontSize: 16, fontWeight: "bold", color: "#1B4D3E" },
  statusText: { fontSize: 12, fontWeight: "bold", marginTop: 4 },
});
