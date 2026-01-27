import {defineType} from 'sanity'

export const servicesPage = defineType({
  name: 'servicesPage',
  title: 'Services Page',
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
          title: 'Services to Display',
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
        title: `Services Page: ${selection.title}`
      }
    }
  }
})