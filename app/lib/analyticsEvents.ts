/**
 * Analytics Events for Enigma77
 * 
 * Track user interactions and progression through the riddle
 */

import { trackEvent } from './analytics';

export const analyticsEvents = {
  /**
   * Sphere interaction tracking
   */
  sphereClicked: (clickCount: number) => {
    trackEvent('sphere_click', {
      click_number: clickCount,
    });
  },

  /**
   * Name input tracking
   */
  nameInputStarted: () => {
    trackEvent('name_input_started');
  },

  nameInputCharacterAdded: (inputLength: number) => {
    trackEvent('name_input_character_added', {
      input_length: inputLength,
    });
  },

  nameInputCharacterRemoved: (inputLength: number) => {
    trackEvent('name_input_character_removed', {
      input_length: inputLength,
    });
  },

  nameSubmitted: (nameLength: number) => {
    trackEvent('name_submitted', {
      name_length: nameLength,
    });
  },

  /**
   * Progression tracking
   */
  scatterAnimationStarted: () => {
    trackEvent('scatter_animation_started');
  },

  scatterAnimationCompleted: () => {
    trackEvent('scatter_animation_completed');
  },

  /**
   * Reward tracking
   */
  discordInvitationViewed: () => {
    trackEvent('discord_invitation_viewed');
  },

  discordLinkClicked: () => {
    trackEvent('discord_link_clicked');
  },

  /**
   * Navigation tracking
   */
  menuOpened: () => {
    trackEvent('menu_opened');
  },

  menuItemClicked: (itemLabel: string) => {
    trackEvent('menu_item_clicked', {
      item: itemLabel,
    });
  },

  /**
   * Error tracking
   */
  errorOccurred: (errorType: string) => {
    trackEvent('error_occurred', {
      error_type: errorType,
    });
  },

  /**
   * Session tracking
   */
  sessionDuration: (durationSeconds: number) => {
    trackEvent('session_duration', {
      duration: durationSeconds,
    });
  },
};
