import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProjectListItemProps {
  title: string;
  duration: string;
  percent: number;
  isValidated: boolean;
  isLast?: boolean;
}

export default function ProjectListItem({ title, duration, percent, isValidated, isLast }: ProjectListItemProps) {
  const color = isValidated ? '#10b981' : '#ef4444';
  const icon = isValidated ? 'checkmark-circle' : 'close-circle';

  return (
    <View>
      <View style={styles.row}>
        <View style={{ flex: 1 }}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.duration}>{duration}</Text>
        </View>
        <View style={styles.rightCol}>
          <Ionicons name={icon} size={24} color={color} />
          <Text style={[styles.percent, { color }]}>{percent}</Text>
        </View>
      </View>
      {!isLast && <View style={styles.divider} />}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 20,
    paddingHorizontal: 0,
  },
  title: {
    color: '#374151',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  duration: {
    color: '#9ca3af',
    fontSize: 14,
  },
  rightCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  percent: {
    fontWeight: '700',
    fontSize: 18,
    marginLeft: 4,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(102, 126, 234, 0.1)',
    marginLeft: 0,
  },
}); 