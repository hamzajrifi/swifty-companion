import React from 'react';
import { View, StyleSheet } from 'react-native';
import { BlurView } from 'expo-blur';

export default function ProjectListCard({ children }: { children: React.ReactNode }) {
  return (
    <BlurView intensity={15} style={styles.card} tint="light">
      {children}
    </BlurView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 24,
    borderWidth: 1,
    borderColor: 'rgba(102, 126, 234, 0.2)',
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#667eea',
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
    width: 'auto',
  },
}); 