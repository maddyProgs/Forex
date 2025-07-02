const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Building and deploying trading widget...\n');

try {
  // Step 1: Build the widget
  console.log('📦 Building widget...');
  execSync('npm run build-widget', { stdio: 'inherit' });
  console.log('✅ Widget built successfully!\n');
  
  // Step 2: Check if files exist
  const widgetDir = path.join(__dirname, 'dist', 'widget');
  if (!fs.existsSync(widgetDir)) {
    throw new Error('Widget build directory not found');
  }
  
  const files = fs.readdirSync(widgetDir);
  console.log('📁 Generated files:');
  files.forEach(file => {
    const filePath = path.join(widgetDir, file);
    const stats = fs.statSync(filePath);
    console.log(`   ${file} (${(stats.size / 1024).toFixed(2)} KB)`);
  });
  console.log('');
  
  // Step 3: Create widget loader
  const loaderScript = `
(function() {
  'use strict';
  
  // Widget configuration
  const WIDGET_CONFIG = {
    apiUrl: 'https://fastapi-1-zl38.onrender.com',
    version: '1.0.0'
  };
  
  // Load Angular widget bundle
  function loadWidget() {
    const script = document.createElement('script');
    script.src = window.location.origin + '/widget/main.js';
    script.async = true;
    script.onload = function() {
      console.log('Trading widget loaded successfully');
    };
    script.onerror = function() {
      console.error('Failed to load trading widget');
    };
    document.head.appendChild(script);
  }
  
  // Auto-load when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', loadWidget);
  } else {
    loadWidget();
  }
})();
`;
  
  fs.writeFileSync(path.join(widgetDir, 'widget-loader.js'), loaderScript);
  console.log('✅ Widget loader created!\n');
  
  // Step 4: Create deployment instructions
  const instructions = `
# Trading Widget Deployment Guide

## Files to Deploy:
${files.map(file => `- ${file}`).join('\n')}
- widget-loader.js (auto-generated)

## Client Integration:

### Option 1: Direct Integration
\`\`\`html
<script src="https://your-domain.com/widget/main.js"></script>
<trading-widget client-id="your-client-id"></trading-widget>
\`\`\`

### Option 2: Using Widget Loader
\`\`\`html
<script src="https://your-domain.com/widget/widget-loader.js"></script>
<trading-widget client-id="your-client-id"></trading-widget>
\`\`\`

## Local Testing:
1. Run: npm run serve-demo
2. Visit: http://localhost:3000
3. Test widget functionality

## Production Deployment:
1. Upload all files from dist/widget/ to your CDN/server
2. Update client integration URLs
3. Test on client websites

Generated on: ${new Date().toISOString()}
`;
  
  fs.writeFileSync(path.join(widgetDir, 'DEPLOYMENT.md'), instructions);
  console.log('✅ Deployment instructions created!\n');
  
  console.log('🎉 Build and deployment preparation complete!');
  console.log('📂 Widget files are ready in: dist/widget/');
  console.log('🚀 Start demo server with: npm run serve-demo');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}