/**
 * Carousel Section Schema
 * 
 * Sanity schema definition for individual carousel sections.
 * Each section contains a background image, heading, subheading,
 * and rich text content for the storytelling experience.
 */

import { defineField, defineType } from 'sanity';
import { 
  validateUniqueOrder, 
  validateCarouselImage, 
  validatePortableTextContent,
  validateHeading,
  validateSubheading,
  validateSectionTitle 
} from '../lib/validation';

export const carouselSection = defineType({
  name: 'carouselSection',
  title: 'Carousel Section',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Section Title',
      type: 'string',
      description: 'Internal title for content management (not displayed on frontend)',
      validation: Rule => Rule.required()
        .min(3)
        .max(100)
        .custom(validateSectionTitle),
    }),
    defineField({
      name: 'heading',
      title: 'Main Heading',
      type: 'string',
      description: 'Primary heading displayed in the carousel section',
      validation: Rule => Rule.required()
        .min(5)
        .max(100)
        .custom(validateHeading),
    }),
    defineField({
      name: 'subheading',
      title: 'Subheading',
      type: 'string',
      description: 'Optional subheading displayed below the main heading',
      validation: Rule => Rule.max(200).custom(validateSubheading),
    }),
    defineField({
      name: 'content',
      title: 'Content',
      type: 'array',
      description: 'Rich text content for the carousel section',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          lists: [
            { title: 'Bullet', value: 'bullet' },
            { title: 'Number', value: 'number' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
            ],
            annotations: [
              {
                title: 'URL',
                name: 'link',
                type: 'object',
                fields: [
                  {
                    title: 'URL',
                    name: 'href',
                    type: 'url',
                    validation: Rule => Rule.uri({
                      scheme: ['http', 'https', 'mailto', 'tel']
                    }),
                  },
                  {
                    title: 'Open in new tab',
                    name: 'blank',
                    type: 'boolean',
                    initialValue: false,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              type: 'string',
              title: 'Alternative text',
              description: 'Important for SEO and accessibility.',
              validation: Rule => Rule.required().min(5).max(150),
            },
            {
              name: 'caption',
              type: 'string',
              title: 'Caption',
              description: 'Optional caption displayed below the image.',
            },
          ],
        },
      ],
      validation: Rule => Rule.custom(validatePortableTextContent),
    }),
    defineField({
      name: 'backgroundImage',
      title: 'Background Image',
      type: 'image',
      description: 'Full-screen background image for this carousel section',
      options: {
        hotspot: true,
        storeOriginalFilename: false,
        accept: 'image/*',
        sources: [],
      },
      fields: [
        {
          name: 'alt',
          type: 'string',
          title: 'Alternative text',
          description: 'Describe the image for accessibility and SEO',
          validation: Rule => Rule.required().min(10).max(200),
        },
        {
          name: 'caption',
          type: 'string',
          title: 'Image Caption',
          description: 'Optional caption for the background image (for internal reference)',
        },
        {
          name: 'focalPoint',
          type: 'object',
          title: 'Focal Point Override',
          description: 'Override the hotspot for specific responsive breakpoints',
          fields: [
            {
              name: 'mobile',
              type: 'string',
              title: 'Mobile Focus',
              description: 'Focus area for mobile devices (top, center, bottom)',
              options: {
                list: [
                  { title: 'Top', value: 'top' },
                  { title: 'Center', value: 'center' },
                  { title: 'Bottom', value: 'bottom' },
                ],
              },
              initialValue: 'center',
            },
            {
              name: 'desktop',
              type: 'string',
              title: 'Desktop Focus',
              description: 'Focus area for desktop devices',
              options: {
                list: [
                  { title: 'Top', value: 'top' },
                  { title: 'Center', value: 'center' },
                  { title: 'Bottom', value: 'bottom' },
                ],
              },
              initialValue: 'center',
            },
          ],
        },
      ],
      validation: Rule => Rule.required().custom(validateCarouselImage),
    }),
    defineField({
      name: 'order',
      title: 'Display Order',
      type: 'number',
      description: 'Order in which this section appears in the carousel (1, 2, 3, etc.)',
      validation: Rule => Rule.required()
        .min(1)
        .max(10)
        .integer()
        .custom(validateUniqueOrder),
      initialValue: 1,
    }),
    defineField({
      name: 'isActive',
      title: 'Active',
      type: 'boolean',
      description: 'Whether this section is currently active and should be displayed',
      initialValue: true,
    }),
  ],
  preview: {
    select: {
      title: 'title',
      heading: 'heading',
      order: 'order',
      media: 'backgroundImage',
      isActive: 'isActive',
    },
    prepare(selection) {
      const { title, heading, order, media, isActive } = selection;
      return {
        title: title || heading || 'Untitled Section',
        subtitle: `Order: ${order}${!isActive ? ' (Inactive)' : ''}`,
        media,
      };
    },
  },
  orderings: [
    {
      title: 'Display Order',
      name: 'orderAsc',
      by: [{ field: 'order', direction: 'asc' }],
    },
    {
      title: 'Created Date',
      name: 'createdDesc',
      by: [{ field: '_createdAt', direction: 'desc' }],
    },
  ],
});