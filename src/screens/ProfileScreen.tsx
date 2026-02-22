import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  User,
  Pencil,
  CheckCircle2,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ColorScheme } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  userName: string;
  onSetUserName: (name: string) => void;
};

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    container: { flex: 1 },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingHorizontal: 20,
      paddingBottom: 12,
      zIndex: 40,
    },
    backBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    headerTitle: {
      fontSize: 20,
      fontWeight: '700',
      color: c.foreground,
    },
    content: { paddingHorizontal: 20, paddingTop: 16 },

    // Avatar
    avatarContainer: {
      alignItems: 'center',
      marginTop: 16,
    },
    avatar: {
      width: 96,
      height: 96,
      borderRadius: 48,
      backgroundColor: `${c.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },

    // Card
    card: {
      marginTop: 32,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    label: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: c.mutedForeground,
    },
    inputRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 12,
      borderRadius: 12,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.background,
    },
    input: {
      flex: 1,
      fontSize: 14,
      color: c.foreground,
      padding: 0,
    },
    charCount: {
      marginTop: 8,
      fontSize: 12,
      color: c.mutedForeground,
    },
    saveBtn: {
      marginTop: 24,
      height: 48,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    saveBtnActive: {
      backgroundColor: c.primary,
      ...Platform.select({
        ios: {
          shadowColor: c.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: { elevation: 6 },
      }),
    },
    saveBtnDisabled: {
      backgroundColor: c.muted,
    },
    savedRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
    },
    saveBtnTextActive: {
      fontSize: 14,
      fontWeight: '600',
      color: c.primaryForeground,
    },
    saveBtnTextDisabled: {
      fontSize: 14,
      fontWeight: '600',
      color: c.mutedForeground,
    },
  });
}

export default function ProfileScreen({
  navigation,
  userName,
  onSetUserName,
}: Props) {
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);
  const insets = useSafeAreaInsets();
  const [name, setName] = useState(userName);
  const [saved, setSaved] = useState(false);

  const hasChanges = name.trim() !== userName;

  const handleSave = () => {
    onSetUserName(name.trim());
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[styles.header, { paddingTop: insets.top + 8, backgroundColor: colors.background }]}
      >
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}
          activeOpacity={0.7}
        >
          <ArrowLeft size={20} color={colors.mutedForeground} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* Avatar */}
        <View style={styles.avatarContainer}>
          <View style={styles.avatar}>
            <User size={48} color={colors.primary} />
          </View>
        </View>

        {/* Name card */}
        <View style={styles.card}>
          <Text style={styles.label}>Display Name</Text>
          <View style={styles.inputRow}>
            <Pencil size={16} color={colors.mutedForeground} />
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Enter your name..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.input}
              maxLength={30}
              returnKeyType="done"
            />
          </View>
          <Text style={styles.charCount}>{name.length}/30 characters</Text>

          <TouchableOpacity
            onPress={handleSave}
            disabled={!hasChanges}
            style={[
              styles.saveBtn,
              hasChanges ? styles.saveBtnActive : styles.saveBtnDisabled,
            ]}
            activeOpacity={0.85}
          >
            {saved ? (
              <View style={styles.savedRow}>
                <CheckCircle2 size={16} color={colors.primaryForeground} />
                <Text style={styles.saveBtnTextActive}>Saved</Text>
              </View>
            ) : (
              <Text
                style={
                  hasChanges
                    ? styles.saveBtnTextActive
                    : styles.saveBtnTextDisabled
                }
              >
                Save Changes
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
