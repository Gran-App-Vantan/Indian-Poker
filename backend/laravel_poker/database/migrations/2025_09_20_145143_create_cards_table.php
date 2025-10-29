<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('cards', function (Blueprint $table) {
            $table->id();
            $table->unsignedInteger('number'); // ジョーカーは0
            $table->enum('type', ['heart', 'diamond', 'spade', 'club', 'joker_red', 'joker_black']);
            $table->unsignedBigInteger('has_user_id')->nullable();
            $table->boolean('is_in_deck')->default(true);
            $table->boolean('is_current_option')->default(false);
        });

        DB::table('cards')->insert([
            // ハート 1〜13
            ['number' => 1, 'type' => 'heart'],
            ['number' => 2, 'type' => 'heart'],
            ['number' => 3, 'type' => 'heart'],
            ['number' => 4, 'type' => 'heart'],
            ['number' => 5, 'type' => 'heart'],
            ['number' => 6, 'type' => 'heart'],
            ['number' => 7, 'type' => 'heart'],
            ['number' => 8, 'type' => 'heart'],
            ['number' => 9, 'type' => 'heart'],
            ['number' => 10, 'type' => 'heart'],
            ['number' => 11, 'type' => 'heart'],
            ['number' => 12, 'type' => 'heart'],
            ['number' => 13, 'type' => 'heart'],

            // ダイヤ 1〜13
            ['number' => 1, 'type' => 'diamond'],
            ['number' => 2, 'type' => 'diamond'],
            ['number' => 3, 'type' => 'diamond'],
            ['number' => 4, 'type' => 'diamond'],
            ['number' => 5, 'type' => 'diamond'],
            ['number' => 6, 'type' => 'diamond'],
            ['number' => 7, 'type' => 'diamond'],
            ['number' => 8, 'type' => 'diamond'],
            ['number' => 9, 'type' => 'diamond'],
            ['number' => 10, 'type' => 'diamond'],
            ['number' => 11, 'type' => 'diamond'],
            ['number' => 12, 'type' => 'diamond'],
            ['number' => 13, 'type' => 'diamond'],

            // スペード 1〜13
            ['number' => 1, 'type' => 'spade'],
            ['number' => 2, 'type' => 'spade'],
            ['number' => 3, 'type' => 'spade'],
            ['number' => 4, 'type' => 'spade'],
            ['number' => 5, 'type' => 'spade'],
            ['number' => 6, 'type' => 'spade'],
            ['number' => 7, 'type' => 'spade'],
            ['number' => 8, 'type' => 'spade'],
            ['number' => 9, 'type' => 'spade'],
            ['number' => 10, 'type' => 'spade'],
            ['number' => 11, 'type' => 'spade'],
            ['number' => 12, 'type' => 'spade'],
            ['number' => 13, 'type' => 'spade'],

            // クラブ 1〜13
            ['number' => 1, 'type' => 'club'],
            ['number' => 2, 'type' => 'club'],
            ['number' => 3, 'type' => 'club'],
            ['number' => 4, 'type' => 'club'],
            ['number' => 5, 'type' => 'club'],
            ['number' => 6, 'type' => 'club'],
            ['number' => 7, 'type' => 'club'],
            ['number' => 8, 'type' => 'club'],
            ['number' => 9, 'type' => 'club'],
            ['number' => 10, 'type' => 'club'],
            ['number' => 11, 'type' => 'club'],
            ['number' => 12, 'type' => 'club'],
            ['number' => 13, 'type' => 'club'],

            // ジョーカー
            ['number' => 0, 'type' => 'joker_red'],
            ['number' => 0, 'type' => 'joker_black'],
        ]);
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('cards');
    }
};
