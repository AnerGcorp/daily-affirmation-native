import React, { useState, useMemo, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Sparkles, User, Mail, Lock, Eye, EyeOff } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import { useAuth } from '../context/AuthContext';
import type { ColorScheme } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    flex: { flex: 1 },
    container: { flex: 1, backgroundColor: c.background },
    scroll: { flexGrow: 1 },

    // ── Hero ──
    heroContainer: {
      height: 260,
      justifyContent: 'flex-end',
      alignItems: 'center',
      paddingBottom: 28,
    },
    heroImage: {
      ...StyleSheet.absoluteFillObject,
      width: '100%',
      height: '100%',
    },
    heroGradient: {
      ...StyleSheet.absoluteFillObject,
    },
    logoCircle: {
      width: 64,
      height: 64,
      borderRadius: 32,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 16,
    },
    heroTitle: {
      fontSize: 32,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    heroSubtitle: {
      fontSize: 16,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 8,
    },

    // ── Form ──
    formContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 28,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      paddingHorizontal: 16,
      marginBottom: 16,
      height: 56,
    },
    inputIcon: {
      marginRight: 12,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: c.foreground,
    },
    eyeBtn: {
      padding: 4,
    },

    signUpBtn: {
      height: 56,
      borderRadius: 16,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    signUpBtnDisabled: {
      opacity: 0.6,
    },
    signUpBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primaryForeground,
      letterSpacing: 0.5,
    },

    successBox: {
      backgroundColor: '#10B98115',
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: '#10B98130',
    },
    successText: {
      fontSize: 14,
      color: '#059669',
      textAlign: 'center',
    },

    errorBox: {
      backgroundColor: `${c.destructive}15`,
      borderRadius: 12,
      padding: 14,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: `${c.destructive}30`,
    },
    errorText: {
      fontSize: 14,
      color: c.destructive,
      textAlign: 'center',
    },

    // ── Footer ──
    footer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      paddingVertical: 24,
    },
    footerText: {
      fontSize: 14,
      color: c.mutedForeground,
    },
    footerLink: {
      fontSize: 14,
      fontWeight: '700',
      color: c.primary,
      marginLeft: 6,
    },
  });
}

export default function SignUpScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { signUp } = useAuth();

  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleSignUp = async () => {
    if (!displayName.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await signUp(email.trim(), password, displayName.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSuccess(true);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          bounces={false}
        >
          {/* ── Hero ── */}
          <Animated.View style={[styles.heroContainer, { opacity: fadeAnim }]}>
            <Image
              source={{
                uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=900&q=80',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(139,92,246,0.85)', 'rgba(52,120,246,0.90)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <View style={[{ paddingTop: insets.top }]}>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.logoCircle}>
                  <Sparkles size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Create Account</Text>
                <Text style={styles.heroSubtitle}>
                  Start your affirmation journey
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Form ── */}
          <Animated.View
            style={[styles.formContainer, { opacity: fadeAnim }]}
          >
            {error && (
              <View style={styles.errorBox}>
                <Text style={styles.errorText}>{error}</Text>
              </View>
            )}

            {success && (
              <View style={styles.successBox}>
                <Text style={styles.successText}>
                  Account created! Check your email to verify, then sign in.
                </Text>
              </View>
            )}

            {!success && (
              <>
                {/* Name */}
                <View style={styles.inputWrapper}>
                  <User
                    size={20}
                    color={colors.mutedForeground}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Full name"
                    placeholderTextColor={colors.mutedForeground}
                    autoCapitalize="words"
                    textContentType="name"
                    value={displayName}
                    onChangeText={setDisplayName}
                  />
                </View>

                {/* Email */}
                <View style={styles.inputWrapper}>
                  <Mail
                    size={20}
                    color={colors.mutedForeground}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Email address"
                    placeholderTextColor={colors.mutedForeground}
                    autoCapitalize="none"
                    keyboardType="email-address"
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>

                {/* Password */}
                <View style={styles.inputWrapper}>
                  <Lock
                    size={20}
                    color={colors.mutedForeground}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Password (min 6 characters)"
                    placeholderTextColor={colors.mutedForeground}
                    secureTextEntry={!showPassword}
                    textContentType="newPassword"
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity
                    onPress={() => setShowPassword((v) => !v)}
                    style={styles.eyeBtn}
                  >
                    {showPassword ? (
                      <EyeOff size={20} color={colors.mutedForeground} />
                    ) : (
                      <Eye size={20} color={colors.mutedForeground} />
                    )}
                  </TouchableOpacity>
                </View>

                {/* Sign Up Button */}
                <TouchableOpacity
                  onPress={handleSignUp}
                  disabled={loading}
                  style={[
                    styles.signUpBtn,
                    loading && styles.signUpBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.primaryForeground} />
                  ) : (
                    <Text style={styles.signUpBtnText}>Create Account</Text>
                  )}
                </TouchableOpacity>
              </>
            )}

            {/* Footer */}
            <View style={[styles.footer, { paddingBottom: insets.bottom + 8 }]}>
              <Text style={styles.footerText}>Already have an account?</Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('Login')}
              >
                <Text style={styles.footerLink}>Sign In</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
