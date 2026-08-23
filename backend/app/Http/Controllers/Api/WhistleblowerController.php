<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\WhistleblowerTip;
use Illuminate\Http\Request;

class WhistleblowerController extends Controller
{
    /**
     * Submit a confidential news tip / whistleblower message.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'source_name' => 'nullable|string|max:100',
            'phone_or_whatsapp' => 'nullable|string|max:50',
            'email' => 'nullable|email|max:100',
            'district' => 'required|string|max:100',
            'topic' => 'required|string|max:255',
            'details' => 'required|string',
            'urgency' => 'nullable|in:low,medium,high,breaking',
        ]);

        $tip = WhistleblowerTip::create([
            'source_name' => $validated['source_name'] ?? 'Anonymous Whistleblower',
            'phone_or_whatsapp' => $validated['phone_or_whatsapp'] ?? null,
            'email' => $validated['email'] ?? null,
            'district' => $validated['district'],
            'topic' => $validated['topic'],
            'details' => $validated['details'],
            'urgency' => $validated['urgency'] ?? 'medium',
            'status' => 'new',
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Thank you for your confidential tip. The Unity TV investigative desk has received your submission.',
            'tip_reference' => 'UTV-TIP-' . str_pad($tip->id, 5, '0', STR_PAD_LEFT),
        ], 201);
    }
}
