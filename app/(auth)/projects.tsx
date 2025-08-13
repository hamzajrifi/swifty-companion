import React from "react";
import { Text, StyleSheet, ScrollView, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import ProjectListCard from "../../components/ProjectListCard";
import ProjectListItem from "../../components/ProjectListItem";
import { useAuthStore } from "../../stores/authStore";

export default function ProjectsPage() {
  const user = useAuthStore((state) => state.user);
  if (!user || !user.projects) return null;
  return (
    <LinearGradient
      colors={['#f8fafc', '#e2e8f0', '#cbd5e1']}
      style={{ flex: 1 }}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingVertical: 32, paddingHorizontal: 24 }}
        showsVerticalScrollIndicator={false}
      >
        <ProjectListCard>
          <Text style={styles.projectsTitleCard}>All Projects</Text>
          {(() => {
            const sortedProjects = [...user.projects].sort((a, b) => {
              if (a.status === "in_progress" && b.status !== "in_progress")
                return 1;
              if (a.status !== "in_progress" && b.status === "in_progress")
                return -1;
              return 0;
            });
            return sortedProjects.map((project, idx) =>
              project.status !== "in_progress" ? (
                <ProjectListItem
                  key={project.id}
                  title={project.name}
                  duration={
                    project.createdAt
                      ? new Date(project.createdAt).toLocaleDateString()
                      : ""
                  }
                  percent={project.finalMark ?? 0}
                  isValidated={project.validated}
                  isLast={idx === sortedProjects.length - 1}
                />
              ) : (
                <View key={project.id} style={{ paddingVertical: 20 }}>
                  <Text style={styles.projectName}>{project.name}</Text>
                  {project.status === "in_progress" && (
                    <View style={styles.inProgressContainer}>
                      <View style={styles.inProgressDot} />
                      <Text style={styles.inProgressText}>In progress</Text>
                    </View>
                  )}
                  {idx !== sortedProjects.length - 1 && (
                    <View style={{ height: 1, backgroundColor: 'rgba(102, 126, 234, 0.1)' }} />
                  )}
                </View>
              )
            );
          })()}
        </ProjectListCard>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  projectsTitleCard: {
    color: "#1f2937",
    fontWeight: "700",
    fontSize: 24,
    marginBottom: 16,
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
});
