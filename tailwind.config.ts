import type { Config, PluginAPI } from 'tailwindcss/types/config';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    colors: {
      primary: '#F9A825',
      primary_dark: '#C8BBA3',
      secondary: '#FFE6A1',
      secondary_light: '#FFF3CE',
      tertiary: '#A17C4A',
      tertiary_light: '#B5986A',
      tertiary_dark: '#5C4A25',
      white: '#FFFFFF',
      background: '#F9F9F9',
      black: '#000000',
      gray0: '#EDF0F4',
      gray1: '#C3C3C3',
      gray2: '#989898',
      gray3: '#6B6B6B',
      gray4: '#3C3C3C',
      error: '#F40707',
      green: '#009E25',
      yellow1: '#FFEB3B',
    },
    extend: {
      boxShadow: {
        modal: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [
    ({ addUtilities }: PluginAPI) => {
      addUtilities({
        '.user-select-none': {
          '-webkit-user-select': 'none',
        },
      });
    },
  ],
} satisfies Config;
