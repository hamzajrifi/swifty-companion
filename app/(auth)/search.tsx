import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { useSearchStore } from "../../stores/searchStore";
import { api } from "../../api/api";

export default function SearchPage() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const { searchQuery} = useSearchStore();
  
  useEffect(() => {
    if (searchQuery) {
      handleSearch();
    }
  }, [searchQuery]);

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();

      if (searchQuery.includes("@")) {
        params.append("filter[email]", searchQuery);
      }
      else if (searchQuery.includes(" ")) {
        const [firstName, lastName] = searchQuery.split(" ");
        params.append("filter[first_name]", firstName);
        params.append("filter[last_name]", lastName);
      }
      else {
        params.append("filter[login]", searchQuery);
      }
      const response = await api.get(`/users?${params.toString()}`);
      setSearchResults(response.data);
    } catch (err) {
      setError("Failed to search users. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.userItem}
      onPress={() => {
        router.push(`/profile/${item.id}`);
      }}
      activeOpacity={0.7}
    >
      <Image
        source={{ uri: item.image?.link || "https://via.placeholder.com/50" }}
        style={styles.avatar}
      />
      <View style={styles.userInfo}>
        <Text style={styles.userName}>{item.displayname}</Text>
        <Text style={styles.userLogin}>{item.login}</Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#667eea" />
    </TouchableOpacity>
  );

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      {isLoading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#667eea" />
        </View>
      ) : error ? (
        <View style={styles.centerContainer}>
          <Text style={styles.errorText}>{error}</Text>
        </View>
      ) : (
        <FlatList
          data={searchResults}
          renderItem={renderUserItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            searchQuery ? (
              <View style={styles.centerContainer}>
                <Text style={styles.emptyText}>No users found</Text>
              </View>
            ) : (
              <View style={styles.centerContainer}>
                <Ionicons name="search" size={48} color="#9ca3af" />
                <Text style={styles.emptyText}>Search for developers</Text>
              </View>
            )
          }
        />
      )}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 24,
    paddingTop: 32,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#667eea",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#f3f4f6",
  },
  userInfo: {
    flex: 1,
    marginLeft: 16,
  },
  userName: {
    color: "#1f2937",
    fontSize: 16,
    fontWeight: "600",
  },
  userLogin: {
    color: "#6b7280",
    fontSize: 14,
    marginTop: 2,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  errorText: {
    color: "#ef4444",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "500",
  },
  emptyText: {
    color: "#9ca3af",
    fontSize: 16,
    textAlign: "center",
    marginTop: 12,
    fontWeight: "500",
  },
});
