import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  StyleSheet,
  Platform,
  Share,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  Heart,
  Search,
  X,
  Share2,
  Trash2,
} from 'lucide-react-native';
import { useTheme } from '../theme/ThemeContext';
import type { ColorScheme } from '../theme/colors';
import { allAffirmations } from '../data/affirmations';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';

type Props = {
  navigation: NativeStackNavigationProp<any>;
  favorites: Set<string>;
  onToggleFavorite: (id: string) => void;
};

function createStyles(c: ColorScheme) {
  return StyleSheet.create({
    container: {
      flex: 1,
    },

    // ── Header ──
    header: {
      paddingHorizontal: 20,
      paddingBottom: 12,
      zIndex: 40,
    },
    headerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
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
    title: {
      fontSize: 20,
      fontWeight: '700',
      color: c.foreground,
    },
    titleAccent: {
      color: c.primary,
    },
    subtitle: {
      fontSize: 12,
      color: c.mutedForeground,
      marginTop: 1,
    },
    searchBtn: {
      width: 44,
      height: 44,
      borderRadius: 22,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
      alignItems: 'center',
      justifyContent: 'center',
    },
    searchBtnActive: {
      backgroundColor: c.primary,
      borderColor: c.primary,
    },

    // ── Search bar ──
    searchBar: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 12,
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      backgroundColor: c.card,
    },
    searchInput: {
      flex: 1,
      fontSize: 14,
      color: c.cardForeground,
      padding: 0,
    },

    // ── List ──
    listContent: {
      paddingHorizontal: 20,
      paddingTop: 16,
      gap: 16,
    },

    // ── Card ──
    card: {
      borderRadius: 16,
      overflow: 'hidden',
      aspectRatio: 16 / 9,
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.15,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    cardInner: {
      flex: 1,
      justifyContent: 'space-between',
      padding: 20,
    },
    cardTop: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    cardCategoryBadge: {
      backgroundColor: 'rgba(255,255,255,0.20)',
      paddingHorizontal: 12,
      paddingVertical: 4,
      borderRadius: 16,
    },
    cardCategoryText: {
      fontSize: 11,
      fontWeight: '500',
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: 'rgba(255,255,255,1)',
    },
    cardBottom: {
      gap: 12,
    },
    cardQuote: {
      fontSize: 16,
      fontWeight: '500',
      lineHeight: 24,
      color: 'rgba(255,255,255,1)',
      fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif',
    },
    cardActions: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },

    // ── Empty state ──
    emptyContainer: {
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 96,
      paddingHorizontal: 24,
    },
    emptyIcon: {
      width: 80,
      height: 80,
      borderRadius: 40,
      backgroundColor: c.muted,
      alignItems: 'center',
      justifyContent: 'center',
    },
    emptyTitle: {
      marginTop: 24,
      fontSize: 20,
      fontWeight: '600',
      color: c.foreground,
    },
    emptySubtitle: {
      marginTop: 8,
      fontSize: 14,
      lineHeight: 22,
      textAlign: 'center',
      color: c.mutedForeground,
    },
    emptyButton: {
      marginTop: 32,
      backgroundColor: c.primary,
      paddingHorizontal: 32,
      paddingVertical: 14,
      borderRadius: 24,
      ...Platform.select({
        ios: {
          shadowColor: c.primary,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.25,
          shadowRadius: 12,
        },
        android: {
          elevation: 6,
        },
      }),
    },
    emptyButtonText: {
      fontSize: 14,
      fontWeight: '600',
      color: c.primaryForeground,
    },
  });
}

export default function FavoritesScreen({
  navigation,
  favorites,
  onToggleFavorite,
}: Props) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  const savedItems = useMemo(
    () => allAffirmations.filter((a) => favorites.has(a.id)),
    [favorites]
  );

  const filtered = useMemo(() => {
    if (!searchQuery.trim()) return savedItems;
    const q = searchQuery.toLowerCase();
    return savedItems.filter(
      (a) =>
        a.text.toLowerCase().includes(q) ||
        a.category.toLowerCase().includes(q)
    );
  }, [savedItems, searchQuery]);

  const styles = useMemo(() => createStyles(colors), [colors]);

  const handleShare = async (text: string, category: string) => {
    try {
      await Share.share({
        message: `"${text}" — ${category} | Affirm App`,
      });
    } catch (_) { }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      {/* Header */}
      <View
        style={[
          styles.header,
          {
            paddingTop: insets.top + 8,
            backgroundColor: colors.background,
          },
        ]}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              style={styles.backBtn}
              activeOpacity={0.7}
            >
              <ArrowLeft size={20} color={colors.mutedForeground} />
            </TouchableOpacity>
            <View>
              <Text style={styles.title}>
                My <Text style={styles.titleAccent}>Favorites</Text>
              </Text>
              <Text style={styles.subtitle}>
                {savedItems.length} affirmation
                {savedItems.length !== 1 ? 's' : ''} saved
              </Text>
            </View>
          </View>
          <TouchableOpacity
            onPress={() => setShowSearch(!showSearch)}
            style={[styles.searchBtn, showSearch && styles.searchBtnActive]}
            activeOpacity={0.7}
          >
            {showSearch ? (
              <X size={20} color={colors.primaryForeground} />
            ) : (
              <Search size={20} color={colors.mutedForeground} />
            )}
          </TouchableOpacity>
        </View>

        {/* Search bar */}
        {showSearch && (
          <View style={styles.searchBar}>
            <Search size={16} color={colors.mutedForeground} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search saved affirmations..."
              placeholderTextColor={colors.mutedForeground}
              style={styles.searchInput}
              autoFocus
              returnKeyType="search"
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery('')}>
                <X size={16} color={colors.mutedForeground} />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>

      {/* Content */}
      <ScrollView
        contentContainerStyle={[
          styles.listContent,
          { paddingBottom: insets.bottom + 24 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {filtered.length > 0 ? (
          filtered.map((item, i) => {
            return (
              <View key={item.id} style={styles.card}>
                {/* Background image */}
                <Image
                  source={{ uri: item.image }}
                  style={StyleSheet.absoluteFillObject}
                  resizeMode="cover"
                />
                {/* Dark gradient overlay for text readability */}
                <LinearGradient
                  colors={[
                    colors.cardGradientTop,
                    colors.cardGradientMid,
                    colors.cardGradientBottom,
                  ]}
                  style={StyleSheet.absoluteFillObject}
                />

                {/* Card content */}
                <View style={styles.cardInner}>
                  <View style={styles.cardTop}>
                    <View style={styles.cardCategoryBadge}>
                      <Text style={styles.cardCategoryText}>
                        {item.category}
                      </Text>
                    </View>
                  </View>

                  <View style={styles.cardBottom}>
                    <Text style={styles.cardQuote}>"{item.text}"</Text>
                    <View style={styles.cardActions}>
                      <TouchableOpacity
                        onPress={() => onToggleFavorite(item.id)}
                        activeOpacity={0.7}
                      >
                        <Heart
                          size={20}
                          color="rgba(230,120,120,1)"
                          fill="rgba(230,120,120,1)"
                        />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleShare(item.text, item.category)}
                        activeOpacity={0.7}
                      >
                        <Share2
                          size={20}
                          color="rgba(255,255,255,0.70)"
                        />
                      </TouchableOpacity>
                      <View style={{ flex: 1 }} />
                      <TouchableOpacity
                        onPress={() => onToggleFavorite(item.id)}
                        activeOpacity={0.7}
                      >
                        <Trash2
                          size={16}
                          color="rgba(255,255,255,0.50)"
                        />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>
            );
          })
        ) : (
          <View style={styles.emptyContainer}>
            <View style={styles.emptyIcon}>
              <Heart size={36} color={colors.mutedForeground} />
            </View>
            <Text style={styles.emptyTitle}>
              {searchQuery ? 'No results found' : 'No favorites yet'}
            </Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery
                ? 'Try a different search term'
                : 'Tap the heart on any affirmation to save it here.'}
            </Text>
            {!searchQuery && (
              <TouchableOpacity
                onPress={() => navigation.goBack()}
                style={styles.emptyButton}
                activeOpacity={0.7}
              >
                <Text style={styles.emptyButtonText}>Browse Affirmations</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
