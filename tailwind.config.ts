import type { Config } from 'tailwindcss';
const hlmTailwindPreset = require('@spartan-ng/ui-core/hlm-tailwind-preset');

export default {
  presets: [ hlmTailwindPreset ],
  content: [
    './index.html',
    './src/**/*.{html,ts,md,analog,ag}',
    './libs/ui/**/*.{html,ts}'
  ],
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
