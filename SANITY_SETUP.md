# Sanity CMS Setup Guide

Your website is now **CMS-ready**! Follow these steps to enable client editing through Sanity CMS.

## Current Status ✅

- ✅ Sanity client dependencies installed
- ✅ Environment variables configured
- ✅ Content validation and safety systems in place
- ✅ TypeScript types defined
- ✅ Fallback content system working
- ✅ Components ready for CMS integration

## Next Steps to Enable Client Editing

### Step 1: Create Sanity Project

1. **Go to [sanity.io](https://sanity.io)** and create a free account
2. **Create a new project** in the Sanity dashboard
3. **Choose a project name** (e.g., "My Business Website")
4. **Select dataset name** (use "production")
5. **Note your Project ID** - you'll need this next

### Step 2: Update Environment Variables

Update your `.env.local` file with your actual Sanity project details:

```bash
# Replace these with your actual Sanity project details
NEXT_PUBLIC_SANITY_PROJECT_ID=your-actual-project-id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
SANITY_API_TOKEN=your-api-token-if-needed
```

### Step 3: Set Up Sanity Studio

You have two options for the Sanity Studio:

#### Option A: Hosted Studio (Recommended)
- Use Sanity's hosted studio at `yourproject.sanity.studio`
- No additional setup required
- Accessible from anywhere

#### Option B: Local Studio
- Run the studio locally alongside your website
- More control over customization

### Step 4: Create Content Schemas

In your Sanity project, you'll need to create schemas for:

1. **Site Settings** - Logo, contact info, social links
2. **Home Page** - Hero content, services section
3. **About Page** - Hero content, rich text content
4. **Services Page** - Hero content, services list
5. **Services** - Individual service items
6. **Navigation** - Menu items

### Step 5: Add Initial Content

Once your schemas are set up, add your initial content:

1. **Site Settings**: Company name, logo, contact details
2. **Services**: Create your service offerings
3. **Page Content**: Add content for home, about, and services pages
4. **Navigation**: Set up your menu structure

## What Your Client Can Edit

Once connected, your client can safely edit:

- ✏️ **Headlines and text** on all pages
- 🖼️ **Images** and background images
- 🔗 **Button text and links**
- 📋 **Services** (add, remove, edit)
- 📞 **Contact information**
- 🔗 **Social media links**
- 🎯 **SEO settings** (titles, descriptions)

## What They CAN'T Break

- 🔒 **Website layout and design**
- 🔒 **Navigation structure**
- 🔒 **Responsive behavior**
- 🔒 **Site performance**
- 🔒 **Security features**

## Testing the Connection

After setup, you can test the connection by:

1. **Restart your development server**: `npm run dev`
2. **Check the console** - you should see "Sanity not configured" messages disappear
3. **Add content in Sanity** and see it appear on your website
4. **Verify fallback behavior** by temporarily breaking the connection

## Need Help?

If you run into issues:

1. **Check the console** for error messages
2. **Verify environment variables** are correct
3. **Ensure Sanity project is published**
4. **Check network connectivity**

The website will always work with fallback content, so you can't break it during setup!

## Next Steps After Setup

Once Sanity is connected:

1. **Train your client** on using the Sanity Studio
2. **Set up content workflows** (draft/publish)
3. **Configure user permissions** if needed
4. **Set up webhooks** for automatic deployments (optional)
5. **Add more content types** as needed

Your website is designed to be completely client-safe - they can edit content without any risk of breaking the layout or functionality!