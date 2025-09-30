# Indian Poker Game

IndianPokerゲームのDockerized実装です。Laravel（Backend）とNext.js（Frontend）を使用しています。

## 必要な環境

- Docker
- Docker Compose

## セットアップ手順

1. **リポジトリのクローン**
   ```bash
   git clone https://github.com/Gran-App-Vantan/indian-poker.git
   cd indian-poker
   ```

2. **Laravel環境ファイルの設定**
   ```bash
   cp backend/laravel_poker/.env.example backend/laravel_poker/.env
   ```

3. **Dockerコンテナの起動**
   ```bash
   docker-compose up --build
   ```

## アクセス

- **Frontend (Next.js)**: http://localhost:3010
- **Backend (Laravel)**: http://localhost:8000
- **Database (MySQL)**: localhost:3306

## 開発時の注意

- 初回起動時は、Laravelのアプリケーションキーの生成とデータベースマイグレーションが必要な場合があります
- MySQL データは `backend/laravel_poker/mysql_data/` に永続化されます

## トラブルシューティング

### ポートが既に使用されている場合
```bash
docker-compose down
# ポート使用中のプロセスを停止してから再度実行
docker-compose up --build
```

### 完全なリセット
```bash
docker-compose down --volumes --rmi all
docker-compose up --build
```