'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@supabase/supabase-js'

export default function Dashboard() {
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

        if (!supabaseUrl || !supabaseKey) {
          throw new Error('Supabaseの環境変数が設定されていません')
        }

        const supabase = createClient(supabaseUrl, supabaseKey)

        const { data, error } = await supabase
          .from('video_metrics')
          .select('*')

        if (error) {
          throw error
        }

        setMetrics(data || [])
      } catch (err: any) {
        console.error('データ取得エラー:', err.message)
        setErrorMsg(err.message)
      } finally {
        // 成功しても失敗しても必ずローディングを解除する
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">
        <p className="text-lg animate-pulse">読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">VPH Analytics ダッシュボード</h1>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">取得データ一覧</h2>
          {errorMsg ? (
            <p className="text-red-400">エラーが発生しました: {errorMsg}</p>
          ) : (
            <pre className="bg-gray-900 p-4 rounded text-xs text-green-400 overflow-auto max-h-96">
              {JSON.stringify(metrics, null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}