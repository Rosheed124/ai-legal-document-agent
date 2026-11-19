// This file configures PostCSS to run Tailwind CSS and add browser compatibility prefixes
module.exports = {
  // Specify plugins to run on our CSS files
  plugins: {
    // Process Tailwind CSS utility classes into actual CSS rules
    tailwindcss: {},
    // Automatically add vendor prefixes (like -webkit-) so CSS works on all browsers
    autoprefixer: {},
  },
};
