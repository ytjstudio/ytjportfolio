import { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
type Theme = 'dark' | 'light'
interface ThemeContextValue { theme: Theme; toggle: () => void; setTheme: (t: Theme) => void }
const ThemeContext = createContext<ThemeContextValue | undefined>(undefined)
const STORAGE_KEY = 'ytj-theme'

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [theme, setThemeState] = useState<Theme>(() => { if (typeof window === 'undefined') return 'dark'; const saved = localStorage.getItem(STORAGE_KEY) as Theme | null; return saved ?? 'dark' })
  useEffect(() => { const root = document.documentElement; root.classList.remove('light', 'dark'); root.classList.add(theme); localStorage.setItem(STORAGE_KEY, theme) }, [theme])
  const value: ThemeContextValue = { theme, toggle: () => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), setTheme: setThemeState }
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
export function useTheme() { const ctx = useContext(ThemeContext); if (!ctx) throw new Error('useTheme must be used inside ThemeProvider'); return ctx }
