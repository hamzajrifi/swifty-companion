import React, { useState, useEffect } from 'react';
import { Modal, View, StyleSheet, SafeAreaView, TouchableOpacity, Text, ActivityIndicator, Image } from 'react-native';
import { WebView, WebViewNavigation } from 'react-native-webview';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { useNetworkStore } from '../stores/networkStore';

interface OAuthWebViewProps {
  url: string;
  redirectUri: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: (code: string) => void;
}

export function OAuthWebView({ url, redirectUri, visible, onClose, onSuccess }: OAuthWebViewProps) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { setIsConnected } = useNetworkStore();

  useEffect(() => {
    setLoading(true);
    setError(null);
  }, [url]);

  const handleNavigationStateChange = (navState: WebViewNavigation) => {
    const { url } = navState;
    
    if (url.startsWith(redirectUri)) {
      const codeMatch = url.match(/[?&]code=([^&]+)/);
      if (codeMatch && codeMatch[1]) {
        onSuccess(codeMatch[1]);
      }
      onClose();
    }
  };

  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.log('WebView error:', nativeEvent);
    setLoading(false);
    
    if (nativeEvent.description?.includes('net::') || 
        nativeEvent.description?.includes('ERR_CONNECTION_') ||
        nativeEvent.description?.includes('ERR_INTERNET_DISCONNECTED')) {
      setIsConnected(false);
    } else {
      setError('Failed to load authentication page. Please try again.');
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={visible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar style="dark" />
        
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Ionicons name="close" size={24} color="#667eea" />
          </TouchableOpacity>
          <View style={styles.headerCenter}>
            <Image 
              source={require('../assets/images/42_Logo.svg.png')} 
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <Text style={styles.headerTitle}>42 Authentication</Text>
          </View>
          <View style={styles.rightPlaceholder} />
        </View>
        
        {loading && (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#667eea" />
            <Text style={styles.loadingText}>Loading authentication...</Text>
          </View>
        )}

        {error && (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle" size={48} color="#ef4444" />
            <Text style={styles.errorText}>{error}</Text>
            <TouchableOpacity 
              style={styles.retryButton}
              onPress={() => {
                setError(null);
                setLoading(true);
              }}
            >
              <Text style={styles.retryButtonText}>Retry</Text>
            </TouchableOpacity>
          </View>
        )}
        
        <WebView
          source={{ uri: url }}
          incognito={true}
          thirdPartyCookiesEnabled={true}
          sharedCookiesEnabled={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          onNavigationStateChange={handleNavigationStateChange}
          onLoad={() => setLoading(false)}
          onLoadStart={() => setLoading(true)}
          onError={handleError}
          userAgent="Mozilla/5.0 (Linux; Android 10; Pixel 3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Mobile Safari/537.36"
          style={[styles.webView, (loading || error) && styles.hidden]}
        />
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(102, 126, 234, 0.1)',
    backgroundColor: '#f8fafc',
  },
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerLogo: {
    width: 24,
    height: 24,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1f2937',
  },
  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'rgba(102, 126, 234, 0.05)',
  },
  rightPlaceholder: {
    width: 40,
  },
  webView: {
    flex: 1,
  },
  loadingContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    zIndex: 10,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: '#6b7280',
    fontWeight: '500',
  },
  errorContainer: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    zIndex: 10,
    padding: 24,
  },
  errorText: {
    fontSize: 16,
    color: '#ef4444',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 24,
    fontWeight: '500',
  },
  retryButton: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    backgroundColor: '#667eea',
    borderRadius: 12,
  },
  retryButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  hidden: {
    opacity: 0,
  },
}); 