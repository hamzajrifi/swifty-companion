import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import { useRouter } from "expo-router";
import { OAuthWebView } from "../../components/OAuthWebView";
import { StatusBar } from "expo-status-bar";
import { useAuthStore } from "../../stores/authStore";
import { getRefreshToken } from "@/api/api";
import { LinearGradient } from 'expo-linear-gradient';


export default function LoginScreen() {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    error: authError,
    login,
    get42MeProfile,
    authenticateWithCode,
    clearError,
  } = useAuthStore();

  const [webViewVisible, setWebViewVisible] = useState(false);
  const [authUrl, setAuthUrl] = useState("");
  const [redirectUri, setRedirectUri] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const refreshToken = await getRefreshToken();
        if (refreshToken) {
          await get42MeProfile();
        }
      } catch (_) {
        clearError();
      }
    };
    checkAuth();
  }, [get42MeProfile, clearError]);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace("/home");
    }
  }, [isAuthenticated, router]);

  useEffect(() => {
    if (authError) {
      setError(authError);
    }
  }, [authError]);

  const handleLogin = async () => {
    setError(null);

    try {
      const result = await login();
      if (result && result.type === "webview_needed") {
        setAuthUrl(result.authUrl || "");
        setRedirectUri(result.redirectUri || "");
        setWebViewVisible(true);
      }
    } catch (e: any) {
      setError(e.message || "Login failed");
    }
  };

  const handleAuthSuccess = async (code: string) => {
    setError(null);

    try {
      await authenticateWithCode(code);
    } catch (e: any) {
      setError(e.message || "Authentication failed");
    }
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2', '#f093fb']}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <StatusBar style="light" />

      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <View style={styles.logoCircle}>
            <Image 
              source={require('../../assets/images/42_Logo.svg.png')} 
              style={styles.logoImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.title}>Swifty Hub</Text>
          {/* <Text style={styles.subtitle}>Your coding journey, beautifully organized</Text> */}
        </View>

        {error && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleLogin}
            disabled={isLoading}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={['#ff6b6b', '#ee5a24']}
              style={styles.buttonGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {isLoading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.buttonText}>Continue with 42</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Secure authentication powered by 42</Text>
        </View>
      </View>

      {/* WebView for OAuth flow on Android */}
      <OAuthWebView
        url={authUrl}
        redirectUri={redirectUri}
        visible={webViewVisible}
        onClose={() => setWebViewVisible(false)}
        onSuccess={handleAuthSuccess}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 80,
  },
  logoCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
    borderWidth: 2,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoImage: {
    width: 60,
    height: 60,
  },
  title: {
    fontSize: 42,
    fontWeight: "800",
    color: "#ffffff",
    marginBottom: 12,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    textAlign: "center",
    lineHeight: 24,
    maxWidth: 280,
  },
  errorContainer: {
    backgroundColor: "rgba(255, 59, 48, 0.2)",
    padding: 16,
    borderRadius: 12,
    marginBottom: 32,
    borderWidth: 1,
    borderColor: "rgba(255, 59, 48, 0.3)",
  },
  errorText: {
    color: "#ffffff",
    fontSize: 14,
    textAlign: "center",
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 320,
  },
  button: {
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  buttonGradient: {
    paddingVertical: 18,
    paddingHorizontal: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  footer: {
    position: 'absolute',
    bottom: 60,
    alignItems: 'center',
  },
  footerText: {
    color: "rgba(255, 255, 255, 0.6)",
    fontSize: 14,
    textAlign: "center",
  },
});
