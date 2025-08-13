import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  Modal,
  TouchableOpacity,
} from "react-native";
import {
  Ionicons,
  MaterialCommunityIcons,
  FontAwesome5,
} from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";
import ProjectListCard from "../../components/ProjectListCard";
import ProjectListItem from "../../components/ProjectListItem";
import { useAuthStore } from "../../stores/authStore";


export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: '#374151', fontSize: 18 }}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 32 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.avatarContainer}
            onPress={() => setModalVisible(true)}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#667eea', '#764ba2']}
              style={styles.avatarGradient}
            >
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
            </LinearGradient>
            <View style={styles.statusBadge}>
              <View style={styles.statusDot} />
              <Text style={styles.statusText}>{user.login}</Text>
            </View>
          </TouchableOpacity>
          <Text style={styles.name}>{user.name}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.centered}>
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Wallet</Text>
              <Text style={styles.statValue}>₳ {user.currency}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Experience</Text>
              <Text style={styles.statValue}>{user.evp}</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statLabel}>Score</Text>
              <Text style={styles.statValue}>{user.score}</Text>
            </View>
          </View>

          {/* Progress Section */}
          <View style={styles.progressBlock}>
            <View style={styles.progressHeader}>
              <Text style={styles.level}>Level {user.level}</Text>
              <Text style={styles.progressText}>
                {Math.round(user.progress)}% Complete
              </Text>
            </View>
            <View style={styles.progressBarContainer}>
              <LinearGradient
                colors={['#667eea', '#764ba2']}
                style={[styles.progressFill, { width: `${user.progress}%` }]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              />
            </View>
          </View>

          {/* Projects Section */}
          {user.projects && user.projects.length > 0 && (
            <View style={styles.projectsSection}>
              <ProjectListCard>
                <View style={styles.projectsHeaderRow}>
                  <Text style={styles.sectionTitle}>Recent Projects</Text>
                  <TouchableOpacity
                    style={styles.viewAllButton}
                    onPress={() => router.push("/projects")}
                  >
                    <Text style={styles.viewAllText}>View all</Text>
                    <Ionicons name="arrow-forward" size={16} color="#667eea" />
                  </TouchableOpacity>
                </View>
                {(() => {
                  const sortedProjects = [...user.projects].sort((a, b) => {
                    if (a.status === 'in_progress' && b.status !== 'in_progress') return 1;
                    if (a.status !== 'in_progress' && b.status === 'in_progress') return -1;
                    return 0;
                  });
                  return sortedProjects.slice(0, 5).map((project, idx, arr) => (
                    project.status !== 'in_progress' ? (
                      <ProjectListItem
                        key={project.id}
                        title={project.name}
                        duration={project.createdAt ? new Date(project.createdAt).toLocaleDateString() : ''}
                        percent={project.finalMark ?? 0}
                        isValidated={project.validated}
                        isLast={idx === Math.min(4, sortedProjects.length - 1)}
                      />
                    ) : 
                    (
                      <View key={project.id} style={{ paddingVertical: 20 }}>
                        <Text style={styles.projectName}>{project.name}</Text>
                        {project.status === 'in_progress' && (
                          <View style={styles.inProgressContainer}>
                            <View style={styles.inProgressDot} />
                            <Text style={styles.inProgressText}>In progress</Text>
                          </View>
                        )}
                        {idx !== Math.min(4, sortedProjects.length - 1) && <View style={{ height: 1, backgroundColor: 'rgba(102, 126, 234, 0.1)' }} />}
                      </View>
                    )
                  ));
                })()}
              </ProjectListCard>
            </View>
          )}

          {/* Skills Section */}
          {user.skills && user.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <ProjectListCard>
                <Text style={styles.sectionTitle}>Skills</Text>
                {user.skills.map((skill) => (
                  <View key={skill.id} style={styles.skillRow}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.skillName}>{skill.name}</Text>
                      <View style={styles.skillBarContainer}>
                        <LinearGradient
                          colors={['#667eea', '#764ba2']}
                          style={[styles.skillBarFill, { width: `${skill.percent}%` }]}
                          start={{ x: 0, y: 0 }}
                          end={{ x: 1, y: 0 }}
                        />
                      </View>
                    </View>
                    <View style={styles.skillInfo}>
                      <Text style={styles.skillLevel}>Lvl {Math.floor(skill.level)}</Text>
                      <Text style={styles.skillPercent}>{skill.percent}%</Text>
                    </View>
                  </View>
                ))}
              </ProjectListCard>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Profile Modal */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Ionicons name="close" size={24} color="#374151" />
            </TouchableOpacity>
            <Text style={styles.modalTitle}>Profile Information</Text>
            <View style={styles.infoBlock}>
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={18} color="#667eea" />
                <Text style={styles.infoText}>{user.location}</Text>
              </View>
              <View style={styles.infoRow}>
                <MaterialCommunityIcons
                  name="email-outline"
                  size={18}
                  color="#667eea"
                />
                <Text style={styles.infoText}>{user.email}</Text>
              </View>
              <View style={styles.infoRow}>
                <FontAwesome5 name="calendar-alt" size={16} color="#667eea" />
                <Text style={styles.infoText}>{user.date}</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: "center",
    paddingTop: 40,
    marginBottom: 24,
  },
  avatarContainer: {
    alignItems: "center",
    marginBottom: 16,
  },
  avatarGradient: {
    width: 120,
    height: 120,
    borderRadius: 60,
    padding: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    width: 112,
    height: 112,
    borderRadius: 56,
    backgroundColor: "#fff",
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginTop: -20,
    alignSelf: "center",
    shadowColor: "#667eea",
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#10b981",
    marginRight: 6,
  },
  statusText: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 12,
  },
  centered: {
    alignItems: "center",
    paddingHorizontal: 24,
  },
  name: {
    color: "#1f2937",
    fontSize: 28,
    fontWeight: "700",
    marginTop: 8,
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    marginBottom: 32,
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    shadowColor: "#667eea",
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.1)',
  },
  statLabel: {
    color: "#6b7280",
    fontSize: 12,
    fontWeight: "500",
    marginBottom: 4,
  },
  statValue: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 18,
  },
  progressBlock: {
    width: "100%",
    marginBottom: 32,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  level: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 18,
  },
  progressText: {
    color: "#6b7280",
    fontWeight: "500",
    fontSize: 14,
  },
  progressBarContainer: {
    width: "100%",
    height: 8,
    backgroundColor: "#e5e7eb",
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    borderRadius: 4,
  },
  projectsSection: {
    marginTop: 24,
    width: "100%",
  },
  projectsHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  sectionTitle: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 20,
  },
  viewAllButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  viewAllText: {
    color: "#667eea",
    fontWeight: "600",
    fontSize: 14,
  },
  projectName: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 16,
    marginBottom: 4,
  },
  inProgressContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  inProgressDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#f59e0b",
  },
  inProgressText: {
    color: "#f59e0b",
    fontSize: 12,
    fontWeight: "500",
  },
  skillsSection: {
    marginTop: 24,
    width: "100%",
  },
  skillRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  skillName: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 14,
    marginBottom: 8,
  },
  skillBarContainer: {
    width: "100%",
    height: 6,
    backgroundColor: "#e5e7eb",
    borderRadius: 3,
    overflow: "hidden",
  },
  skillBarFill: {
    height: "100%",
    borderRadius: 3,
  },
  skillInfo: {
    alignItems: "flex-end",
    marginLeft: 16,
    minWidth: 60,
  },
  skillLevel: {
    color: "#374151",
    fontWeight: "600",
    fontSize: 12,
  },
  skillPercent: {
    color: "#667eea",
    fontWeight: "700",
    fontSize: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 20,
    padding: 24,
    width: "85%",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 10,
  },
  closeButton: {
    position: "absolute",
    top: 16,
    right: 16,
    zIndex: 1,
    padding: 4,
  },
  modalTitle: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 20,
    marginBottom: 20,
    marginTop: 8,
  },
  infoBlock: {
    width: "100%",
    gap: 12,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 8,
  },
  infoText: {
    color: "#6b7280",
    fontSize: 16,
    flex: 1,
  },
});
