// Theme Constants - The Revert App
// Dark theme with emerald accents

export const theme = {
  colors: {
    // Core colors
    background: '#0f172a',      // Deep slate blue
    card: '#1e293b',            // Lighter slate for cards
    cardElevated: '#334155',    // Even lighter for elevated elements
    
    // Primary (Emerald)
    primary: '#10b981',         // Emerald 500
    primaryDark: '#059669',     // Emerald 600
    primaryLight: '#34d399',    // Emerald 400
    primaryMuted: 'rgba(16, 185, 129, 0.1)',  // For backgrounds
    
    // Text
    text: '#f1f5f9',            // Slate 100
    textSecondary: '#94a3b8',   // Slate 400
    textMuted: '#64748b',       // Slate 500
    
    // Borders
    border: '#334155',          // Slate 700
    borderLight: '#475569',     // Slate 600
    
    // Status colors
    success: '#10b981',         // Emerald
    warning: '#f59e0b',         // Amber
    error: '#ef4444',           // Red
    info: '#3b82f6',            // Blue
    
    // Special
    disabled: '#475569',
    overlay: 'rgba(0, 0, 0, 0.5)',
    gold: '#fbbf24',            // For achievements
    surface: '#1e293b',         // For elevated surfaces
    
    // Gradients (as arrays for LinearGradient)
    gradientPrimary: ['#10b981', '#059669'],
    gradientDark: ['#1e293b', '#0f172a'],
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
  },
  
  borderRadius: {
    sm: 8,
    md: 12,
    lg: 16,
    xl: 24,
    full: 9999,
  },
  
  fontSize: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    xxl: 24,
    xxxl: 32,
    display: 40,
  },
  
  fontWeight: {
    normal: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  
  shadow: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.2,
      shadowRadius: 2,
      elevation: 2,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 4,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 8,
    },
  },
};

export type Theme = typeof theme;
