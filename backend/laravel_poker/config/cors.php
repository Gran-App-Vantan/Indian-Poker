<?php

return [

    /*
    |--------------------------------------------------------------------------
    | CORS Configuration
    |--------------------------------------------------------------------------
    |
    | See: https://github.com/fruitcake/laravel-cors or Laravel docs.
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:3000',
        'http://localhost:3010',
        'http://localhost:3005',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3010',
        'http://127.0.0.1:3005',
        'http://10.79.12.146:3005',
        'http://10.79.12.146:3010',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => true,
];