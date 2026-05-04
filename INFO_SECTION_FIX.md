# Info Section Visibility Fix

## Problem
The blue info section (displaying distance estimation and live status) was always visible on the page, even before starting a trip.

## Solution
Hide the `#info` section by default and show it only when a trip is started (or simulation is running).

## Changes Made

### 1. CSS (`css/style.css`)

**Before:**
```css
#info, #liveStatus {
    text-align: center;
    margin-bottom: 15px;
    font-size: 16px;
    color: var(--text-secondary);
    padding: 12px;
    border-radius: var(--radius-sm);
    background: var(--primary-light);
    border-left: 4px solid var(--primary);
}
```

**After:**
```css
#info {
    display: none;  /* Hidden by default */
}

#info.active, #liveStatus {
    display: block !important;  /* Shown when active */
    text-align: center;
    margin-bottom: 15px;
    font-size: 16px;
    color: var(--text-secondary);
    padding: 12px;
    border-radius: var(--radius-sm);
    background: var(--primary-light);
    border-left: 4px solid var(--primary);
}
```

### 2. JavaScript (`js/app.js`)

#### When Trip Starts
Added in `startBtn.onclick` function:
```javascript
// Show info section when trip starts
if (document.getElementById('info')) {
    document.getElementById('info').classList.add('active');
}
```

#### When Trip Stops
Added in `stopBtn.onclick` function:
```javascript
// Hide info section when trip stops
if (document.getElementById('info')) {
    document.getElementById('info').classList.remove('active');
}
```

## How It Works

1. **Default State**: Info section is hidden with `display: none`
2. **Trip Starts**: JavaScript adds `active` class when user clicks "Démarrer"
3. **Active State**: CSS shows the section with blue styling and displays:
   - Distance estimation
   - Route duration estimation
   - Live tracking status (during simulation/GPS tracking)
4. **Trip Stops**: JavaScript removes `active` class when user clicks "Arrêter"
5. **Back to Hidden**: Section hides again

## Visual Result

**Before Trip Starts:**
- Info section is invisible

**During Trip:**
- Blue box appears with:
  - "Estimation : 150.2 km – 120 min"
  - Later: "Trajet en cours – 45.67 km (±15m)"

**After Trip Ends:**
- Info section hides again

## Files Modified
- `css/style.css` - Added hidden state and active class styling
- `js/app.js` - Added show/hide logic on trip start/stop

## Tested Scenarios
✅ Page load - info section hidden  
✅ Click "Démarrer" - info section appears  
✅ During tracking - info updates with live data  
✅ Click "Arrêter" - info section hides  
✅ Multiple start/stop cycles - works consistently
