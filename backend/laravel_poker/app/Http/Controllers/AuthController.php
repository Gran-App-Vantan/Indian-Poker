<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthEnterRequest;
use App\Models\User;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\DB;

class AuthController extends Controller
{
    // useEffectで取得し続ける用
    public function me(Request $request)
    {
        $authUser = $request->user();
        $snsUser = null;

        // SNS連携済みの場合のみSNS APIを呼び出す
        if ($authUser->sns_id) {
            try {
                $response = Http::get(config('services.dealer.api_url') . "/api/account/show/{$authUser->sns_id}");
                if ($response->successful() && isset($response['data']['user'])) {
                    $snsUser = $response['data']['user'];
                }
            } catch (\Exception $e) {
                // SNS API呼び出しエラーは無視してゲスト情報を返す
                \Log::error('SNS API error: ' . $e->getMessage());
            }
        }

        return response()->json([
            'user_id' => $authUser->id,
            'sns_id' => $authUser->sns_id,
            'point' => $authUser->point,
            'name' => $snsUser ? $snsUser['name'] : "ゲスト{$authUser->id}",
            'user_icon' => $snsUser ? $snsUser['user_icon'] : null,
            'is_parent' => $authUser->id === 1,
            'is_playing' => $authUser->is_playing,
        ]);
    }

    public function login($id)
    {
        $user = User::find($id);
        if (!$user) {
            return response()->json([
                'success' => false,
                'message' => 'ユーザーが存在しません。',
            ]);
        }

        Auth::login($user);
        return response()->json([
            'success' => true,
            'message' => 'ログインしました。',
            'authToken' => $user->createToken('authToken')->plainTextToken,
        ]);
    }

    // カメラ
    // └> SNS Front `GET /game?game_type=1&user_id={1~4}`
    //    └> SNS Back `POST /api/account/link {game_type, user_id}`
    //       └> Game Back `POST /api/auth/enter {sns_id, user_id, point}`
    public function enter(AuthEnterRequest $request)
    {
        \Log::info('enter メソッド呼び出し', [
            'user_id' => $request->user_id,
            'sns_id' => $request->sns_id,
            'point' => $request->point,
        ]);

        $user = User::find($request->user_id);
        if (!$user) {
            \Log::error('ユーザーが見つかりません', ['user_id' => $request->user_id]);
            return response()->json([
                'success' => false,
                'message' => 'ユーザーが見つかりません'
            ], 404);
        }

        // SNSユーザーの場合、同じsns_idで既に参加中のユーザーがいないかチェック
        if ($request->sns_id) {
            $existingUser = User::where('sns_id', $request->sns_id)
                ->where('is_playing', true)
                ->where('id', '!=', $request->user_id) // 自分自身は除外
                ->first();
            
            if ($existingUser) {
                // 既存の接続を切断して、新しい接続を許可する
                \Log::info('既存の接続を切断します', [
                    '既存user_id' => $existingUser->id,
                    '既存sns_id' => $existingUser->sns_id,
                    '新規user_id' => $request->user_id,
                ]);
                
                $existingUser->update([
                    'sns_id' => null,
                    'is_playing' => false,
                ]);
            }
        }

        // ゲストの場合はsns_idとpointは送られてこない
        $user->sns_id = $request->sns_id ?? null;
        $user->is_playing = true;
        if ($request->point) {
            $user->point = $request->point;
        }
        $user->save();

        \Log::info('ユーザー情報更新完了', [
            'user_id' => $user->id,
            'sns_id' => $user->sns_id,
            'point' => $user->point,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'アカウント接続が完了しました',
            'data' => [
                'user_id' => $user->id,
                'sns_id' => $user->sns_id,
                'point' => $user->point
            ]
        ]);
    }

    // Game Front
    // └> Game Back `POST /api/auth/exit`
    //    └> SNS Back `PUT /api/account/wallet/update {game_type, sns_id, point}`

    //memo authのexitはreset的な感じ
    public function exit()
    {
        $authUser = request()->user();
        if ($authUser->sns_id) {
            // TODO: SNS Back に合わせて変更
            $url = config('services.dealer.api_url') . "/api/account/wallet/update/{$authUser->sns_id}?" . http_build_query([
                'point' => $authUser->point,
                'service_name' => 'インディアンポーカー',
                'description' => 'ゲーム終了時のポイント更新',
                'type' => 'get'
            ]);
            Http::withHeaders([
                'Authorization' => 'Bearer ' . config('services.dealer.token')
            ])->patch($url);
        }

        $authUser->update([
            'sns_id' => null,
            'is_playing' => false,
        ]);
        Card::query()->update([
            'has_user_id' => null,
            'is_in_deck' => true,
        ]);
        return response()->noContent();
    }
    
    // QRコード表示前に接続状態をリセット
    public function resetConnection()
    {
        $authUser = request()->user();
        $userId = $authUser->id;
        $snsId = $authUser->sns_id;
        
        \Log::info('接続リセット開始', [
            'user_id' => $userId,
            '変更前sns_id' => $snsId,
            '変更前is_playing' => $authUser->is_playing,
        ]);
        
        // トランザクション内で実行して確実にコミット
        \DB::transaction(function () use ($userId, $snsId) {
            // 同じsns_idで連携している他のデバイスもリセット
            if ($snsId) {
                User::where('sns_id', $snsId)
                    ->where('id', '!=', $userId)
                    ->update([
                        'sns_id' => null,
                        'is_playing' => false,
                    ]);
                
                \Log::info('他のデバイスの接続をリセット完了', [
                    '対象sns_id' => $snsId,
                    '除外user_id' => $userId,
                ]);
            }
            
            // 自分自身の接続をリセット（一括更新で確実に反映）
            User::where('id', $userId)->update([
                'sns_id' => null,
                'is_playing' => false,
            ]);
        });
        
        // リロードして変更を確認
        $authUser->refresh();
        \Log::info('接続リセット完了', [
            'user_id' => $authUser->id,
            '変更後sns_id' => $authUser->sns_id,
            '変更後is_playing' => $authUser->is_playing,
        ]);
        
        return response()->json([
            'success' => true,
            'message' => '接続をリセットしました'
        ]);
    }
}
