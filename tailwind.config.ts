import type { Config } from 'tailwindcss';

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
      black: '#000000',
      gray0: '#EDF0F4',
      gray1: '#C3C3C3',
      gray2: '#989898',
      gray3: '#6B6B6B',
      gray4: '#3C3C3C',
      error: '#F40707',
    },
    extend: {
      boxShadow: {
        modal: '0px 4px 4px 0px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
} satisfies Config;
