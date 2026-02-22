/**
 * Widget Task Handler
 *
 * Handles widget lifecycle events (create, update, click).
 * Selects a daily affirmation and renders the widget.
 *
 * NOTE: Requires a development build.
 */

import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { AffirmationWidgetSmall, AffirmationWidgetMedium } from './AffirmationWidget';
import { allAffirmations } from '../data/affirmations';

// ─── Pick a daily affirmation (deterministic by date) ───────────────────────

function getDailyAffirmation() {
  const today = new Date();
  const dayIndex =
    today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate();
  const index = dayIndex % allAffirmations.length;
  return allAffirmations[index];
}

// Widget names must match what's in app.json expo.android.widgetProvider
const WIDGET_SMALL = 'AffirmationWidgetSmall';
const WIDGET_MEDIUM = 'AffirmationWidgetMedium';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
  const widgetInfo = props.widgetInfo;
  const affirmation = getDailyAffirmation();

  switch (props.widgetAction) {
    case 'WIDGET_ADDED':
    case 'WIDGET_UPDATE':
    case 'WIDGET_RESIZED': {
      if (widgetInfo.widgetName === WIDGET_SMALL) {
        props.renderWidget(
          <AffirmationWidgetSmall
            text={affirmation.text}
            category={affirmation.category}
          />
        );
      } else {
        props.renderWidget(
          <AffirmationWidgetMedium
            text={affirmation.text}
            category={affirmation.category}
          />
        );
      }
      break;
    }

    case 'WIDGET_DELETED':
      // Cleanup if needed
      break;

    case 'WIDGET_CLICK':
      // Handle click – OPEN_APP is set on the root FlexWidget
      break;

    default:
      break;
  }
}
