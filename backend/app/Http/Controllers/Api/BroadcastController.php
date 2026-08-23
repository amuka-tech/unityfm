<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Broadcast;
use App\Models\EpgSchedule;
use Carbon\Carbon;
use Illuminate\Http\Request;

class BroadcastController extends Controller
{
    /**
     * Get current live stream source and broadcast state.
     */
    public function current()
    {
        $broadcast = Broadcast::first();
        if (!$broadcast) {
            $broadcast = Broadcast::create([
                'channel_name' => 'Unity TV Uganda - Live from Lira City',
                'stream_url_hls' => 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
                'stream_url_youtube' => 'https://www.youtube.com/embed/live_stream?channel=UnityTVUganda',
                'is_live' => true,
                'is_emergency_slate' => false,
                'now_playing_title' => 'Lango Evening News & Agribusiness Pulse',
                'now_playing_desc' => 'Live coverage of regional development, agricultural commodity updates, and community affairs in Northern Uganda.',
                'now_playing_host' => 'Okello Moses',
                'up_next_title' => 'Northern Spotlight: Cultural Heritage & Innovation',
                'up_next_time' => '21:00 EAT',
            ]);
        }

        // Determine current and upcoming shows from EPG if available
        $currentDay = Carbon::now('Africa/Kampala')->format('l');
        $currentTime = Carbon::now('Africa/Kampala')->format('H:i:s');

        $currentSchedule = EpgSchedule::where('day_of_week', $currentDay)
            ->where('start_time', '<=', $currentTime)
            ->where('end_time', '>=', $currentTime)
            ->first();

        $upNextSchedule = EpgSchedule::where('day_of_week', $currentDay)
            ->where('start_time', '>', $currentTime)
            ->orderBy('start_time', 'asc')
            ->first();

        return response()->json([
            'success' => true,
            'data' => [
                'channel_name' => $broadcast->channel_name,
                'stream_url_hls' => $broadcast->stream_url_hls,
                'stream_url_youtube' => $broadcast->stream_url_youtube,
                'is_live' => $broadcast->is_live,
                'is_emergency_slate' => $broadcast->is_emergency_slate,
                'emergency_slate_message' => $broadcast->emergency_slate_message,
                'now_playing' => [
                    'title' => $currentSchedule ? $currentSchedule->show_name : $broadcast->now_playing_title,
                    'description' => $currentSchedule ? $currentSchedule->description : $broadcast->now_playing_desc,
                    'presenter' => $currentSchedule ? $currentSchedule->presenter_name : $broadcast->now_playing_host,
                    'presenter_image' => $currentSchedule ? $currentSchedule->presenter_image : null,
                    'start_time' => $currentSchedule ? substr($currentSchedule->start_time, 0, 5) . ' EAT' : '20:00 EAT',
                    'end_time' => $currentSchedule ? substr($currentSchedule->end_time, 0, 5) . ' EAT' : '21:00 EAT',
                ],
                'up_next' => [
                    'title' => $upNextSchedule ? $upNextSchedule->show_name : $broadcast->up_next_title,
                    'time' => $upNextSchedule ? substr($upNextSchedule->start_time, 0, 5) . ' EAT' : $broadcast->up_next_time,
                    'presenter' => $upNextSchedule ? $upNextSchedule->presenter_name : null,
                ]
            ]
        ]);
    }
}
