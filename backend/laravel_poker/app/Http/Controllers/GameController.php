<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GameController extends Controller
{
    public function result()
    {
        $authUser = request()->user();

        $players = User::where('is_playing', true)
            ->with(['card:id,number,type,has_user_id'])
            ->get(['id', 'latch', 'point', 'is_set']);

        if ($players->isEmpty()) {
            return response()->json(['message' => '現在プレイ中のユーザーがいません'], 400);
        }

        $gameResult = $this->calculateResults($players);

        return response()->json([
            'winners' => $gameResult['calculatedWinners'],
            'total_latch' => $gameResult['totalLatch'],
            'is_draw' => $gameResult['isDraw'],
            'players' => $gameResult['playerData'],
            'ranking' => $gameResult['ranking'],
        ]);
    }

    protected function calculateResults($players)
    {
        $totalLatch = $players->sum('latch');

        $playersWithRank = $players->map(function ($user) {
            $rankValue = $user->card ? ($user->card->number === 0 ? 100 : $user->card->number) : -1;
            return [
                'user' => $user,
                'rank' => $rankValue,
            ];
        });

        $maxRank = $playersWithRank->max('rank');
        $winners = $playersWithRank
            ->filter(fn($p) => $p['rank'] === $maxRank)
            ->pluck('user');

        $share = intdiv($totalLatch, $winners->count());
        $remainder = $totalLatch % $winners->count();

        $calculatedWinners = $winners->map(function ($winner, $index) use ($share, $remainder) {
            return [
                'id' => $winner->id,
                'card' => $winner->card ? [
                    'number' => $winner->card->number,
                    'type' => $winner->card->type,
                ] : null,
                'latch' => $winner->latch,
                'point' => $winner->point + $share + ($index === 0 ? $remainder : 0),
            ];
        });

        $ranking = $playersWithRank
            ->sortByDesc('rank')
            ->values()
            ->take(4)
            ->map(fn($item, $index) => [
                'rank_position' => $index + 1,
                'id' => $item['user']->id,
                'card' => $item['user']->card ? [
                    'number' => $item['user']->card->number,
                    'type' => $item['user']->card->type,
                ] : null,
                'latch' => $item['user']->latch,
                'point' => $item['user']->point,
            ]);

        $authUser = request()->user();
        $playerData = $players->map(function ($p) use ($authUser) {
            return [
                'id' => $p->id,
                'card' => $p->id === $authUser->id ? null : ($p->card ? [
                    'number' => $p->card->number,
                    'type' => $p->card->type,
                ] : null),
                'latch' => $p->latch,
                'point' => $p->point,
                'is_set' => $p->is_set,
            ];
        });

        return [
            'totalLatch' => $totalLatch,
            'isDraw' => $winners->count() > 1,
            'ranking' => $ranking,
            'calculatedWinners' => $calculatedWinners,
            'playerData' => $playerData,
            'winners' => $winners,
            'playersWithRank' => $playersWithRank,
        ];
    }

    public function start()
    {
        $authUser = request()->user();
        // 管理者ユーザーだけ
        if ($authUser->id === 1) {
            Cache::put('is_started', true);
            $this->distributeCards();
        }

        return response()->noContent();
    }

    protected function distributeCards()
    {
        $players = User::where('is_playing', true)->get();
        $availableCards = Card::where('is_in_deck', true)->get()->shuffle();

        foreach ($players as $index => $player) {
            $card = $availableCards[$index] ?? null;
            if ($card) {
                $card->update([
                    'has_user_id' => $player->id,
                    'is_in_deck' => false,
                ]);
            }
        }
    }

    public function set()
    {
        // ログインしているユーザーのis_setをtrueに更新
        $authUser = request()->user();

        if (!$authUser->is_playing) {
            return response()->json(['message' => 'ゲームに参加していません'], 400);
        }

        $authUser->is_set = true;
        $authUser->save();

        return response()->json(['message' => '準備完了しました']);
    }

    public function isStarted()
    {
        $isStarted = Cache::get('is_started', false);
        return response()->json($isStarted);
    }

    public function isAllSet()
    {
        // is_playingがtrueのユーザーの全てのis_setカラムがtrueかどうかを返す
        $playingUsers = User::where('is_playing', true)->get();

        if ($playingUsers->isEmpty()) {
            return response()->json([
                'message' => '現在プレイ中のユーザーがいません',
                'all_set' => false
            ], 400);
        }

        $allSet = $playingUsers->every(fn($user) => $user->is_set === true);

        return response()->json([
            'all_set' => $allSet
        ]);
    }

    public function exit()
    {
        $authUser = request()->user();
        $authUser->is_playing = false;
        $authUser->save();

        $allPlayers = User::where('is_playing', true)
                        ->orWhere('id', $authUser->id)
                        ->with('card:id,number,type,has_user_id')
                        ->get();

        $allNotPlaying = User::all()->every(fn($user) => $user->is_playing === false);
        if ($allNotPlaying) {
            // 計算して結果を返す。
            // $snsUsers = User::whereNotNull('sns_id')
            $gameResult = $this->calculateResults($allPlayers);
            $totalLatch = $gameResult['totalLatch'];
            $winners = $gameResult['winners'];

            $snsResults = $allPlayers->map(function ($player) use ($winners, $totalLatch) {
                if ($winners->contains($player)) {
                    $index = $winners->search($player);
                    $share = intdiv($totalLatch, $winners->count());
                    $remainder = $totalLatch % $winners->count();
                    $pointChange = $share + ($index === 0 ? $remainder : 0);
                } else {
                    $pointChange = -$player->latch;
                }

            return [
                'id' => $player->id,
                'point' => $pointChange,
                'service_name' => 'インディアンポーカー',
                'description' => 'ゲーム終了時のポイント配分',
                'type' => 'use',
            ];
        });

        foreach ($snsResults as $result) {
            Http::async()->put('http://127.0.0.1:8777/api/account/wallet/update', $result);
        }

        $authUser->update([
            'sns_id' => null,
        ]);
        Card::query()->update([
            'has_user_id' => null,
            'is_in_deck' => true,
        ]);
    }

        return response()->noContent();
    }

    public function changeCard(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser->is_playing) {
            return response()->json(['message' => 'ゲームに参加していません'], 400);
        }

        $newCardId = $request->input('card_id');
        $card = Card::find($newCardId);

        if (!$card || !$card->is_in_deck) {
            return response()->json(['message' => 'そのカードは選べません'], 400);
        }

        if ($authUser->card) {
            $authUser->card->update([
                'has_user_id' => null,
                'is_in_deck' => true,
            ]);
        }

        $card->update([
            'has_user_id' => $authUser->id,
            'is_in_deck' => false,
        ]);

        return response()->json([
            'message' => 'カードを変更しました',
            'card' => [
                'id' => $card->id,
                'number' => $card->number,
                'type' => $card->type,
            ]
        ]);
    }

    public function changeLatch(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser->is_playing) {
            return response()->json(['message' => 'ゲームに参加していません'], 400);
        }

        $newLatch = $request->input('latch');

        if (!is_int($newLatch) || $newLatch <= 0) {
            return response()->json(['message' => '掛け金は正の整数で指定してください'], 400);
        }

        $authUser->update([
            'latch' => $newLatch
        ]);

        return response()->json([
            'message' => '掛け金を変更しました',
            'latch' => $authUser->latch
        ]);
    }
}
