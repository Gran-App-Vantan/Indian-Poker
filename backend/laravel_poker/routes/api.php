<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\GameController;


Route::post('/game/start', [GameController::class, 'start']);



Route::post('/game/request-qr', [GameController::class, 'requestQr']);
Route::post('/game/create-qr', [GameController::class, 'createQr']);
Route::post('/game/join', [GameController::class, 'join']);
Route::post('/game/begin', [GameController::class, 'begin']);