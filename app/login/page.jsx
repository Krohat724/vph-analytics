'use client'
import { useEffect, useState } from 'react'
import { supabase } from './/supabaseClient'
import { useRouter } from 'next/navigation'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    // ログインしているユーザーの情報を取得する
    async function checkUser() {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) {
        // ログインしていなかったらログイン画面へ強制送還
        router.push('/login')
      } else {
        setUser(session.user)
        setLoading(false)
      }
    }
    checkUser()
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

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <p className="text-gray-300 mb-2">ログイン中のアカウント:</p>
          <p className="font-mono text-blue-400 mb-6">{user?.email}</p>
          
          <div className="border-t border-gray-700 pt-6">
            <h2 className="text-xl font-semibold mb-4">YouTubeデータ分析</h2>
            <p className="text-gray-400">ここにリアルタイムのVPHやエンゲージメントのグラフが表示されます。</p>
          </div>
        </div>
      </div>
    </div>
  )
}