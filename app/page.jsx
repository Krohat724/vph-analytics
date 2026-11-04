'use client'

export const dynamic = 'force-dynamic'

export default function Page() {
  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Hello World</h1>
      <p style={{ fontSize: '18px', color: '#34D399' }}>Vercelのビルドテスト成功</p>
    </main>
  )
}