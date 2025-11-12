
/**
 * Font configuration for airline-specific deployments
 * 
 * Usage:
 * 1. Set the airline font in your deployment script or environment variable
 * 2. Call setAirlineFont() on app initialization with the airline code
 * 
 * Example airline font mappings:
 * - default: 'Poppins'
 * - airline1: 'Open Sans'
 * - airline2: 'Roboto'
 * - airline3: 'Montserrat'
 */

export const AIRLINE_FONTS: Record<string, string> = {
  default: "'Poppins', sans-serif",
  openSans: "'Open Sans', sans-serif",
  // Add more airline-specific fonts here
  // airline1: "'Open Sans', sans-serif",
  // airline2: "'Roboto', sans-serif",
};

/**
 * Sets the airline-specific font by updating the CSS custom property
 * @param airlineCode - The code identifying the airline (e.g., 'airline1', 'airline2')
 */
export function setAirlineFont(airlineCode: string = 'default'): void {
  const fontFamily = AIRLINE_FONTS[airlineCode] || AIRLINE_FONTS.default;
  
  // Update the CSS custom property on the root element
  document.documentElement.style.setProperty('--airline-font-family', fontFamily);
}

/**
 * Gets the current airline font setting
 * @returns The current font family
 */
export function getCurrentAirlineFont(): string {
  return getComputedStyle(document.documentElement)
    .getPropertyValue('--airline-font-family')
    .trim();
}

/**
 * Initialize font from environment variable or localStorage
 * This should be called early in your application bootstrap
 */
export function initializeAirlineFont(): void {
  // Priority: URL parameter > localStorage > environment > default
  const urlParams = new URLSearchParams(window.location.search);
  const urlAirline = urlParams.get('airline');
  
  const storedAirline = localStorage.getItem('airlineCode');
  const envAirline = import.meta.env.VITE_AIRLINE_CODE;
  
  const airlineCode = urlAirline || storedAirline || envAirline || 'default';
  
  // Store in localStorage if coming from URL
  if (urlAirline) {
    localStorage.setItem('airlineCode', urlAirline);
  }
  
  setAirlineFont(airlineCode);
}
