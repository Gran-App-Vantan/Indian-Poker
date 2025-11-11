<?php

namespace App\Http\Controllers;

use App\Models\Card;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;

class GameController extends Controller
{
    protected function getCardImage($card)
    {
        return $card->number === 0
            ? url("/assets/images/cards/joker.svg")
            : url("/assets/images/cards/{$card->type}-{$card->number}.svg");
    }
public function stayUser()
{
    $users = User::where('is_playing', true)->get(['id', 'sns_id']);
    
    $usersWithSns = $users->map(function ($user) {
        $userData = [
            'id' => $user->id,
            'sns_id' => $user->sns_id,
            'name' => "ゲスト{$user->id}",
            'user_icon' => null
        ];

        if ($user->sns_id) {
            try {
                $response = Http::get(config('services.dealer.api_url') . "/api/account/show/{$user->sns_id}");
                if ($response->successful() && isset($response['data']['user'])) {
                    $snsUser = $response['data']['user'];
                    $userData['name'] = $snsUser['name'] ?? $userData['name'];
                    $userData['user_icon'] = $snsUser['user_icon'] ?? null;
                }
            } catch (\Exception $e) {
                \Log::error('SNS API error: ' . $e->getMessage());
            }
        }

        return $userData;
    });

    return response()->json([
        'success' => true,
        'message' => 'ユーザーを待機状態にしました',
        'users' => $usersWithSns,
    ]);
}
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
                    'imagePath' => $this->getCardImage($winner->card),
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
                    'imagePath' => $this->getCardImage($item['user']->card),
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
                    'imagePath' => $this->getCardImage($p->card),
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


    public function createUrl(Request $request)
    {
        $authUser = request()->user();
        $url = config('services.dealer.api_url') . "/api/game/create-url?" . http_build_query([
            'device_number' => $authUser->id,
            'game_type' => "IndianPoker",
        ]);
        $response = Http::withHeaders([
            'Authorization' => 'Bearer ' . config('services.dealer.token')
        ])->post($url)['data'];
        return response()->json([
            'success' => true,
            'message' => 'トークンの生成に成功しました',
            'data' => [
                'token' => $response['token'],
                'game_type' => $response['game_type'],
            ]
        ]);
    }
    public function start()
    {
        $authUser = request()->user();
        // 管理者ユーザーだけ
        if ($authUser->id === 1) {
            Cache::put('is_started', true);
            $this->distributeCards();
            return response()->json([
                'success' => true,
                'message' => 'ゲームの開始に成功しました'
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'ゲームの開始に失敗しました'
        ]);
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

        $allSet = $playingUsers->every(fn($user) => $user->is_set === 1);

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

        $allNotPlaying = User::all()->every(fn($user) => $user->is_playing === 0);
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
                    'sns_id' => $player->sns_id,
                    'point' => $pointChange,
                    'service_name' => 'インディアンポーカー',
                    'description' => 'ゲーム終了時のポイント配分',
                    'type' => 'get',
                ];
            });
            // dd($snsResults);
            foreach ($snsResults as $result) {
                $url = config('services.dealer.api_url') . "/api/account/wallet/update/{$result['sns_id']}?" . http_build_query([
                    'point' => $result['point'],
                    'service_name' => $result['service_name'],
                    'description' => $result['description'],
                    'type' => $result['type']
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
        }
        return response()->noContent();
    }

    public function currentOptions(Request $request){
        $authUser = $request->user();
        if (!$authUser->is_playing) {
            return response()->json(['message' => 'ゲームに参加していません'], 400);
        }

        $cardOffer = Card::where('is_in_deck', true)
        ->where('is_current_option', false)
        ->inRandomOrder()
        ->limit(4)
        ->get(['id','number','type']);
        $cardOffer->each(function ($card) {
            $card->is_current_option = true;
            $card->save();
            $card['imagePath'] = $this->getCardImage($card);
            unset($card->is_current_option);
        });
        return response()->json([
            'cardOffer' => $cardOffer,
        ]);
    }

    public function changeCard(Request $request)
    {
        $authUser = $request->user();

        if (!$authUser->is_playing) {
            return response()->json(['message' => 'ゲームに参加していません'], 400);
        }

        $newCardId = $request->input('card_id');
        $card = Card::find($newCardId);
        $cardOffers = $request->input('card_offers');
        
        if (!$card || !$card->is_in_deck) {
            return response()->json(['message' => 'そのカードは選べません'], 400);
        }
        if (!$cardOffers) {
            return response()->json(['message' => '提供したカードの情報がありません'], 400);
        }

        if ($authUser->card) {
            $authUser->card->update([
                'has_user_id' => null,
            ]);
        }

        $card->update([
            'has_user_id' => $authUser->id,
            'is_in_deck' => false,
        ]);

        $cardOffers = Card::whereIn('id', $cardOffers)->get();
        $cardOffers->each(function ($cardOffer) {
            $cardOffer->is_current_option = false;
            $cardOffer->save();
        });
        $imagePath = $this->getCardImage($card);
        return response()->json([
            'message' => 'カードを変更しました',
            'card' => [
                'id' => $card->id,
                'number' => $card->number,
                'type' => $card->type,
                'imagePath' => $imagePath,
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
