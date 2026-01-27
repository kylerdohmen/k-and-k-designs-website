#!/usr/bin/env node

/**
 * Verification Script: No Backend Implementation
 * 
 * This script verifies that the marketing website scaffold contains
 * no backend implementation, only client-side code with placeholder
 * comments for future API integration.
 * 
 * Requirements: 5.4
 */

const fs = require('fs');
const path = require('path');

// Directories to check for backend implementation
const checkDirectories = [
  'src/app',
  'src/lib',
  'src/components'
];

// Patterns that indicate backend implementation
const backendPatterns = [
  /src\/app\/api\//,                    // API routes directory
  /getServerSideProps/,                 // Server-side rendering
  /getStaticProps/,                     // Static generation with server logic
  /NextApiRequest/,                     // API request types
  /NextApiResponse/,                    // API response types
  /export\s+async\s+function\s+POST/,   // API route handlers
  /export\s+async\s+function\s+GET/,    // API route handlers (except generateMetadata)
  /export\s+async\s+function\s+PUT/,    // API route handlers
  /export\s+async\s+function\s+DELETE/, // API route handlers
  /import.*next\/server/,               // Server utilities
  /import.*express/,                    // Express server
  /import.*fastify/,                    // Fastify server
  /import.*koa/,                        // Koa server
];

// Allowed patterns that look like backend but are actually client-side
const allowedPatterns = [
  /generateMetadata/,                   // Next.js metadata generation
  /generateStaticParams/,               // Next.js static params
];

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const violations = [];
  
  for (const pattern of backendPatterns) {
    const matches = content.match(pattern);
    if (matches) {
      // Check if this is an allowed pattern
      const isAllowed = allowedPatterns.some(allowedPattern => 
        allowedPattern.test(matches[0])
      );
      
      if (!isAllowed) {
        violations.push({
          pattern: pattern.toString(),
          match: matches[0],
          line: content.substring(0, content.indexOf(matches[0])).split('\n').length
        });
      }
    }
  }
  
  return violations;
}

function checkDirectory(dirPath) {
  const violations = [];
  
  if (!fs.existsSync(dirPath)) {
    return violations;
  }
  
  const items = fs.readdirSync(dirPath, { withFileTypes: true });
  
  for (const item of items) {
    const itemPath = path.join(dirPath, item.name);
    
    if (item.isDirectory()) {
      violations.push(...checkDirectory(itemPath));
    } else if (item.isFile() && (item.name.endsWith('.ts') || item.name.endsWith('.tsx') || item.name.endsWith('.js') || item.name.endsWith('.jsx'))) {
      const fileViolations = checkFile(itemPath);
      if (fileViolations.length > 0) {
        violations.push({
          file: itemPath,
          violations: fileViolations
        });
      }
    }
  }
  
  return violations;
}

function main() {
  console.log('🔍 Verifying no backend implementation exists...\n');
  
  let totalViolations = 0;
  
  // Check for API routes directory
  const apiRoutesPath = 'src/app/api';
  if (fs.existsSync(apiRoutesPath)) {
    console.log('❌ VIOLATION: API routes directory exists at src/app/api');
    totalViolations++;
  } else {
    console.log('✅ No API routes directory found');
  }
  
  // Check source files for backend patterns
  for (const directory of checkDirectories) {
    console.log(`\n📁 Checking ${directory}...`);
    const violations = checkDirectory(directory);
    
    if (violations.length === 0) {
      console.log(`✅ No backend implementation found in ${directory}`);
    } else {
      console.log(`❌ VIOLATIONS found in ${directory}:`);
      for (const violation of violations) {
        console.log(`   File: ${violation.file}`);
        for (const v of violation.violations) {
          console.log(`     Line ${v.line}: ${v.match} (pattern: ${v.pattern})`);
        }
      }
      totalViolations += violations.length;
    }
  }
  
  // Check for placeholder comments
  console.log('\n📝 Checking for future API integration placeholders...');
  const sanityClientPath = 'src/lib/sanity.client.ts';
  if (fs.existsSync(sanityClientPath)) {
    const content = fs.readFileSync(sanityClientPath, 'utf8');
    const todoComments = content.match(/TODO:.*API/gi) || [];
    
    if (todoComments.length > 0) {
      console.log(`✅ Found ${todoComments.length} API integration placeholders:`);
      todoComments.forEach(comment => {
        console.log(`   - ${comment.trim()}`);
      });
    } else {
      console.log('⚠️  No API integration placeholders found');
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  if (totalViolations === 0) {
    console.log('✅ VERIFICATION PASSED: No backend implementation found');
    console.log('   The scaffold contains only client-side code with proper');
    console.log('   placeholder comments for future API integration.');
    process.exit(0);
  } else {
    console.log(`❌ VERIFICATION FAILED: ${totalViolations} violations found`);
    console.log('   Backend implementation detected in the scaffold.');
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}

module.exports = { checkFile, checkDirectory };