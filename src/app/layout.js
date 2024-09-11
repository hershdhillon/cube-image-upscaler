export const metadata = {
  title: 'Local Image Upscaler',
  description: 'Upscale your images locally',
    icons: {
        icon: '/favicon.ico',
    },
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  )
}