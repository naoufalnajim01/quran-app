<?php

/** @var \Laravel\Lumen\Routing\Router $router */

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$router->get('/', function () use ($router) {
    return $router->app->version();
});

// API Routes with Rate Limiting
// 60 requests per minute for standard endpoints
$router->group(['middleware' => 'throttle:60,1'], function () use ($router) {
    $router->get('editions', 'EditionController@index');
    $router->get('surahs', 'SurahController@index');
    $router->get('hizbs', 'HizbController@index');
    $router->get('juzs', 'JuzController@index');
});

// 120 requests per minute for ayahs (more frequently accessed)
$router->group(['middleware' => 'throttle:120,1'], function () use ($router) {
    $router->get('ayahs', 'AyahController@index');
});

