import { useEffect, useState, useRef } from "react";
import {
  View,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { useRouter, useSegments } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useAuthStore } from "../stores/authStore";
import { useSearchStore } from "../stores/searchStore";
import { BlurView } from "expo-blur";

export default function Navbar() {
  const router = useRouter();
  const segments = useSegments();
  const isHome = segments[segments.length - 1] === "home";
  const canGoBack = router.canGoBack();
  const logout = useAuthStore((state) => state.logout);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [isSearching, setIsSearching] = useState(false);
  const [search, setSearch] = useState("");
  const inputRef = useRef<TextInput>(null);
  const setSearchQuery = useSearchStore((state) => state.setSearchQuery);
  const clearSearch = useSearchStore((state) => state.clearSearch);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace("/login");
    }
  }, [isAuthenticated]);

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  const handleSearchSubmit = () => {
    setSearchQuery(search.trim());
    if (search.trim() && segments[segments.length - 1] !== "search") {
      router.push("/search");
    }
    setSearch("");
  };

  if (isSearching) {
    return (
      <BlurView intensity={20} style={styles.container} tint="light">
        <TouchableOpacity
          onPress={() => {
            setIsSearching(false);
            setSearch("");
            clearSearch();
          }}
          style={styles.iconButton}
        >
          <Ionicons name="close" size={24} color="#667eea" />
        </TouchableOpacity>
        <TextInput
          ref={inputRef}
          style={styles.searchInput}
          value={search}
          onChangeText={setSearch}
          placeholder="Search developers..."
          placeholderTextColor="#9ca3af"
          returnKeyType="search"
          onSubmitEditing={handleSearchSubmit}
        />
        <TouchableOpacity
          onPress={handleSearchSubmit}
          style={styles.iconButton}
        >
          <Ionicons name="search" size={22} color="#667eea" />
        </TouchableOpacity>
      </BlurView>
    );
  }

  return (
    <BlurView intensity={20} style={styles.container} tint="light">
      {!isHome && canGoBack && (
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.iconButton}
        >
          <Ionicons name="arrow-back" size={24} color="#667eea" />
        </TouchableOpacity>
      )}
      {!isHome && !canGoBack && (
        <TouchableOpacity
          onPress={() => router.replace("/home")}
          style={styles.iconButton}
        >
          <Ionicons name="home-outline" size={24} color="#667eea" />
        </TouchableOpacity>
      )}
      <View style={{ flex: 1 }} />
      <TouchableOpacity
        onPress={() => setIsSearching(true)}
        style={styles.iconButton}
      >
        <Ionicons name="search" size={22} color="#667eea" />
      </TouchableOpacity>
      <TouchableOpacity onPress={logout} style={styles.iconButton}>
        <Ionicons name="log-out-outline" size={24} color="#ef4444" />
      </TouchableOpacity>
    </BlurView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(102, 126, 234, 0.1)",
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "rgba(102, 126, 234, 0.05)",
  },
  searchInput: {
    flex: 1,
    height: 40,
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 12,
    paddingHorizontal: 16,
    color: "#374151",
    fontSize: 16,
    marginHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(102, 126, 234, 0.2)",
  },
});
