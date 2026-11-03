import { createClient } from '@supabase/supabase-js'

// 非同期のサーバーコンポーネントとして直接データを取得する
export default async function Dashboard() {
  // サーバー側で安全にSupabaseクライアントを初期化
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  const supabase = createClient(supabaseUrl, supabaseKey)

  // サーバーサイドで直接データを取得（ローディング状態の管理は不要）
  const { data: metrics, error } = await supabase
    .from('video_metrics')
    .select('*')

  if (error) {
    console.error('データ取得エラー:', error.message)
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">VPH Analytics ダッシュボード</h1>
        </div>

        {/* 取得したデータの表示確認 */}
        <div className="bg-gray-800 p-6 rounded-lg shadow border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">取得データ一覧</h2>
          {error ? (
            <p className="text-red-400">エラーが発生しました: {error.message}</p>
          ) : (
            <pre className="bg-gray-900 p-4 rounded text-xs text-green-400 overflow-auto max-h-96">
              {JSON.stringify(metrics || [], null, 2)}
            </pre>
          )}
        </div>
      </div>
    </div>
  )
}