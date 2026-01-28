import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

// This is a secret token to secure the webhook
const REVALIDATE_SECRET = process.env.SANITY_REVALIDATE_SECRET || 'your-secret-token'

export async function POST(request: NextRequest) {
  try {
    // Check for secret to confirm this is a valid request
    const secret = request.nextUrl.searchParams.get('secret')
    
    if (secret !== REVALIDATE_SECRET) {
      return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
    }

    // Get the webhook payload
    const body = await request.json()
    
    // Log the webhook for debugging
    console.log('Received Sanity webhook:', {
      type: body._type,
      id: body._id,
      action: body._action || 'unknown'
    })

    // Revalidate based on the document type
    switch (body._type) {
      case 'homePage':
        await revalidatePath('/')
        console.log('Revalidated home page')
        break
        
      case 'aboutPage':
        await revalidatePath('/about')
        console.log('Revalidated about page')
        break
        
      case 'servicesPage':
        await revalidatePath('/services')
        console.log('Revalidated services page')
        break
        
      case 'contactPage':
        await revalidatePath('/contact')
        console.log('Revalidated contact page')
        break
        
      case 'service':
        // Revalidate all pages that might show services
        await revalidatePath('/')
        await revalidatePath('/services')
        console.log('Revalidated service-related pages')
        break
        
      case 'siteSettings':
        // Revalidate all pages since site settings affect the entire site
        await revalidatePath('/', 'layout')
        console.log('Revalidated entire site for settings change')
        break
        
      default:
        // For any other document type, revalidate the home page
        await revalidatePath('/')
        console.log('Revalidated home page for unknown document type:', body._type)
    }

    return NextResponse.json({ 
      message: 'Revalidation successful',
      revalidated: true,
      now: Date.now()
    })
    
  } catch (error) {
    console.error('Error in revalidation webhook:', error)
    return NextResponse.json(
      { message: 'Error revalidating', error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Also handle GET requests for testing
export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  
  if (secret !== REVALIDATE_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 })
  }

  // Test revalidation
  await revalidatePath('/')
  
  return NextResponse.json({ 
    message: 'Test revalidation successful',
    timestamp: new Date().toISOString()
  })
}