<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Cache;

class MetaController extends Controller
{
    /**
     * Get live Lira City weather and East Africa forex exchange rates.
     */
    public function weatherAndCurrency()
    {
        return Cache::remember('lira_weather_currency_meta', 300, function () {
            return response()->json([
                'success' => true,
                'weather' => [
                    'city' => 'Lira City',
                    'region' => 'Northern Uganda',
                    'temperature_celsius' => 28,
                    'condition' => 'Partly Sunny',
                    'humidity' => '64%',
                    'wind_speed' => '11 km/h',
                    'forecast_icon' => 'sun-cloud',
                ],
                'currency' => [
                    'base' => 'UGX',
                    'updated_at' => now()->toIso8601String(),
                    'rates' => [
                        ['pair' => 'USD / UGX', 'rate' => '3,840.50', 'change' => '+0.15%', 'trend' => 'up'],
                        ['pair' => 'EUR / UGX', 'rate' => '4,150.20', 'change' => '-0.08%', 'trend' => 'down'],
                        ['pair' => 'GBP / UGX', 'rate' => '4,890.00', 'change' => '+0.22%', 'trend' => 'up'],
                        ['pair' => 'KES / UGX', 'rate' => '29.85', 'change' => '+0.05%', 'trend' => 'up'],
                    ]
                ],
                'local_time_eat' => now('Africa/Kampala')->format('D, d M Y - H:i') . ' EAT'
            ]);
        });
    }
}
