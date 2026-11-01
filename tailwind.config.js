/** @type {import('tailwindcss').Config} */
const token = (name) => `rgb(var(--${name}) / <alpha-value>)`;

export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        canvas: token('canvas'),
        surface: token('surface'),
        'surface-2': token('surface-2'),
        line: token('line'),
        ink: token('ink'),
        muted: token('muted'),
        subtle: token('subtle'),
        primary: token('primary'),
        'primary-hover': token('primary-hover'),
        'primary-soft': token('primary-soft'),
        'on-primary': token('on-primary'),
        accent: token('accent'),
        hero: token('hero'),
        'on-hero': token('on-hero'),
        income: token('income'),
        'income-soft': token('income-soft'),
        expense: token('expense'),
        'expense-soft': token('expense-soft'),
        warning: token('warning'),
        'warning-soft': token('warning-soft'),
      },
    },
  },
  plugins: [],
}
