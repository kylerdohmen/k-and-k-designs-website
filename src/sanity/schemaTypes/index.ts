import { type SchemaTypeDefinition } from 'sanity'

import {blockContentType} from './blockContentType'
import {categoryType} from './categoryType'
import {postType} from './postType'
import {authorType} from './authorType'
import {homePage} from './homePage'
import {aboutPage} from './aboutPage'
import {servicesPage} from './servicesPage'
import {contactPage} from './contactPage'
import {service} from './service'
import {siteSettings} from './siteSettings'
import {carouselSection} from './carouselSection'
import {carouselConfig} from './carouselConfig'

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    // Site content
    siteSettings,
    homePage,
    aboutPage,
    servicesPage,
    contactPage,
    service,
    // Carousel content
    carouselConfig,
    carouselSection,
    // Blog content (optional)
    blockContentType,
    categoryType,
    postType,
    authorType,
  ],
}
