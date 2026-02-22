import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ColorScheme } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const sections = [
  {
    title: 'Information We Collect',
    body: 'Affirm stores your preferences, selected categories, and saved affirmations locally on your device. We do not collect personal data or share information with third parties.',
  },
  {
    title: 'Data Storage',
    body: 'All data is stored locally on your device. No account creation is required, and your data never leaves your device.',
  },
  {
    title: 'Notifications',
    body: 'If you enable daily reminders, notification permissions are requested through your device. You can disable notifications at any time through the app settings.',
  },
  {
    title: 'Analytics',
    body: 'We do not use analytics trackers or collect usage data. Your affirmation journey is entirely private.',
  },
  {
    title: 'Changes to This Policy',
    body: 'We may update this privacy policy from time to time. Any changes will be reflected in the app with an updated version number.',
  },
];

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
    lastUpdated: {
      fontSize: 12,
      color: c.mutedForeground,
    },
    card: {
      marginTop: 16,
      padding: 20,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    cardTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: c.foreground,
    },
    cardBody: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
      color: c.mutedForeground,
    },
  });
}

export default function PrivacyScreen({ navigation }: Props) {
  const insets = useSafeAreaInsets();
  const { colors } = useTheme();
  const styles = useMemo(() => createStyles(colors), [colors]);

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
        <Text style={styles.headerTitle}>Privacy Policy</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.lastUpdated}>Last updated: February 2026</Text>

        {sections.map((section) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
