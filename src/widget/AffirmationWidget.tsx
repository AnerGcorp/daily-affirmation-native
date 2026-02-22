/**
 * Daily Affirmation Home Screen Widget (Android)
 *
 * Displays the current daily affirmation in a beautiful card widget.
 * Updated daily or when the user interacts with the app.
 *
 * NOTE: Requires a development build (`npx expo prebuild && npx expo run:android`).
 * Will NOT work in Expo Go.
 */

import React from 'react';
import {
  FlexWidget,
  TextWidget,
  ImageWidget,
  OverlapWidget,
} from 'react-native-android-widget';

interface AffirmationWidgetProps {
  text: string;
  category: string;
}

// ─── Small widget (2×2) ────────────────────────────────────────────────────

export function AffirmationWidgetSmall({
  text,
  category,
}: AffirmationWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 24,
        backgroundColor: '#1a2744',
        padding: 16,
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Category label */}
      <FlexWidget
        style={{
          backgroundColor: '#3478F640',
          borderRadius: 8,
          paddingHorizontal: 10,
          paddingVertical: 4,
          alignSelf: 'flex-start',
        }}
      >
        <TextWidget
          text={category}
          style={{
            fontSize: 11,
            fontWeight: '600',
            color: '#7CB3FF',
          }}
        />
      </FlexWidget>

      {/* Affirmation text */}
      <TextWidget
        text={text}
        style={{
          fontSize: 14,
          fontWeight: '600',
          color: '#FFFFFF',
          lineHeight: 20,
        }}
        maxLines={4}
      />

      {/* Branding */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
        }}
      >
        <TextWidget
          text="✨"
          style={{ fontSize: 12 }}
        />
        <TextWidget
          text="Affirm"
          style={{
            fontSize: 11,
            fontWeight: '700',
            color: '#7CB3FF',
          }}
        />
      </FlexWidget>
    </FlexWidget>
  );
}

// ─── Medium widget (4×2) ───────────────────────────────────────────────────

export function AffirmationWidgetMedium({
  text,
  category,
}: AffirmationWidgetProps) {
  return (
    <FlexWidget
      style={{
        height: 'match_parent',
        width: 'match_parent',
        borderRadius: 24,
        backgroundColor: '#1a2744',
        padding: 20,
        justifyContent: 'space-between',
      }}
      clickAction="OPEN_APP"
    >
      {/* Top row */}
      <FlexWidget
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: 'match_parent',
        }}
      >
        {/* Branding */}
        <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <TextWidget text="✨" style={{ fontSize: 16 }} />
          <TextWidget
            text="Daily Affirmation"
            style={{
              fontSize: 14,
              fontWeight: '700',
              color: '#FFFFFF',
            }}
          />
        </FlexWidget>

        {/* Category */}
        <FlexWidget
          style={{
            backgroundColor: '#3478F640',
            borderRadius: 8,
            paddingHorizontal: 10,
            paddingVertical: 4,
          }}
        >
          <TextWidget
            text={category}
            style={{
              fontSize: 11,
              fontWeight: '600',
              color: '#7CB3FF',
            }}
          />
        </FlexWidget>
      </FlexWidget>

      {/* Affirmation text */}
      <TextWidget
        text={`"${text}"`}
        style={{
          fontSize: 16,
          fontWeight: '600',
          color: '#FFFFFF',
          lineHeight: 24,
        }}
        maxLines={3}
      />

      {/* Tap hint */}
      <TextWidget
        text="Tap to see more →"
        style={{
          fontSize: 11,
          color: '#7CB3FF80',
        }}
      />
    </FlexWidget>
  );
}
