



# 都道府県別の総人口推移グラフ

## 概要

このプロジェクトは、[株式会社ゆめみ フロントエンドコーディング試験](https://yumemi.notion.site/0e9ef27b55704d7882aab55cc86c999d)の課題として作成されました。

[採点基準についてはこちら](https://note.yumemi.co.jp/n/ned7429b59556)

## 必要要件

- Node.js v20以上
- pnpm v9以上

## 技術スタック

### コア
- Next.js 15.0.4
- React 19.0.0
- TypeScript 5.7.2
- Tailwind CSS 3.4.17
- Recharts 2.15.0

### API
- Hono 4.6.15 (Next.js Route Handlers with Edge Runtime)
- Zod 3.24.1

### 開発ツール
- Biome 1.9.4
- Vitest 2.1.8

## セットアップ

1. 依存関係をインストール:

```bash
pnpm install
```



2. 環境変数の設定:

```bash
cp .env.local.example .env.local
```



`.env.local`ファイルを編集し、必要な環境変数を設定してください。

3. 開発サーバーの起動:

```bash
pnpm dev
```



[http://localhost:3000](http://localhost:3000)にアクセスして結果を確認できます。

## 利用可能なスクリプト

```bash
# 開発サーバーの起動
pnpm dev

# Biomeによるコード品質チェック
pnpm check

# Biomeによる自動修正
pnpm fix

# 型チェック
pnpm type-check

# Vitestによるテストの実行
pnpm test
```

