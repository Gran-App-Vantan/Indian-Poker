<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // is_playingがtrueのユーザーでsns_idに重複がないことを保証するユニーク制約を追加
        // 注: MySQLではユニーク部分インデックスが制限されているため、トリガーで実装
        
        // まず既存の重複データをクリーンアップ
        DB::statement("
            UPDATE users u1
            LEFT JOIN (
                SELECT sns_id, MIN(id) as keep_id
                FROM users
                WHERE sns_id IS NOT NULL AND is_playing = 1
                GROUP BY sns_id
                HAVING COUNT(*) > 1
            ) u2 ON u1.sns_id = u2.sns_id AND u1.id != u2.keep_id
            SET u1.sns_id = NULL, u1.is_playing = 0
            WHERE u2.sns_id IS NOT NULL
        ");
        
        // インデックスを追加（パフォーマンス向上のため）
        Schema::table('users', function (Blueprint $table) {
            $table->index(['sns_id', 'is_playing']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropIndex(['sns_id', 'is_playing']);
        });
    }
};
