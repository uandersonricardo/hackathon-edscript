import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

import { Colors } from "../../constants/theme";
import { useAuth } from "../../contexts/AuthContext";

export default function Profile() {
  const { logout } = useAuth();

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Perfil</Text>
      <TouchableOpacity onPress={logout}>
        <Text style={styles.text}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: Colors.dark.background },
  text: { color: Colors.dark.text, fontSize: 20, fontWeight: "600" },
});
