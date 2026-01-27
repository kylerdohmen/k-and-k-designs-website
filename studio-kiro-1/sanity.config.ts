import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Import schemas
import {service} from './schemas/service'
import {homePage} from './schemas/homePage'
import {aboutPage} from './schemas/aboutPage'
import {servicesPage} from './schemas/servicesPage'
import {siteSettings} from './schemas/siteSettings'

export default defineConfig({
  name: 'default',
  title: 'Marketing Website Studio',

  projectId: 'l8zvozfy',
  dataset: 'production',

  plugins: [
    structureTool()
  ],

  schema: {
    types: [
      // Document types
      service,
      homePage,
      aboutPage,
      servicesPage,
      siteSettings
    ],
  },
})