<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Game;
use App\Models\Playinguser;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\URL;

class GameController extends Controller
{
    public function start(Request $request)
    {
        $token = Str::random(32);
        $game = Game::create([
            'join_token' => $token,
            'join_url' => url("/join/{$token}"),
            'status' => 'waiting',
            'meta' => $request->input('meta', null),
        ]);

        return response()->json([
            'game_id' => $game->id,
            'join_token' => $game->join_token,
            'join_url' => $game->join_url,
            'status' => $game->status,
        ]);
    }

    public function requestQr(Request $request)
    {
        $payload = $request->all();
        return response()->json(['accepted' => true, 'payload' => $payload]);
    }

    public function createQr(Request $request)
    {
        $gameId = $request->input('game_id');
        $game = $gameId ? Game::find($gameId) : null;

        if (! $game) {
            $token = Str::random(32);
            $game = Game::create([
                'join_token' => $token,
                'join_url' => url("/join/{$token}"),
                'status' => 'waiting',
            ]);
        }

        return response()->json([
            'join_url' => $game->join_url,
            'join_token' => $game->join_token,
        ]);
    }

    public function join(Request $request)
    {
        $token = $request->input('join_token');
        $name  = $request->input('name', 'guest');

        $game = Game::where('join_token', $token)->first();
        if (! $game) {
            return response()->json(['error' => 'invalid token'], 404);
        }

        $player = Playinguser::create([
            'name' => $name,
            'icon' => $request->input('icon', null),
            'latch' => $request->input('latch', null),
            'user_id' => $request->input('user_id', null),
            'status' => 'joined',
            'game_id' => $game->id,
        ]);

        $count = $game->playingusers()->count();
        if ($count >= 2 && $game->status === 'waiting') {
            $game->status = 'playing';
            $game->save();
        }

        return response()->json([
            'game' => $game->fresh()->load('playingusers'),
            'player' => $player,
            'players_count' => $count,
        ]);
    }

    public function begin(Request $request)
    {
        $gameId = $request->input('game_id');
        $game = Game::find($gameId);
        if (! $game) {
            return response()->json(['error' => 'game not found'], 404);
        }

        $game->status = 'playing';
        $game->save();

        return response()->json(['message' => 'game started', 'game' => $game->fresh()->load('playingusers')]);
    }
}
