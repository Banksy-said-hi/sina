# Google Analytics Setup Guide for Enigma77

## Quick Start

### 1. Create a Google Analytics 4 Property

1. Go to [Google Analytics](https://analytics.google.com)
2. Sign in with your Google account
3. Click **"Start measuring"** or go to **Admin** → **Create Property**
4. Fill in property details:
   - Property name: `Enigma77`
   - Reporting timezone: Your timezone
   - Currency: Your currency
5. Click **Create**

### 2. Get Your Measurement ID

1. In Google Analytics Admin panel, go to **Data Streams**
2. Select **Web** (create one if needed)
3. Enter your website URL (e.g., `https://enigma77.com`)
4. Click **Create stream**
5. Copy the **Measurement ID** (format: `G-XXXXXXXXXX`)

### 3. Add to Environment Variables

1. Open `.env.local` (create it from `.env.example` if it doesn't exist):
   ```bash
   cp .env.example .env.local
   ```

2. Add your Measurement ID:
   ```
   NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
   ```

3. Save the file

4. Restart your Next.js dev server:
   ```bash
   npm run dev
   ```

### 4. Verify It's Working

1. Visit your website
2. Go to Google Analytics → **Real time** → **Overview**
3. Perform an action (click sphere, submit name, etc.)
4. You should see the events appear in real-time

---

## Events Being Tracked

### Interaction Events

| Event | Tracked When |
|-------|--------------|
| `sphere_click` | User clicks the 3D sphere (tracked with click number) |
| `name_input_started` | User begins entering their name |
| `name_input_character_added` | Each character added to name input |
| `name_input_character_removed` | Each backspace in name input |
| `name_submitted` | User submits their name (tracked with name length) |

### Animation Events

| Event | Tracked When |
|-------|--------------|
| `scatter_animation_started` | Particles begin scattering animation |
| `scatter_animation_completed` | Scatter animation finishes |

### Reward Events

| Event | Tracked When |
|-------|--------------|
| `discord_invitation_viewed` | Discord invitation overlay appears |
| `discord_link_clicked` | User clicks the "Join Discord" button |

### Navigation Events

| Event | Tracked When |
|-------|--------------|
| `menu_opened` | Hamburger menu opened |
| `menu_item_clicked` | User clicks menu item (tracked with item label) |

### Error Events

| Event | Tracked When |
|-------|--------------|
| `error_occurred` | An error is caught (tracked with error type) |

### Session Events

| Event | Tracked When |
|-------|--------------|
| `session_duration` | User session ends (tracked with duration in seconds) |

---

## Using Analytics in Development

### View Real-Time Data

1. Open Google Analytics dashboard
2. Click **Real time** in the left menu
3. Perform actions on your website
4. Events appear instantly

### Create a Custom Report

1. Click **Reports** in left menu
2. Click **Create new report**
3. Select **Exploration** or **Funnel**
4. Choose metrics like:
   - Events (to see which actions are most common)
   - User journey (to see progression through riddle)
   - Conversion funnel (sphere clicks → name submission → discord click)

### Set Up Goals/Conversions

Track important milestones:

1. Click **Admin** → **Conversions** → **Create conversion event**
2. Enter name: `discord_click`
3. Choose event type: `Event`
4. Select **discord_link_clicked** from dropdown
5. Click **Create**

Repeat for:
- `name_submitted`
- `scatter_animation_completed`

---

## Code Reference

### Tracking an Event Programmatically

```typescript
import { analyticsEvents } from '@/app/lib/analyticsEvents';

// Track sphere click
analyticsEvents.sphereClicked(5); // click number 5

// Track name submission
analyticsEvents.nameSubmitted(8); // name is 8 characters long

// Track Discord click
analyticsEvents.discordLinkClicked();
```

### Creating New Analytics Events

Add to `app/lib/analyticsEvents.ts`:

```typescript
myCustomEvent: (params: any) => {
  trackEvent('my_custom_event', params);
}
```

Then use in code:
```typescript
import { analyticsEvents } from '@/app/lib/analyticsEvents';

analyticsEvents.myCustomEvent({ custom_param: 'value' });
```

---

## Privacy & Data Handling

### Compliance Notes

1. **GDPR Compliance**: Add cookie consent before enabling analytics
   - Users must opt-in before tracking
   - Provide clear privacy policy
   - Allow users to disable tracking

2. **Data Retention**: Google Analytics retains data for:
   - 14 months by default (events)
   - 26 months (user-ID data)
   - You can adjust in Admin settings

3. **No Personal Data**: Current implementation:
   - ✅ No user names are sent to GA (just length)
   - ✅ No IP addresses stored
   - ✅ No sensitive information tracked
   - ✅ Anonymous event tracking only

### Add Cookie Consent (Recommended)

Install a cookie consent library:

```bash
npm install @react-cookie-consent/react-cookie-consent
```

Then add to your layout:

```typescript
import CookieConsent from "react-cookie-consent";

export default function Home() {
  return (
    <>
      <GoogleAnalytics />
      
      <CookieConsent>
        This website uses cookies to enhance your experience. 
        We also use analytics to understand how you use our site.
      </CookieConsent>
      
      {/* Rest of app */}
    </>
  );
}
```

---

## Common Issues & Troubleshooting

### Issue: Events not appearing in Real-time

**Solution:**
1. Check that `NEXT_PUBLIC_GA_ID` is set correctly
2. Verify Measurement ID format: `G-XXXXXXXXXX`
3. Check browser console for errors (F12)
4. Clear browser cache and refresh
5. Use Google Analytics debugger (see below)

### Issue: Data not persisting

**Solution:**
1. Make sure environment variable is prefixed with `NEXT_PUBLIC_`
2. Restart dev server after changing `.env.local`
3. Check that build includes GA configuration

### Issue: Wrong events are recorded

**Solution:**
1. Check event names in `app/lib/analyticsEvents.ts`
2. Verify event calls are in correct components
3. Check browser console for JavaScript errors

---

## Advanced: Use Google Analytics Debugger

1. Install Chrome extension: **Google Analytics Debugger**
2. Open DevTools (F12) → **Google Analytics** tab
3. Perform actions on website
4. See real-time event data being sent to Google Analytics

---

## Analyzing User Journeys

Create a Funnel report to see progression:

1. **Admin** → **Reports** → **Create new report** → **Funnel exploration**
2. Add steps:
   - Step 1: `sphere_click` (to get past initial interaction)
   - Step 2: `name_submitted` (completed naming phase)
   - Step 3: `discord_link_clicked` (final conversion)
3. View:
   - How many users complete each step
   - Where users drop off
   - Conversion rate through riddle

---

## Dashboard Example

Recommended dashboard setup:

1. **Real-time users** (card)
2. **Top events** (table)
3. **Event count over time** (line chart)
4. **Funnel: sphere → name → discord** (funnel chart)
5. **User journey** (flow chart)

---

## Disabling Analytics for Development

To disable GA during development:

```typescript
// In .env.local
NEXT_PUBLIC_GA_ID=  # Leave empty to disable
```

Or add in `app/lib/analytics.ts`:

```typescript
if (process.env.NODE_ENV === 'development') {
  return null; // Don't load GA in development
}
```

---

## Next Steps

1. ✅ Set up Google Analytics property
2. ✅ Get Measurement ID
3. ✅ Add to `.env.local`
4. ✅ Test with real-time dashboard
5. ⏳ Set up custom reports/dashboards
6. ⏳ Add cookie consent (for production)
7. ⏳ Monitor performance and user behavior
8. ⏳ Optimize based on analytics data

---

## Support

- [Google Analytics Documentation](https://support.google.com/analytics)
- [GA4 Help Center](https://support.google.com/analytics#topic=11139018)
- [gtag.js Documentation](https://developers.google.com/analytics/devguides/collection/ga4)

---

**Last Updated:** December 2025
**Status:** Ready for production use ✅
