import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

interface NoInternetScreenProps {
  onRetry: () => void;
}

export function NoInternetScreen({ onRetry }: NoInternetScreenProps) {
  const { width } = Dimensions.get('window');
  
  const [pulseAnim] = React.useState(new Animated.Value(1));
  
  React.useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: true,
        }),
      ])
    ).start();
  }, []);
  
  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />
      
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="wifi-outline" size={80} color="#FFF" />
        </View>
        
        <Text style={styles.title}>No Internet Connection</Text>
        
        <Text style={styles.message}>
          Please check your connection and try again. You need an internet connection to use this app.
        </Text>
        
        <Animated.View 
          style={[
            styles.waveContainer, 
            { 
              width: width * 2,
              transform: [{ scale: pulseAnim }]
            }
          ]}
        >
          <View style={styles.wave} />
          <View style={[styles.wave, styles.wave2]} />
          <View style={[styles.wave, styles.wave3]} />
        </Animated.View>
        
        <TouchableOpacity 
          style={styles.button} 
          onPress={onRetry}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#ff6b6b', '#ee5a24']}
            style={styles.buttonGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            <Ionicons name="refresh" size={20} color="#FFF" style={styles.buttonIcon} />
            <Text style={styles.buttonText}>Retry Connection</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 32,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 50,
    padding: 20,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#FFF',
    marginBottom: 16,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  message: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 48,
    lineHeight: 24,
    maxWidth: 320,
  },
  button: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  buttonIcon: {
    marginRight: 8,
  },
  waveContainer: {
    position: 'absolute',
    height: 200,
    bottom: -100,
    left: -100,
    zIndex: 1,
    opacity: 0.1,
    justifyContent: 'center',
  },
  wave: {
    position: 'absolute',
    width: '100%',
    height: '33%',
    backgroundColor: '#FFF',
    borderRadius: 1000,
    opacity: 0.5,
  },
  wave2: {
    height: '66%',
    opacity: 0.3,
  },
  wave3: {
    height: '100%',
    opacity: 0.1,
  },
}); 