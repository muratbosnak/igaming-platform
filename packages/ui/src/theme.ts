export type ColorScheme = 'indigo' | 'emerald'

export type ThemeTokens = {
  navActiveBg: string
  navActiveText: string
  accentBg: string
  accentHover: string
  accentText: string
  accentSubtle: string
  accentBorder: string
  avatarBg: string
  buttonBg: string
  buttonHover: string
  primaryChartColor: string
  secondaryChartColor: string
}

export const themes: Record<ColorScheme, ThemeTokens> = {
  indigo: {
    navActiveBg: 'bg-indigo-600/20',
    navActiveText: 'text-indigo-300',
    accentBg: 'bg-indigo-600',
    accentHover: 'hover:bg-indigo-500',
    accentText: 'text-indigo-300',
    accentSubtle: 'bg-indigo-950',
    accentBorder: 'border-indigo-700',
    avatarBg: 'bg-indigo-600',
    buttonBg: 'bg-indigo-600',
    buttonHover: 'hover:bg-indigo-500',
    primaryChartColor: '#6366f1',
    secondaryChartColor: '#a78bfa',
  },
  emerald: {
    navActiveBg: 'bg-emerald-600/20',
    navActiveText: 'text-emerald-300',
    accentBg: 'bg-emerald-700',
    accentHover: 'hover:bg-emerald-600',
    accentText: 'text-emerald-300',
    accentSubtle: 'bg-emerald-950',
    accentBorder: 'border-emerald-700',
    avatarBg: 'bg-emerald-700',
    buttonBg: 'bg-emerald-700',
    buttonHover: 'hover:bg-emerald-600',
    primaryChartColor: '#10b981',
    secondaryChartColor: '#6ee7b7',
  },
}

export function getTheme(scheme: ColorScheme = 'indigo'): ThemeTokens {
  return themes[scheme]
}
