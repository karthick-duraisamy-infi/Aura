
# Airline Font Deployment Guide

This application uses a dynamic font system that allows different airlines to use their preferred font families.

## Default Font

The application uses **Poppins** as the default font family across all pages and components.

## How It Works

The font system uses CSS custom properties (variables) to enable runtime font switching:

- `--airline-font-family`: The dynamic font variable that changes based on airline
- `--font-sans`: The actual font used throughout the app, referencing `--airline-font-family`

## Deployment Options

### Option 1: Environment Variable (Build Time)

Set the `VITE_AIRLINE_CODE` environment variable during deployment:

```bash
# For airline using Open Sans
VITE_AIRLINE_CODE=openSans npm run build

# For default Poppins
VITE_AIRLINE_CODE=default npm run build
```

### Option 2: URL Parameter (Runtime)

Access the app with an airline code in the URL:

```
https://yourapp.com?airline=openSans
```

This will automatically set the font and persist it in localStorage.

### Option 3: localStorage (Runtime)

Programmatically set the airline code:

```javascript
localStorage.setItem('airlineCode', 'openSans');
window.location.reload();
```

### Option 4: Programmatic API (Runtime)

Use the font configuration API in your code:

```javascript
import { setAirlineFont } from './lib/fontConfig';

// Switch to Open Sans
setAirlineFont('openSans');

// Switch to default Poppins
setAirlineFont('default');
```

## Adding New Airline Fonts

1. Add the font to Google Fonts link in `client/index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&family=Open+Sans:wght@300;400;500;600;700&family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet" />
```

2. Update the `AIRLINE_FONTS` mapping in `client/src/lib/fontConfig.ts`:

```typescript
export const AIRLINE_FONTS: Record<string, string> = {
  default: "'Poppins', sans-serif",
  openSans: "'Open Sans', sans-serif",
  airline1: "'Roboto', sans-serif",
  airline2: "'Montserrat', sans-serif",
};
```

## Priority Order

The system checks for airline codes in this order:

1. URL parameter (`?airline=xxx`)
2. localStorage value
3. Environment variable (`VITE_AIRLINE_CODE`)
4. Default (Poppins)

## Testing

To test different fonts locally:

```
http://localhost:5000?airline=openSans
http://localhost:5000?airline=default
```
