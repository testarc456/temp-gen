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

## 次のタスク
- 🔄 OpenAI APIキー設定（セキュリティ上要再設定）
- 📋 動作テスト実施
- 🎯 UX改善（ジャンル選択、プレビューなど）

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