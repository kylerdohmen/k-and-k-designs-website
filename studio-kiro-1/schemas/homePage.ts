import {defineType} from 'sanity'

export const homePage = defineType({
  name: 'homePage',
  title: 'Home Page',
  type: 'document',
  fields: [
    {
      name: 'hero',
      title: 'Hero Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Hero Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'subtitle',
          title: 'Hero Subtitle',
          type: 'text',
          rows: 3
        },
        {
          name: 'backgroundImage',
          title: 'Background Image (optional)',
          type: 'image',
          options: {
            hotspot: true,
          }
        },
        {
          name: 'alignment',
          title: 'Text Alignment',
          type: 'string',
          options: {
            list: [
              {title: 'Left', value: 'left'},
              {title: 'Center', value: 'center'},
              {title: 'Right', value: 'right'}
            ]
          },
          initialValue: 'center'
        },
        {
          name: 'ctaButtons',
          title: 'Call-to-Action Buttons',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'text',
                  title: 'Button Text',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'href',
                  title: 'Button Link',
                  type: 'string',
                  validation: Rule => Rule.required()
                },
                {
                  name: 'variant',
                  title: 'Button Style',
                  type: 'string',
                  options: {
                    list: [
                      {title: 'Primary', value: 'primary'},
                      {title: 'Secondary', value: 'secondary'},
                      {title: 'Outline', value: 'outline'}
                    ]
                  },
                  initialValue: 'primary'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'services',
      title: 'Services Section',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Section Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Section Description',
          type: 'text',
          rows: 3
        },
        {
          name: 'services',
          title: 'Featured Services',
          type: 'array',
          of: [
            {
              type: 'reference',
              to: [{type: 'service'}]
            }
          ]
        },
        {
          name: 'layout',
          title: 'Layout Style',
          type: 'string',
          options: {
            list: [
              {title: 'Grid', value: 'grid'},
              {title: 'List', value: 'list'}
            ]
          },
          initialValue: 'grid'
        }
      ]
    },
    {
      name: 'seo',
      title: 'SEO Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Page Title',
          type: 'string'
        },
        {
          name: 'description',
          title: 'Meta Description',
          type: 'text',
          rows: 3
        },
        {
          name: 'keywords',
          title: 'Keywords',
          type: 'array',
          of: [{type: 'string'}]
        },
        {
          name: 'noIndex',
          title: 'Hide from Search Engines',
          type: 'boolean',
          initialValue: false
        }
      ]
    }
  ],
  preview: {
    select: {
      title: 'hero.title'
    },
    prepare(selection) {
      return {
        title: `Home Page: ${selection.title}`
      }
    }
  }
})