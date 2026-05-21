import type { Config } from 'tailwindcss';
import sharedConfig from '@org/ui/tailwind.config';

const config: Config = {
  ...sharedConfig,
  content: [
    './{src,pages,components,app}/**/*.{ts,tsx,js,jsx,html}',
    '!./{src,pages,components,app}/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
    '../../packages/ui/src/**/*.{ts,tsx,js,jsx,html}',
    '!../../packages/ui/src/**/*.{stories,spec}.{ts,tsx,js,jsx,html}',
  ],
};

export default config;
