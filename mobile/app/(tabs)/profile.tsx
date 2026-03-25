import { StyleSheet, Text, View } from "react-native";

import { Colors } from "../../constants/theme";

export default function Profile() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.dark.background },
  text: { color: Colors.dark.text, fontSize: 20, fontWeight: "600" },
});
