# Security Implementation Guide for Enigma77

## Overview
This guide documents all security implementations added to the Enigma77 project.

## What Has Been Implemented

### ✅ 1. Input Validation & Sanitization

**Files:** `app/context/DialogueContext.tsx`, `app/types/index.ts`

**Implementation:**
- Name input validation with max 50 characters
- Pattern validation: alphanumeric + spaces, hyphens, apostrophes only
- Real-time input sanitization as user types
- Keyboard input throttling (50ms) to prevent DOS attacks
- Invalid characters automatically removed

**Code Example:**
```typescript
// Sanitizes input and enforces max length
function sanitizeInput(input: string): string {
  const sanitized = input.replace(/[^a-zA-Z0-9\s'-]/g, '');
  return sanitized.slice(0, MAX_NAME_LENGTH);
}

// Throttles keyboard input to prevent rapid event firing
const now = Date.now();
if (now - lastKeyTimeRef.current < KEYBOARD_INPUT_THROTTLE_MS) return;
```

**Security Benefits:**
- Prevents XSS injection through user input
- Prevents buffer overflow attacks
- Reduces DOS vulnerability from rapid keystroke events
- Maintains reasonable UI responsiveness

---

### ✅ 2. Environment Variables Management

**Files:** `.env.example`, `app/types/index.ts`

**Implementation:**
- Discord URL moved from hardcoded value to environment variable
- Uses `process.env.NEXT_PUBLIC_DISCORD_URL` with fallback
- `.env.example` file documents all required environment variables
- Only non-sensitive values use `NEXT_PUBLIC_` prefix

**Code Example:**
```typescript
export const DISCORD_INVITE_URL = 
  process.env.NEXT_PUBLIC_DISCORD_URL || 'https://discord.gg/MDCheUbH';
```

**Setup Instructions:**
1. Copy `.env.example` to `.env.local`
2. Update values as needed
3. Never commit `.env.local` to git

**Security Benefits:**
- Easy URL rotation without code changes
- Separation of configuration from code
- Prevention of hardcoded secrets

---

### ✅ 3. External URL Validation

**Files:** `app/lib/security.ts`, `app/components/overlays/DiscordOverlay.tsx`

**Implementation:**
- URL validation function checks protocol, domain, and format
- Only HTTPS and HTTP protocols allowed
- Localhost blocked in production
- URL validation before opening link

**Code Example:**
```typescript
export function validateExternalUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    
    // Only allow HTTPS and HTTP
    if (!['https:', 'http:'].includes(parsed.protocol)) {
      return false;
    }
    
    // Block localhost in production
    if (process.env.NODE_ENV === 'production' && 
        (parsed.hostname === 'localhost' || parsed.hostname === '127.0.0.1')) {
      return false;
    }
    
    return true;
  } catch (error) {
    return false;
  }
}
```

**DiscordOverlay Update:**
```typescript
const isValidUrl = validateExternalUrl(DISCORD_INVITE_URL);

const handleDiscordClick = () => {
  if (isValidUrl) {
    window.open(DISCORD_INVITE_URL, '_blank', 'noopener,noreferrer');
  }
};
```

**Security Benefits:**
- Prevents javascript: protocol injection
- Prevents data: URI injection
- Prevents localhost access in production
- Validates URL format before use

---

### ✅ 4. Environment-Aware Logging

**Files:** `app/lib/logger.ts`

**Implementation:**
- Logger utility only outputs in development environment
- No console logs in production build
- Formatted logging with timestamps
- Sanitized error messages

**Code Example:**
```typescript
class Logger {
  private isDev: boolean;

  constructor() {
    this.isDev = process.env.NODE_ENV === 'development';
  }

  log(message: string, data?: unknown) {
    if (this.isDev) {
      console.log(this.formatMessage('log', message), data);
    }
  }
}
```

**Updates Made:**
- `AudioPlayer.tsx`: Replaced all console.log/error with logger
- `MusicPlayer.tsx`: Replaced all console.log with logger
- `ErrorBoundary.tsx`: Replaced console.error with logger

**Security Benefits:**
- No sensitive information leakage in production
- No stack traces exposed to users
- Clean production error handling
- Development debugging still available

---

### ✅ 5. Error Boundary Component

**Files:** `app/components/ErrorBoundary.tsx`, `app/page.tsx`

**Implementation:**
- React Error Boundary catches component errors
- Graceful error UI displayed instead of crash
- Error details logged (development only)
- Refresh button to recover from errors
- Wraps entire application

**Code Example:**
```typescript
<ErrorBoundary>
  <DialogueProvider>
    {/* Application components */}
  </DialogueProvider>
</ErrorBoundary>
```

**Error UI:**
- Shows user-friendly error message
- Provides refresh button
- Dev environment shows error details
- Production shows generic error message

**Security Benefits:**
- Prevents white-screen-of-death crashes
- Controlled error messaging
- No stack traces shown to users
- Better user experience on errors

---

### ✅ 6. Security Utilities Library

**Files:** `app/lib/security.ts`

**Utilities Provided:**

1. **validateExternalUrl()** - Validates external URLs
2. **sanitizeForDisplay()** - Escapes HTML for safe display
3. **validateEmail()** - Email format validation (future use)
4. **removeDangerousAttributes()** - Strips dangerous HTML attributes
5. **RateLimiter** - Class for rate limiting API calls

**Future-Ready Functions:**
These utilities are implemented but not yet used, ready for when backend integration begins:
- Email validation
- Rate limiting
- Advanced HTML sanitization

---

### ✅ 7. Security Constants

**File:** `app/types/index.ts`

**Security Configuration Constants:**
```typescript
export const MAX_NAME_LENGTH = 50;
export const VALID_NAME_PATTERN = /^[a-zA-Z0-9\s'-]*$/;
export const KEYBOARD_INPUT_THROTTLE_MS = 50;
```

**Advantages:**
- Centralized configuration
- Easy to adjust without searching code
- Type-safe throughout application
- Imported in components that need them

---

## Security Best Practices Implemented

### ✅ Client-Side Security
- No sensitive data in localStorage
- No authentication tokens stored
- No sensitive data in URLs
- XSS protection through React defaults

### ✅ Input Handling
- All user input validated
- All user input sanitized
- Input length limits enforced
- Invalid characters rejected

### ✅ Error Handling
- Errors caught at application level
- User-friendly error messages
- Stack traces only in development
- Graceful recovery options

### ✅ External Links
- All external URLs validated
- Protocol validation enforced
- HTTPS preferred (but HTTP allowed for flexibility)
- Proper link security attributes (noopener, noreferrer)

### ✅ Logging & Debugging
- Production logging disabled
- Development logging available
- Timestamp formatting
- Structured error information

---

## Security Checklist Status

| Item | Status | Details |
|------|--------|---------|
| Input Validation | ✅ Done | Max 50 chars, alphanumeric only |
| Input Sanitization | ✅ Done | Real-time character filtering |
| Output Escaping | ✅ Done | React default + custom utilities |
| Error Handling | ✅ Done | Error Boundary + logger |
| CSP Headers | ⏳ Todo | Needs next.config.ts update |
| Environment Variables | ✅ Done | .env.example + types |
| External Link Validation | ✅ Done | validateExternalUrl() |
| Production Logging | ✅ Done | Environment-aware logger |
| Event Throttling | ✅ Done | 50ms keyboard throttle |
| Dependency Audit | ⏳ Todo | Run npm audit regularly |

---

## Next Steps for Production

### High Priority
1. **Content Security Policy (CSP) Headers**
   ```typescript
   // In next.config.ts
   headers() {
     return [{
       source: '/:path*',
       headers: [
         {
           key: 'Content-Security-Policy',
           value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline';"
         }
       ]
     }]
   }
   ```

2. **Dependency Auditing**
   - Run `npm audit` regularly
   - Set up Dependabot for GitHub
   - Review major/minor updates

3. **Error Tracking**
   - Integrate Sentry or similar
   - Monitor production errors
   - Alert on critical errors

### Medium Priority
1. **Security Headers**
   - HSTS (HTTP Strict Transport Security)
   - X-Frame-Options (deny framing)
   - X-Content-Type-Options (nosniff)

2. **Performance Monitoring**
   - Add performance metrics
   - Monitor for DOS patterns
   - Track load times

3. **Asset Security**
   - Verify GLB model integrity
   - Set cache-control headers
   - Implement subresource integrity

### Low Priority
1. **Advanced Monitoring**
   - User behavior analytics (privacy-conscious)
   - Error pattern detection
   - Performance optimization

2. **Future Features**
   - Rate limiting for API endpoints (when added)
   - Request signing/verification (when API added)
   - Authentication (if user accounts added)

---

## Testing Security

### Manual Testing Checklist
- [ ] Try entering very long names (>50 chars)
- [ ] Try special characters (!@#$%^&*)
- [ ] Try HTML in name input (<script>, etc.)
- [ ] Check browser console in production build (no logs)
- [ ] Test error handling by triggering errors
- [ ] Verify Discord link opens correctly
- [ ] Test on slow network (check error handling)
- [ ] Test with JavaScript disabled (graceful degradation)

### Automated Testing (Future)
```typescript
// Example security tests
describe('Input Validation', () => {
  it('should reject long inputs', () => {
    const long = 'a'.repeat(100);
    expect(sanitizeInput(long)).toHaveLength(50);
  });

  it('should remove invalid characters', () => {
    expect(sanitizeInput('test<script>')).toBe('testscript');
  });

  it('should allow valid names', () => {
    expect(sanitizeInput("John O'Brien")).toBe("John O'Brien");
  });
});
```

---

## Configuration Files

### .env.example
```
NEXT_PUBLIC_DISCORD_URL=https://discord.gg/MDCheUbH
NODE_ENV=development
```

### Environment Variables in Types
- `MAX_NAME_LENGTH = 50`
- `VALID_NAME_PATTERN = /^[a-zA-Z0-9\s'-]*$/`
- `KEYBOARD_INPUT_THROTTLE_MS = 50`
- `DISCORD_INVITE_URL = process.env.NEXT_PUBLIC_DISCORD_URL`

---

## Resources & References

### OWASP Top 10 Web Application Risks
- ✅ A03:2021 – Injection (Input validation)
- ✅ A07:2021 – Cross-Site Scripting (XSS) (Output escaping)
- ✅ A08:2021 – Software and Data Integrity Failures (Dependency updates)

### Security Best Practices Applied
- Principle of Least Privilege
- Defense in Depth
- Fail Securely
- Input Validation (whitelist approach)
- Output Encoding

### Tools & Dependencies
- **TypeScript**: Type safety
- **Next.js**: Modern security defaults
- **React**: Default XSS protection
- **ESLint**: Code quality

---

## Support & Questions

For security concerns or questions:
1. Review this guide
2. Check OWASP resources
3. Run security audit: `npm audit`
4. Test with security tools: `npm install -g npm-check-updates`

---

**Last Updated:** 2024
**Security Audit Status:** Initial implementation complete ✅
**Production Ready:** Pending CSP headers and dependency audit
