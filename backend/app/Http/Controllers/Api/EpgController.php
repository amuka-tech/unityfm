<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\EpgSchedule;
use Illuminate\Http\Request;

class EpgController extends Controller
{
    /**
     * Get weekly EPG broadcast schedule guide.
     */
    public function index(Request $request)
    {
        $day = $request->input('day'); // Monday, Tuesday, etc.
        
        $query = EpgSchedule::query();
        if ($day) {
            $query->where('day_of_week', $day);
        }

        $schedules = $query->orderByRaw("FIELD(day_of_week, 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')")
            ->orderBy('start_time', 'asc')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $schedules,
        ]);
    }

    /**
     * Get featured shows and presenter profiles.
     */
    public function featured()
    {
        $shows = EpgSchedule::where('is_featured', true)->get();

        return response()->json([
            'success' => true,
            'data' => $shows,
        ]);
    }
}
