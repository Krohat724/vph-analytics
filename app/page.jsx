'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Page() {
  const [status, setStatus] = useState('Supabase接続テスト中...')

  useEffect(() => {
    try {
      const url = process.env.NEXT_PUBLIC_SUPABASE_URL
      const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!url || !key) {
        setStatus('エラー: 環境変数が設定されていません')
        return
      }

      const supabase = createClient(url, key)
      
      // 接続の簡易テスト（テーブルを軽く覗きに行く）
      supabase.from('video_metrics').select('count', { count: 'exact', head: true })
        .then(({ error }) => {
          if (error) {
            setStatus(`Supabase接続エラー: ${error.message}`)
          } else {
            setStatus('Hello World! Supabaseとの接続に成功しました！')
          }
        })
    } catch (err) {
      setStatus(`エラーが発生しました: ${err.message}`)
    }
  }, [])

  return (
    <main style={{ padding: '40px', fontFamily: 'sans-serif', color: '#fff', backgroundColor: '#111', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '24px', marginBottom: '20px' }}>Hello World</h1>
      <p style={{ fontSize: '18px', color: '#34D399' }}>{status}</p>
    </main>
  )
}