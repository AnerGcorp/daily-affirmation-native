import React, { useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ArrowLeft, Heart } from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ColorScheme } from '../theme/colors';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
};

const sections = [
  {
    title: 'Our Mission',
    body: 'Affirm helps you build a positive mindset through daily affirmations. Our mission is to make self-improvement accessible and habitual, one affirmation at a time.',
  },
  {
    title: 'How It Works',
    body: 'Choose the categories that resonate with you, and we will deliver personalized daily affirmations. Save your favorites, set reminders, and build a consistent practice of positive thinking.',
  },
  {
    title: 'Contact',
    body: 'Have feedback or suggestions? We would love to hear from you. Reach out at hello@affirm.app',
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

    // Brand
    brandContainer: {
      alignItems: 'center',
      marginTop: 16,
    },
    brandIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: `${c.primary}15`,
      alignItems: 'center',
      justifyContent: 'center',
    },
    brandName: {
      marginTop: 16,
      fontSize: 24,
      fontWeight: '700',
      color: c.foreground,
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    brandVersion: {
      marginTop: 4,
      fontSize: 14,
      color: c.mutedForeground,
    },

    // Cards
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

export default function AboutScreen({ navigation }: Props) {
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
        <Text style={styles.headerTitle}>About Affirm</Text>
      </View>

      <ScrollView
        contentContainerStyle={[styles.content, { paddingBottom: insets.bottom + 32 }]}
        showsVerticalScrollIndicator={false}
      >
        {/* App icon + version */}
        <View style={styles.brandContainer}>
          <View style={styles.brandIcon}>
            <Heart size={40} color={colors.primary} />
          </View>
          <Text style={styles.brandName}>Affirm</Text>
          <Text style={styles.brandVersion}>Version 1.0.0</Text>
        </View>

        {/* Sections */}
        {sections.map((section, i) => (
          <View key={section.title} style={styles.card}>
            <Text style={styles.cardTitle}>{section.title}</Text>
            <Text style={styles.cardBody}>{section.body}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
