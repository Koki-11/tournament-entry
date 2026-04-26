# Tournament Entry App

Stripe決済と連動した大会エントリーWebアプリです。

## できること

- 専用エントリーページ
- 氏名、メール、電話、カテゴリ、ペア名、所属を入力
- Stripe Checkoutでカード決済
- 決済成功時にStripe WebhookでSupabaseへ自動登録
- 管理画面で参加者確認
- CSVダウンロード
- カテゴリ定員チェック
- Stripe Session IDで二重登録防止

## 技術構成

- Next.js App Router
- TypeScript
- Stripe Checkout
- Stripe Webhook
- Supabase

## セットアップ

```bash
npm install
cp .env.example .env.local
npm run dev
```

## Supabase

1. Supabaseで新規プロジェクトを作成
2. SQL Editorで `supabase/schema.sql` を実行
3. Project Settings > API から以下を `.env.local` に設定

```env
NEXT_PUBLIC_SUPABASE_URL=...
SUPABASE_SERVICE_ROLE_KEY=...
```

## Stripe

`.env.local` に設定します。

```env
STRIPE_SECRET_KEY=sk_test_xxx
STRIPE_WEBHOOK_SECRET=whsec_xxx
NEXT_PUBLIC_APP_URL=http://localhost:3000
ADMIN_TOKEN=長いランダム文字列
```

ローカル確認用：

```bash
stripe listen --forward-to localhost:3000/api/stripe/webhook
```

本番ではStripe DashboardでWebhook endpointを追加します。

```text
https://your-domain.com/api/stripe/webhook
```

イベントは `checkout.session.completed` を送ってください。

## 大会情報の変更

`src/lib/tournament.ts` を編集してください。

```ts
export const tournament = {
  id: "pj-2026-december-open",
  name: "PJ December Open 2026",
  dateLabel: "2026年12月開催",
  currency: "jpy",
  categories: [...]
}
```

カテゴリごとに `price` と `capacity` を設定できます。

## 管理画面

```text
/admin?token=ADMIN_TOKENの値
```

CSV：

```text
/api/admin/export?token=ADMIN_TOKENの値
```

## 1000人規模で本番運用する前に追加推奨

- 管理画面ログインをSupabase Auth等に変更
- キャンセル/返金/キャンセル待ちテーブルを追加
- ペア双方の同意チェック
- メール自動送信
- カテゴリ締切日時
- 利用規約・返金規定・個人情報同意チェック
- 本番前に最低100件のテスト決済

