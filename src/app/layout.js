export const metadata = {
  title: 'Cube Upscaler',
  description: 'Upscale your images and videos locally',
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