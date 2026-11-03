'use client'
import { useEffect, useState } from 'react'
import { supabase } from './supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [metrics, setMetrics] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    async function fetchData() {
      // 1. ログイン状態の確認
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        router.push('/login')
        return
      }
      setUser(session.user)

      // 2. Supabaseの video_metrics テーブルからデータを取得
      const { data, error } = await supabase
        .from('video_metrics')
        .select('*')

      if (error) {
        console.error('データ取得エラー:', error.message)
      } else {
        setMetrics(data || [])
      }
      setLoading(false)
    }
    fetchData()
  }, [router])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white">
        <p>読み込み中...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">VPH Analytics ダッシュボード</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 hover:bg-red-500 rounded text-sm font-bold transition duration-200"
          >
            ログアウト
          </button>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-8">
          <p className="text-gray-300 mb-2">ログイン中のアカウント:</p>
          <p className="font-mono text-blue-400">{user?.email}</p>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">YouTubeデータ一覧 (VPH & エンゲージメント)</h2>
          {metrics.length === 0 ? (
            <p className="text-gray-400">データがまだありません。Supabaseにデータを追加してください。</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-gray-700 text-gray-400">
                    <th className="py-3 px-4">チャンネル名</th>
                    <th className="py-3 px-4">動画タイトル</th>
                    <th className="py-3 px-4">VPH</th>
                    <th className="py-3 px-4">エンゲージメント率</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.map((item) => (
                    <tr key={item.id} className="border-b border-gray-700 hover:bg-gray-750">
                      <td className="py-3 px-4">{item.channel_name}</td>
                      <td className="py-3 px-4">{item.video_title}</td>
                      <td className="py-3 px-4 text-blue-400 font-bold">{item.vph}</td>
                      <td className="py-3 px-4 text-green-400 font-bold">{item.engagement_rate}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}