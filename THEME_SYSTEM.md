# Theme System Documentation

## Overview

TaskPilot now includes a comprehensive dark mode theme system with your custom color palette. The theme can be switched via the user avatar dropdown menu or standalone theme toggle buttons.

## Features

### 🎨 Custom Color Palette
The dark theme uses your specified color palette:

**Primary Colors:**
- `--clr-primary-a0: #da4af7` (Main primary)
- `--clr-primary-a10: #e064f8`
- `--clr-primary-a20: #e67afa`
- `--clr-primary-a30: #eb8efb`
- `--clr-primary-a40: #f0a2fc`
- `--clr-primary-a50: #f4b5fd`

**Surface Colors:**
- `--clr-surface-a0: #0a0909` (Main surface)
- `--clr-surface-a10: #232222`
- `--clr-surface-a20: #3a3939`
- `--clr-surface-a30: #535252`
- `--clr-surface-a40: #6d6c6c`
- `--clr-surface-a50: #888888`

**Tonal Surface Colors:**
- `--clr-surface-tonal-a0: #1f1420` (Main tonal surface)
- `--clr-surface-tonal-a10: #342935`
- `--clr-surface-tonal-a20: #4a404b`
- `--clr-surface-tonal-a30: #615862`
- `--clr-surface-tonal-a40: #7a727a`
- `--clr-surface-tonal-a50: #938c93`

### 🔄 Theme Switching
- **User Avatar Dropdown**: Click the user avatar in the navbar to access theme switching
- **Standalone Toggle**: Use the `ThemeToggle` component anywhere in the app
- **Settings Page**: Full theme customization in the settings

### 💾 Persistence
- Theme preference is saved to localStorage
- Respects system theme preference on first visit
- Smooth transitions between themes

## Components

### ThemeProvider
Wraps the entire app and provides theme context:
```tsx
import { ThemeProvider } from '@/contexts/ThemeContext';

const App = () => (
  <ThemeProvider>
    {/* Your app content */}
  </ThemeProvider>
);
```

### useTheme Hook
Access theme functionality in any component:
```tsx
import { useTheme } from '@/contexts/ThemeContext';

const MyComponent = () => {
  const { theme, toggleTheme, setTheme } = useTheme();
  
  return (
    <button onClick={toggleTheme}>
      Current theme: {theme}
    </button>
  );
};
```

### ThemeToggle Component
Standalone theme toggle button:
```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

// Default icon button
<ThemeToggle />

// Custom variant and size
<ThemeToggle variant="outline" size="default" />
```

### UserDropdown Component
Enhanced user menu with theme switching:
- User profile display
- Theme toggle option
- Settings access
- Logout functionality

## Usage Examples

### Basic Theme Toggle
```tsx
import { ThemeToggle } from '@/components/ThemeToggle';

function Header() {
  return (
    <header>
      <h1>My App</h1>
      <ThemeToggle />
    </header>
  );
}
```

### Custom Theme Control
```tsx
import { useTheme } from '@/contexts/ThemeContext';

function Settings() {
  const { theme, setTheme } = useTheme();
  
  return (
    <div>
      <button onClick={() => setTheme('light')}>Light Mode</button>
      <button onClick={() => setTheme('dark')}>Dark Mode</button>
    </div>
  );
}
```

### Conditional Styling
```tsx
import { useTheme } from '@/contexts/ThemeContext';

function MyComponent() {
  const { theme } = useTheme();
  
  return (
    <div className={theme === 'dark' ? 'dark-theme-styles' : 'light-theme-styles'}>
      Content
    </div>
  );
}
```

## CSS Classes

### Custom Utility Classes
- `.bg-primary-custom` - Primary color background
- `.bg-surface-custom` - Surface color background
- `.bg-surface-tonal-custom` - Tonal surface background
- `.text-primary-custom` - Primary color text
- `.text-surface-custom` - Surface color text

### Animation Classes
- `.theme-transition` - Smooth theme switching animation
- `.hover-scale` - Scale effect on hover (dark theme)

## Customization

### Adding New Colors
1. Add CSS variables to `src/index.css` in the `.dark` selector
2. Create utility classes if needed
3. Use in components with `var(--clr-your-color)`

### Modifying Theme Behavior
1. Edit `src/contexts/ThemeContext.tsx`
2. Modify localStorage key or default theme
3. Add new theme options if needed

### Styling Components
Use the existing Tailwind classes that automatically adapt to the theme:
- `bg-background` - Main background
- `text-foreground` - Main text color
- `bg-primary` - Primary color
- `text-primary` - Primary text color

## Browser Support

- Modern browsers with CSS custom properties support
- Graceful fallback to light theme for older browsers
- System theme detection via `prefers-color-scheme` media query

## Performance

- Theme switching is optimized with CSS transitions
- No re-renders during theme changes
- Minimal JavaScript overhead
- Efficient localStorage usage 