/**
 * Carousel Configuration Schema
 * 
 * Sanity schema definition for global carousel configuration.
 * Contains references to carousel sections and global settings
 * for transitions and scroll behavior.
 */

import { defineField, defineType } from 'sanity';
import { validateCarouselSectionLimit } from '../lib/validation';

export const carouselConfig = defineType({
  name: 'carouselConfig',
  title: 'Carousel Configuration',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Configuration Title',
      type: 'string',
      description: 'Internal title for this carousel configuration',
      initialValue: 'Main Carousel Configuration',
      validation: Rule => Rule.required(),
    }),
    defineField({
      name: 'sections',
      title: 'Carousel Sections',
      type: 'array',
      description: 'Select and order the sections that will appear in the carousel',
      of: [
        {
          type: 'reference',
          to: [{ type: 'carouselSection' }],
        },
      ],
      validation: Rule => Rule.required().min(1).max(5).unique().custom(validateCarouselSectionLimit),
    }),
    defineField({
      name: 'transitionDuration',
      title: 'Transition Duration (ms)',
      type: 'number',
      description: 'Duration of transitions between sections in milliseconds',
      initialValue: 800,
      validation: Rule => Rule.required().min(200).max(2000),
    }),
    defineField({
      name: 'scrollSensitivity',
      title: 'Scroll Sensitivity',
      type: 'number',
      description: 'Sensitivity of scroll interactions (1.0 = normal, higher = more sensitive)',
      initialValue: 1.0,
      validation: Rule => Rule.required().min(0.1).max(3.0),
    }),
    defineField({
      name: 'enableKeyboardNavigation',
      title: 'Enable Keyboard Navigation',
      type: 'boolean',
      description: 'Allow users to navigate sections using arrow keys',
      initialValue: true,
    }),
    defineField({
      name: 'enableTouchNavigation',
      title: 'Enable Touch Navigation',
      type: 'boolean',
      description: 'Allow users to navigate sections using touch gestures on mobile',
      initialValue: true,
    }),
    defineField({
      name: 'preloadImages',
      title: 'Preload Images',
      type: 'boolean',
      description: 'Preload background images for smoother transitions',
      initialValue: true,
    }),
    defineField({
      name: 'showProgressIndicator',
      title: 'Show Progress Indicator',
      type: 'boolean',
      description: 'Display a progress indicator showing current section',
      initialValue: true,
    }),
    defineField({
      name: 'autoplay',
      title: 'Autoplay',
      type: 'object',
      description: 'Automatic progression through sections',
      fields: [
        {
          name: 'enabled',
          title: 'Enable Autoplay',
          type: 'boolean',
          initialValue: false,
        },
        {
          name: 'duration',
          title: 'Duration per Section (seconds)',
          type: 'number',
          initialValue: 5,
          validation: Rule => Rule.min(2).max(30),
          hidden: ({ parent }) => !parent?.enabled,
        },
        {
          name: 'pauseOnHover',
          title: 'Pause on Hover',
          type: 'boolean',
          initialValue: true,
          hidden: ({ parent }) => !parent?.enabled,
        },
      ],
    }),
    defineField({
      name: 'accessibility',
      title: 'Accessibility Settings',
      type: 'object',
      description: 'Accessibility and user preference settings',
      fields: [
        {
          name: 'respectReducedMotion',
          title: 'Respect Reduced Motion Preference',
          type: 'boolean',
          description: 'Disable animations for users who prefer reduced motion',
          initialValue: true,
        },
        {
          name: 'announceTransitions',
          title: 'Announce Section Transitions',
          type: 'boolean',
          description: 'Announce section changes to screen readers',
          initialValue: true,
        },
        {
          name: 'skipToContentEnabled',
          title: 'Enable Skip to Content',
          type: 'boolean',
          description: 'Provide a skip link to bypass the carousel',
          initialValue: true,
        },
      ],
    }),
    defineField({
      name: 'isActive',
      title: 'Active Configuration',
      type: 'boolean',
      description: 'Whether this configuration is currently active on the site',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      sectionsCount: 'sections',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, sectionsCount, isActive } = selection;
      const sectionCount = Array.isArray(sectionsCount) ? sectionsCount.length : 0;
      return {
        title: title || 'Carousel Configuration',
        subtitle: `${sectionCount} sections${!isActive ? ' (Inactive)' : ''}`,
      };
    },
  },
});