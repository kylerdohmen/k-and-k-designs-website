import {defineType} from 'sanity'

export const contactPage = defineType({
  name: 'contactPage',
  title: 'Contact Page',
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
        }
      ]
    },
    {
      name: 'contactInfo',
      title: 'Contact Information',
      type: 'object',
      fields: [
        {
          name: 'address',
          title: 'Address',
          type: 'object',
          fields: [
            {
              name: 'street',
              title: 'Street Address',
              type: 'string'
            },
            {
              name: 'city',
              title: 'City',
              type: 'string'
            },
            {
              name: 'state',
              title: 'State/Province',
              type: 'string'
            },
            {
              name: 'zipCode',
              title: 'ZIP/Postal Code',
              type: 'string'
            },
            {
              name: 'country',
              title: 'Country',
              type: 'string'
            }
          ]
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'email',
          title: 'Email Address',
          type: 'string',
          validation: Rule => Rule.email()
        },
        {
          name: 'businessHours',
          title: 'Business Hours',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'days',
                  title: 'Days',
                  type: 'string',
                  description: 'e.g., "Monday - Friday"'
                },
                {
                  name: 'hours',
                  title: 'Hours',
                  type: 'string',
                  description: 'e.g., "9:00 AM - 6:00 PM"'
                }
              ]
            }
          ]
        }
      ]
    },
    {
      name: 'formSettings',
      title: 'Contact Form Settings',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Form Title',
          type: 'string',
          initialValue: 'Send us a message'
        },
        {
          name: 'subjects',
          title: 'Subject Options',
          type: 'array',
          of: [
            {
              type: 'object',
              fields: [
                {
                  name: 'label',
                  title: 'Display Label',
                  type: 'string'
                },
                {
                  name: 'value',
                  title: 'Value',
                  type: 'string'
                }
              ]
            }
          ]
        },
        {
          name: 'responseMessage',
          title: 'Response Time Message',
          type: 'object',
          fields: [
            {
              name: 'title',
              title: 'Title',
              type: 'string',
              initialValue: 'Quick Response'
            },
            {
              name: 'message',
              title: 'Message',
              type: 'text',
              rows: 3
            }
          ]
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
        title: `Contact Page: ${selection.title}`
      }
    }
  }
})