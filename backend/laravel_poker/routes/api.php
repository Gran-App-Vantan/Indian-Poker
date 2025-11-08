<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\GameController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::prefix('auth')->group(function () {
    Route::post('/login/{id}', [AuthController::class, 'login']);
    Route::post('/enter', [AuthController::class, 'enter']);

});

Route::middleware('auth:sanctum')->prefix('auth')->group(function () {
    Route::post('/exit', [AuthController::class, 'exit']);
    Route::get('/me', [AuthController::class, 'me']);

});

Route::middleware('auth:sanctum')->prefix('game')->group(function () {
    Route::post('/create-url', [GameController::class, 'createUrl']);
    Route::post('/start', [GameController::class, 'start']);
    Route::post('/set', [GameController::class, 'set']);
    Route::get('/result', [GameController::class, 'result']);
    Route::post('/exit', [GameController::class, 'exit']);
    Route::get('/current-options',[GameController::class, 'currentOptions']);
    Route::post('/change-card', [GameController::class, 'changeCard']);
    Route::post('/change-latch', [GameController::class, 'changeLatch']);
    Route::get('/is-all-set', [GameController::class, 'isAllSet']);
});
