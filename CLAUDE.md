# テンプレートジェネレーター.fm 開発メモ

## プロジェクト概要
- メルカリ/フリマ出品者向けAI商品説明生成SaaS
- GitHub Pages: https://testarc456.github.io/temp-gen/
- Cloudflare Worker API: https://template-generator-api.trasd208.workers.dev

## 完了済み
- ✅ GitHub Pagesデプロイ完了
- ✅ Cloudflare Workers APIプロキシ作成
- ✅ フロントエンドAI連携実装
- ✅ wrangler CLIセットアップ完了
- ✅ OpenAI APIキー設定・動作テスト完了
- ✅ 商品カテゴリ選択機能（電子機器、ファッション、本など）
- ✅ 商品状態選択機能
- ✅ 付属品チェックボックス機能
- ✅ 返品ポリシー選択機能
- ✅ カテゴリ別動的プレースホルダー実装
- ✅ チップスタイルデザイン実装
- ✅ カテゴリ選択バグ修正
- ✅ 返品ポリシーメッセージ改善
- ✅ UI汎用化（全商品カテゴリ対応）
- ✅ モジュラー構造への分離（data.js / ui.js / event.js）
- ✅ 価格交渉・発送方法トグル機能実装
- ✅ 使用環境チェックボックス機能実装
- ✅ 本・雑誌カテゴリ動的UI項目追加（帯・カバー、書き込み・折れ、初版・重版）

## 次のタスク候補
- 📚 残りカテゴリの動的UI設計（化粧品・美容、ホビー、その他）
- 🎨 追加UI/UX改善
- 🔧 パフォーマンス最適化
- 📱 レスポンシブデザイン調整
- 🌟 新機能追加

## 最新の改修履歴（2025-08-08）
### アーキテクチャ改善
- コード分離によるモジュラー構造実現
  - **data.js**: カテゴリ別UI設定・共通フィールド定義
  - **ui.js**: UI描画・データ取得関数
  - **event.js**: イベントハンドラー・API通信
  - **worker.js**: AIプロンプト最適化・テンプレート組立

### 新機能実装
- **価格交渉トグル**: 歓迎/条件付き/交渉不可の選択機能
- **発送方法トグル**: 7種類の配送方法選択（その他自由入力含む）
- **使用環境機能**: ペットなし/喫煙なし/暗所保管等のチェックボックス
- **本・雑誌カテゴリ強化**: 帯・カバー有無、書き込み・折れ状態、初版・重版選択

### AI最適化
- プロンプト簡素化（商品説明・付属品のみAI生成）
- JavaScript処理項目の拡張（商品状態、発送方法、価格交渉、返品、使用環境）
- トークン数削減（400→300）とコスト最適化

## 技術スタック
- Frontend: HTML + TailwindCSS + Vanilla JS
- API: Cloudflare Workers + OpenAI GPT-3.5-turbo
- Deploy: GitHub Pages + Workers

## セキュリティメモ
- APIキーはCloudflare Workers環境変数で管理
- フロントエンドには一切露出させない

## 開発コマンド
```bash
cd /home/beta1/claude_workspace/saas-project
wrangler secret put OPENAI_API_KEY  # APIキー設定
wrangler deploy                      # Worker再デプロイ
git add . && git commit -m "..." && git push  # GitHub更新
```