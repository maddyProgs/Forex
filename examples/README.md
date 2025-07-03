# Forex Signals Web Components - Integration Examples

This directory contains examples showing how to integrate the Forex Signals web components into your client applications.

## Available Components

### `<forex-signal-grid>`
Displays a grid of trading signals with the following attributes:
- `api-url`: FastAPI backend URL (default: "http://localhost:8000")
- `max-signals`: Maximum number of signals to display (default: 12)
- `theme`: UI theme - "light" or "dark" (default: "light")
- `show-trading-view`: Show TradingView widgets (default: true)

**Events:**
- `signalSelected`: Fired when a signal is clicked (event.detail contains signal data)
- `signalError`: Fired when an error occurs (event.detail contains error message)

### `<forex-signal-detail>`
Displays detailed information for a single trading signal:
- `api-url`: FastAPI backend URL (default: "http://localhost:8000")
- `signal-id`: ID of the signal to display
- `signal`: Direct signal object (alternative to signal-id)
- `theme`: UI theme - "light" or "dark" (default: "light")

**Events:**
- `backClicked`: Fired when the back button is clicked
- `signalError`: Fired when an error occurs (event.detail contains error message)

## Examples

### 1. Basic Integration (`basic-integration.html`)
Simple example showing:
- Basic widget setup
- Event handling between grid and detail components
- Configuration options

### 2. Advanced Integration (`advanced-integration.html`)
Advanced example featuring:
- Dynamic configuration updates
- API connection testing
- Tabbed interface
- Multiple widget instances
- Real-time configuration changes

## Quick Start

1. **Build the web components:**
   ```bash
   cd /path/to/your/angular/project
   node src/buildWebComponent.js
   ```

2. **Start your FastAPI backend:**
   ```bash
   cd fastapi
   python -m uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
   ```

3. **Serve the examples:**
   ```bash
   # Simple HTTP server
   python -m http.server 8080
   # or
   npx serve .
   ```

4. **Open in browser:**
   - Basic: `http://localhost:8080/examples/basic-integration.html`
   - Advanced: `http://localhost:8080/examples/advanced-integration.html`

## Integration Steps

### 1. Include the Web Component Loader

```html
<!-- Option 1: Use the loader script (recommended) -->
<script>
  // Optional: Configure before loading
  window.ForexWidgetConfig = {
    apiUrl: 'https://your-api-url.com',
    maxSignals: 10,
    theme: 'dark'
  };
</script>
<script src="path/to/dist/web-component/loader.js"></script>

<!-- Option 2: Load scripts manually -->
<script src="path/to/dist/web-component/polyfills.js"></script>
<script src="path/to/dist/web-component/main.js"></script>
```

### 2. Add Components to Your HTML

```html
<!-- Signal Grid -->
<forex-signal-grid 
  api-url="https://your-fastapi-url.com"
  max-signals="12"
  theme="light"
  show-trading-view="true">
</forex-signal-grid>

<!-- Signal Detail -->
<forex-signal-detail 
  api-url="https://your-fastapi-url.com"
  signal-id="your-signal-id"
  theme="light">
</forex-signal-detail>
```

### 3. Handle Events

```javascript
document.addEventListener('DOMContentLoaded', function() {
  const signalGrid = document.querySelector('forex-signal-grid');
  const signalDetail = document.querySelector('forex-signal-detail');

  // Handle signal selection
  signalGrid.addEventListener('signalSelected', function(event) {
    const signal = event.detail;
    signalDetail.setAttribute('signal-id', signal._id);
  });

  // Handle errors
  signalGrid.addEventListener('signalError', function(event) {
    console.error('Error:', event.detail);
  });
});
```

## FastAPI Backend Requirements

Your FastAPI backend should provide these endpoints:

- `GET /get-signals/` - Returns list of signals
- `GET /get-signal/{signal_id}` - Returns specific signal details

Expected response format:
```json
{
  "signals": "[{\"_id\": \"...\", \"symbol\": \"EURUSD\", \"Entry\": \"1.0850\", ...}]"
}
```

## Customization

### Styling
The components use CSS custom properties for theming. You can override styles:

```css
forex-signal-grid {
  --primary-color: #your-color;
  --background-color: #your-bg;
  --text-color: #your-text;
}
```

### Configuration
Set global configuration before loading:

```javascript
window.ForexWidgetConfig = {
  apiUrl: 'https://your-api.com',
  maxSignals: 20,
  theme: 'dark',
  showTradingView: false
};
```

## Troubleshooting

1. **Components not loading:** Check browser console for errors and ensure all scripts are loaded
2. **API errors:** Verify FastAPI backend is running and CORS is configured
3. **Styling issues:** Check CSS conflicts and ensure component styles are loaded
4. **Events not firing:** Ensure event listeners are added after DOM is loaded

## Browser Support

- Chrome 60+
- Firefox 63+
- Safari 10.1+
- Edge 79+

For older browsers, the polyfills are automatically loaded.
