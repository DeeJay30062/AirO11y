// client/src/theme.js
export const themeSettings = (mode) => ({
  palette: {
    mode,
    ...(mode === 'light'
      ? {
          primary: { main: '#1976d2' },
          background: { default: '#f4f6f8' }
        }
      : {
          primary: { main: '#90caf9' },
          background: { default: '#121212' }
        })
  },
  typography: {
    fontFamily: ['Roboto', 'sans-serif'].join(','),
    fontSize: 14
  }
});
