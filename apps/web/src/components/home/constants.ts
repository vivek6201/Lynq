// Define local mock theme presets for the interactive preview simulator
export interface DemoTheme {
  id: string;
  name: string;
  phoneBg: string;
  avatarBorder: string;
  avatarBg: string;
  avatarText: string;
  handleColor: string;
  bioColor: string;
  buttonClass: string;
  socialIconClass: string;
}

export const DEMO_THEMES: Record<string, DemoTheme> = {
  'yellow-neon': {
    id: 'yellow-neon',
    name: 'Yellow Neon',
    phoneBg: 'bg-zinc-950 border-yellow-400/30',
    avatarBorder: 'border-yellow-400',
    avatarBg: 'bg-zinc-900',
    avatarText: 'text-yellow-400',
    handleColor: 'text-white',
    bioColor: 'text-zinc-400',
    buttonClass:
      'bg-zinc-950 border-2 border-yellow-400 text-yellow-400 rounded-lg shadow-[4px_4px_0px_0px_rgba(234,179,8,1)] hover:bg-yellow-400 hover:text-black',
    socialIconClass:
      'border-2 border-yellow-400 text-yellow-400 hover:bg-yellow-450/10',
  },
  'glass-retro': {
    id: 'glass-retro',
    name: 'Glass Retro',
    phoneBg:
      'bg-gradient-to-br from-indigo-950 via-slate-900 to-zinc-950 border-white/10',
    avatarBorder: 'border-white/40',
    avatarBg: 'bg-white/10',
    avatarText: 'text-amber-300',
    handleColor: 'text-white',
    bioColor: 'text-zinc-300',
    buttonClass:
      'bg-white/5 border border-white/10 backdrop-blur-md hover:bg-white/10 text-white rounded-2xl',
    socialIconClass:
      'bg-white/5 border border-white/10 text-white hover:bg-white/10',
  },
  'dark-minimal': {
    id: 'dark-minimal',
    name: 'Minimal Dark',
    phoneBg: 'bg-zinc-950 border-zinc-800',
    avatarBorder: 'border-zinc-800',
    avatarBg: 'bg-zinc-900',
    avatarText: 'text-zinc-300',
    handleColor: 'text-white',
    bioColor: 'text-zinc-500',
    buttonClass:
      'bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-white rounded-xl',
    socialIconClass:
      'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white',
  },
  'pastel-mint': {
    id: 'pastel-mint',
    name: 'Pastel Mint',
    phoneBg: 'bg-emerald-50/90 border-emerald-200/50',
    avatarBorder: 'border-emerald-500/30',
    avatarBg: 'bg-emerald-100',
    avatarText: 'text-emerald-800',
    handleColor: 'text-emerald-950',
    bioColor: 'text-emerald-700/80',
    buttonClass:
      'bg-white border border-emerald-200 text-emerald-900 hover:bg-emerald-50 rounded-full shadow-sm',
    socialIconClass:
      'bg-white border border-emerald-200 text-emerald-800 hover:bg-emerald-50',
  },
};
