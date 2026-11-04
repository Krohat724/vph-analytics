'use client'

export const dynamic = 'force-dynamic'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Page() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseKey) {
      setErrorMessage('環境変数が設定されていません')
      setLoading(false)
      return
    }

    const supabase = createClient(supabaseUrl, supabaseKey)

    async function fetchData() {
      try {
        const { data: resData, error } = await supabase
          .from('video_metrics')
          .select('*')

        if (error) {
          throw error
        }

        setData(resData || [])
      } catch (err) {
        console.error('取得エラー:', err.message)
        setErrorMessage(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div style={{ backgroundColor: '#111827', color: '#fff', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <p style={{ fontSize: '18px' }}>読み込み中...</p>
      </div>
    )
  }

  return (
    <main style={{ backgroundColor: '#111827', color: '#fff', minHeight: '100vh', padding: '32px', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '16px' }}>VPH Analytics ダッシュボード</h1>
        
        {errorMessage ? (
          <div style={{ backgroundColor: '#7F1D1D', padding: '16px', borderRadius: '8px', marginBottom: '16px' }}>
            <p>エラーが発生しました: {errorMessage}</p>
          </div>
        ) : (
          <div style={{ backgroundColor: '#1F2937', padding: '24px', borderRadius: '8px', border: '1px solid #374151' }}>
            <p style={{ marginBottom: '12px', color: '#34D399', fontWeight: 'bold' }}>✓ Supabaseとの接続に成功しました（取得件数: {data.length}件）</p>
            <pre style={{ backgroundColor: '#111827', padding: '16px', borderRadius: '6px', overflow: 'auto', maxHeight: '400px', fontSize: '12px', color: '#E5E7EB' }}>
              {JSON.stringify(data, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </main>
  )
}