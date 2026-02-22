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
    title: 'Acceptance of Terms',
    body: 'By using Affirm, you agree to these terms of service. If you do not agree, please discontinue use of the application.',
  },
  {
    title: 'Use of Service',
    body: 'Affirm is provided as-is for personal, non-commercial use. You may browse affirmations, save favorites, and customize your experience as intended by the app.',
  },
  {
    title: 'Content',
    body: 'All affirmation content is provided for inspirational and motivational purposes only. It is not a substitute for professional mental health advice, diagnosis, or treatment.',
  },
  {
    title: 'Intellectual Property',
    body: 'The Affirm name, design, and original content are protected. You may share individual affirmations for personal use but may not reproduce the app or its content for commercial purposes.',
  },
  {
    title: 'Limitation of Liability',
    body: 'Affirm is provided without warranty. We are not liable for any damages arising from the use or inability to use the application.',
  },
  {
    title: 'Changes to Terms',
    body: 'We reserve the right to modify these terms at any time. Continued use of Affirm after changes constitutes acceptance of the updated terms.',
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

export default function TermsScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>Terms of Service</Text>
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
