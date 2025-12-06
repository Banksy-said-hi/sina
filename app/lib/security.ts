/**
 * Security Utility Functions
 */

/**
 * Validate and sanitize an external URL
 * - Must be HTTPS
 * - Must not contain javascript: or data: protocols
 */
export function validateExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS and HTTP for external links
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      console.warn(`Invalid URL protocol: ${parsed.protocol}`);
      return false;
    }
    
    // Block localhost in production
    if (process.env.NODE_ENV === 'production' && 
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      console.warn('Localhost URLs not allowed in production');
      return false;
    }
    
    return true;
  } catch (error) {
    console.warn(`Invalid URL format: ${url}`);
    return false;
  }
}

/**
 * Sanitize user input for display
 * Escapes HTML special characters to prevent XSS
 */
export function sanitizeForDisplay(input: string): string {
  const div = document.createElement('div');
  div.textContent = input;
  return div.innerHTML;
}

/**
 * Validate email format (if needed in future)
 */
export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Remove potentially dangerous attributes from HTML
 * (Use for sanitizing rich text if needed in future)
 */
export function removeDangerousAttributes(html: string): string {
  // This is a simple implementation - consider using DOMPurify for production
  return html
    .replace(/on\w+\s*=/gi, '') // Remove event handlers
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:text\/html/gi, ''); // Remove data: protocol
}

/**
 * Rate limiting utility for API calls (for future use)
 */
export class RateLimiter {
  private timestamps: number[] = [];
  private maxRequests: number;
  private windowMs: number;

  constructor(maxRequests: number = 10, windowMs: number = 60000) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
  }

  isAllowed(): boolean {
    const now = Date.now();
    const cutoff = now - this.windowMs;

    // Remove timestamps outside the window
    this.timestamps = this.timestamps.filter((ts) => ts > cutoff);

    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(now);
      return true;
    }

    return false;
  }

  reset(): void {
    this.timestamps = [];
  }
}
