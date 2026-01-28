/**
 * Sanity Schema Validation Utilities
 * 
 * Custom validation functions for Sanity schemas, specifically
 * designed for carousel content validation and error handling.
 * 
 * Requirements: 5.1, 8.4
 */

import { ValidationContext } from 'sanity'

/**
 * Validate carousel section order uniqueness
 * Ensures no two sections have the same order number
 */
export const validateUniqueOrder = async (order: number | undefined, context: ValidationContext) => {
  if (!order || !context.document?._id) return true
  
  const { document, getClient } = context
  const client = getClient({ apiVersion: '2023-01-01' })
  const id = document._id.replace(/^drafts\./, '')
  
  const query = `*[_type == "carouselSection" && order == $order && _id != $id && _id != $draftId]`
  const params = { 
    order, 
    id, 
    draftId: `drafts.${id}` 
  }
  
  try {
    const existing = await client.fetch(query, params)
    
    if (existing.length > 0) {
      return `Order ${order} is already used by another section. Please choose a different order number.`
    }
    
    return true
  } catch (error) {
    // If we can't check for duplicates due to network/client errors,
    // we'll allow the validation to pass rather than block the user
    console.warn('Unable to validate unique order due to client error:', error)
    return true
  }
}

/**
 * Validate that carousel configuration doesn't exceed section limits
 */
export const validateCarouselSectionLimit = async (sections: any[] | undefined) => {
  if (!sections) return 'At least one carousel section is required.'
  
  if (sections.length < 1) {
    return 'At least one carousel section is required.'
  }
  
  if (sections.length > 5) {
    return 'Maximum of 5 carousel sections allowed for optimal performance.'
  }
  
  // Check for duplicate references
  const sectionIds = sections.map(section => section._ref).filter(Boolean)
  const uniqueIds = new Set(sectionIds)
  
  if (sectionIds.length !== uniqueIds.size) {
    return 'Duplicate sections are not allowed. Each section can only be used once.'
  }
  
  return true
}

/**
 * Validate image asset exists and has proper dimensions
 */
export const validateCarouselImage = (image: any) => {
  if (!image) {
    return 'Background image is required for carousel sections.'
  }
  
  if (!image.asset) {
    return 'Please upload an image file.'
  }
  
  if (!image.asset._ref || image.asset._ref.trim() === '') {
    return 'Please upload an image file.'
  }
  
  // Additional validation could be added here for image dimensions
  // if we had access to the asset metadata
  
  return true
}

/**
 * Validate portable text content has meaningful content
 */
export const validatePortableTextContent = (content: any[] | undefined) => {
  if (!content || content.length === 0) {
    return 'Content is required. Please add at least one block of text or media.'
  }
  
  // Check if there's at least one text block with actual content
  const hasTextContent = content.some(block => {
    if (block._type === 'block' && block.children) {
      return block.children.some((child: any) => 
        child.text && child.text.trim().length > 0
      )
    }
    return false
  })
  
  if (!hasTextContent) {
    return 'Please add at least one paragraph of text content.'
  }
  
  // Check for excessively long content
  const totalTextLength = content.reduce((total, block) => {
    if (block._type === 'block' && block.children) {
      const blockText = block.children
        .map((child: any) => child.text || '')
        .join('')
      return total + blockText.length
    }
    return total
  }, 0)
  
  if (totalTextLength > 2000) {
    return 'Content is too long. Please keep carousel section content concise (under 2000 characters).'
  }
  
  return true
}

/**
 * Validate heading length and content
 */
export const validateHeading = (heading: string | undefined) => {
  if (!heading || heading.trim().length === 0) {
    return 'Heading is required and cannot be empty.'
  }
  
  const trimmed = heading.trim()
  
  if (trimmed.length < 5) {
    return 'Heading must be at least 5 characters long for meaningful content.'
  }
  
  if (trimmed.length > 100) {
    return 'Heading must be 100 characters or less for optimal display across devices.'
  }
  
  // Check for common heading issues
  if (trimmed.toLowerCase() === trimmed) {
    return 'Consider using proper capitalization for better readability.'
  }
  
  return true
}

/**
 * Validate subheading content
 */
export const validateSubheading = (subheading: string | undefined) => {
  if (!subheading) return true // Subheading is optional
  
  const trimmed = subheading.trim()
  
  if (trimmed.length > 200) {
    return 'Subheading must be 200 characters or less for optimal display.'
  }
  
  if (trimmed.length > 0 && trimmed.length < 10) {
    return 'If provided, subheading should be at least 10 characters for meaningful content.'
  }
  
  return true
}

/**
 * Validate section title for internal organization
 */
export const validateSectionTitle = (title: string | undefined) => {
  if (!title || title.trim().length === 0) {
    return 'Section title is required for content organization.'
  }
  
  const trimmed = title.trim()
  
  if (trimmed.length < 3) {
    return 'Title must be at least 3 characters long.'
  }
  
  if (trimmed.length > 100) {
    return 'Title must be 100 characters or less.'
  }
  
  return true
}