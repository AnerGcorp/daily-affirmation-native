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
import { KeyRound, Mail, ArrowLeft, CheckCircle2 } from 'lucide-react-native';
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
    backBtn: {
      position: 'absolute',
      left: 20,
      width: 44,
      height: 44,
      borderRadius: 22,
      backgroundColor: 'rgba(255,255,255,0.15)',
      alignItems: 'center',
      justifyContent: 'center',
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
      fontSize: 30,
      fontWeight: '800',
      color: '#FFFFFF',
      letterSpacing: 0.5,
    },
    heroSubtitle: {
      fontSize: 15,
      color: 'rgba(255,255,255,0.8)',
      marginTop: 8,
      textAlign: 'center',
      paddingHorizontal: 32,
    },

    // ── Form ──
    formContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 32,
    },
    inputWrapper: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      paddingHorizontal: 16,
      marginBottom: 24,
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

    resetBtn: {
      height: 56,
      borderRadius: 16,
      backgroundColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      shadowColor: c.primary,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 12,
      elevation: 6,
    },
    resetBtnDisabled: {
      opacity: 0.6,
    },
    resetBtnText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primaryForeground,
      letterSpacing: 0.5,
    },

    successContainer: {
      alignItems: 'center',
      paddingTop: 16,
    },
    successCircle: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: '#10B98120',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 20,
    },
    successTitle: {
      fontSize: 22,
      fontWeight: '700',
      color: c.foreground,
      marginBottom: 8,
    },
    successText: {
      fontSize: 15,
      color: c.mutedForeground,
      textAlign: 'center',
      lineHeight: 22,
      paddingHorizontal: 16,
    },
    backToLoginBtn: {
      height: 56,
      borderRadius: 16,
      borderWidth: 1.5,
      borderColor: c.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 32,
    },
    backToLoginText: {
      fontSize: 16,
      fontWeight: '700',
      color: c.primary,
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

export default function ForgotPasswordScreen({ navigation }: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const { resetPassword } = useAuth();

  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  React.useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleReset = async () => {
    if (!email.trim()) {
      setError('Please enter your email address.');
      return;
    }
    setError(null);
    setLoading(true);
    const result = await resetPassword(email.trim());
    setLoading(false);
    if (result.error) {
      setError(result.error);
    } else {
      setSent(true);
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
                uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=900&q=80',
              }}
              style={styles.heroImage}
              resizeMode="cover"
            />
            <LinearGradient
              colors={['rgba(6,182,212,0.85)', 'rgba(52,120,246,0.90)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroGradient}
            />
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={[styles.backBtn, { top: insets.top + 8 }]}
              activeOpacity={0.7}
            >
              <ArrowLeft size={22} color="#FFFFFF" />
            </TouchableOpacity>
            <View style={[{ paddingTop: insets.top }]}>
              <View style={{ alignItems: 'center' }}>
                <View style={styles.logoCircle}>
                  <KeyRound size={32} color="#FFFFFF" />
                </View>
                <Text style={styles.heroTitle}>Reset Password</Text>
                <Text style={styles.heroSubtitle}>
                  Enter your email and we'll send you a link to reset your
                  password
                </Text>
              </View>
            </View>
          </Animated.View>

          {/* ── Form ── */}
          <Animated.View
            style={[styles.formContainer, { opacity: fadeAnim }]}
          >
            {sent ? (
              <View style={styles.successContainer}>
                <View style={styles.successCircle}>
                  <CheckCircle2 size={40} color="#059669" />
                </View>
                <Text style={styles.successTitle}>Email Sent!</Text>
                <Text style={styles.successText}>
                  We've sent a password reset link to{'\n'}
                  {email}. Check your inbox.
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Login')}
                  style={styles.backToLoginBtn}
                  activeOpacity={0.8}
                >
                  <Text style={styles.backToLoginText}>Back to Sign In</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <>
                {error && (
                  <View style={styles.errorBox}>
                    <Text style={styles.errorText}>{error}</Text>
                  </View>
                )}

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

                <TouchableOpacity
                  onPress={handleReset}
                  disabled={loading}
                  style={[
                    styles.resetBtn,
                    loading && styles.resetBtnDisabled,
                  ]}
                  activeOpacity={0.8}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.primaryForeground} />
                  ) : (
                    <Text style={styles.resetBtnText}>
                      Send Reset Link
                    </Text>
                  )}
                </TouchableOpacity>

                <View
                  style={[
                    styles.footer,
                    { paddingBottom: insets.bottom + 8 },
                  ]}
                >
                  <Text style={styles.footerText}>
                    Remember your password?
                  </Text>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={styles.footerLink}>Sign In</Text>
                  </TouchableOpacity>
                </View>
              </>
            )}
          </Animated.View>
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}
