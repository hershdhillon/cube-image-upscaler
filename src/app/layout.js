export const metadata = {
  title: 'Cube Image Upscaler',
  description: 'Upscale your images locally',
    icons: {
        icon: '/cube-icon.ico',
    },
}

export default function RootLayout({ children }) {
  return (
      <html lang="en">
      <body>{children}</body>
      </html>
  )
}