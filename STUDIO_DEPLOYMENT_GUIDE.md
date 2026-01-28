# Sanity Studio Deployment Guide

## Option 1: Manual Dashboard Setup (Recommended)

Since we're having CLI issues, let's use the Sanity dashboard:

### Step 1: Access Your Sanity Dashboard
1. Go to https://sanity.io/manage
2. Select your project: **K&K Designs** (Project ID: l8zvozfy)

### Step 2: Add a Hosted Studio
1. Click on **"Studios"** in the left sidebar
2. Click **"Add Studio"** button
3. Choose **"Create new studio"**
4. Enter studio name: `k-and-k-designs-studio`
5. This will create a URL like: `https://k-and-k-designs-studio.sanity.studio`

### Step 3: Upload Your Studio Configuration
You'll need to upload your studio files. The key files are:
- `sanity.config.ts` (your studio configuration)
- `schemas/` folder (all your content schemas)

### Step 4: Invite Your Client
1. Go to **"Members"** in the left sidebar
2. Click **"Invite member"**
3. Enter your client's email
4. Set role to **"Editor"** (allows content editing but not project settings)
5. Send invitation

### Step 5: Share Studio URL with Client
Once deployed, share this URL with your client:
`https://k-and-k-designs-studio.sanity.studio`

## Option 2: Alternative - Use Sanity's Built-in Studio

If the above doesn't work, you can use Sanity's default studio:

1. Go to your project dashboard
2. Click **"Content"** in the left sidebar
3. This opens the built-in studio at: `https://l8zvozfy.sanity.studio`
4. Share this URL with your client

## Client Access Instructions

Send these instructions to your client:

---

**How to Edit Your Website Content**

1. Go to: [Your Studio URL]
2. Sign in with Google, GitHub, or email (same as you used for Sanity)
3. You'll see different content types:
   - **Home Page**: Edit homepage content
   - **About Page**: Edit about page content  
   - **Services Page**: Edit services page content
   - **Services**: Add/edit individual services
   - **Site Settings**: Edit site-wide settings

4. To edit content:
   - Click on any content type
   - Make your changes
   - Click **"Publish"** to make changes live on the website

5. Changes appear on your website immediately after publishing

---

## Troubleshooting

If you have issues:
1. Make sure you're logged into Sanity with the same account
2. Check that your client has been invited as a member
3. Verify the studio URL is correct
4. Contact support if needed