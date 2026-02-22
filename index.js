/**
 * Custom entry point that registers the Android widget task handler
 * before the main Expo app boots.
 */

import { registerWidgetTaskHandler } from 'react-native-android-widget';
import { widgetTaskHandler } from './src/widget/widget-task-handler';

// Register the widget background task handler
registerWidgetTaskHandler(widgetTaskHandler);

// Boot the standard Expo app
import 'expo/AppEntry';
