<?php

namespace App\Http\Controllers;

use App\Http\Requests\AuthEnterRequest;
use App\Models\User;
use App\Models\Card;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Http;

class AuthController extends Controller
{
    // useEffectで取得し続ける用
    public function me()
    {
        $authUser = request()->user();
        $snsUser = Http::get("http://localhost:8777/api/account/me/{$authUser->sns_id}")['data']['user'];

        return response()->json([
            'user_id' => $authUser->id,
            'sns_id' => $authUser->sns_id,
            'point' => $authUser->point,
            'name' => $snsUser ? $snsUser['name'] : "ゲスト{$authUser->id}",
            'user_icon' => $snsUser ? $snsUser['user_icon'] : null,
            'is_parent' => $authUser->id === 1,
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
        $user = User::find($request->user_id);
        if (!$user) {
            return response()->noContent(404);
        }

        // ゲストの場合はsns_idとpointは送られてこない
        $user->sns_id = $request->sns_id ?? null;
        $user->is_playing = true;
        if ($request->point) {
            $user->point = $request->point;
        }
        $user->save();
        return response()->noContent();
    }

    // Game Front
    // └> Game Back `POST /api/auth/exit`
    //    └> SNS Back `PUT /api/account/wallet/update {game_type, sns_id, point}`
    public function exit()
    {
        $authUser = request()->user();
        if ($authUser->sns_id) {
            // TODO: SNS Back に合わせて変更
            Http::async()->post('http://localhost:8777/api/account/wallet/update', [
                'game_type' => 1,
                'sns_id' => $authUser->sns_id,
                'point' => $authUser->point
            ]);
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
}
