<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\AdCampaign;
use App\Models\AdImpression;
use App\Models\AdSlot;
use Illuminate\Http\Request;

class AdController extends Controller
{
    /**
     * Get active advertisements mapped by slot key.
     */
    public function active()
    {
        $slots = AdSlot::with(['activeCampaign'])->where('is_active', true)->get();

        $data = [];
        foreach ($slots as $slot) {
            if ($slot->activeCampaign) {
                $data[$slot->slot_key] = [
                    'campaign_id' => $slot->activeCampaign->id,
                    'advertiser' => $slot->activeCampaign->advertiser_name,
                    'title' => $slot->activeCampaign->campaign_title,
                    'image' => $slot->activeCampaign->banner_image_url,
                    'mobile_image' => $slot->activeCampaign->mobile_banner_image_url,
                    'url' => $slot->activeCampaign->destination_url,
                    'cta' => $slot->activeCampaign->cta_text,
                    'dimensions' => $slot->dimensions,
                    'is_sponsored' => $slot->activeCampaign->is_sponsored_content,
                ];
            }
        }

        return response()->json([
            'success' => true,
            'data' => $data,
        ]);
    }

    /**
     * Record an ad impression.
     */
    public function trackImpression(Request $request, int $campaignId)
    {
        $campaign = AdCampaign::find($campaignId);
        if ($campaign) {
            $campaign->increment('impressions_count');

            AdImpression::create([
                'ad_campaign_id' => $campaign->id,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
                'page_url' => $request->input('page_url'),
                'recorded_at' => now(),
            ]);
        }

        return response()->json(['success' => true]);
    }

    /**
     * Record an ad click.
     */
    public function trackClick(int $campaignId)
    {
        $campaign = AdCampaign::find($campaignId);
        if ($campaign) {
            $campaign->increment('clicks_count');
        }

        return response()->json(['success' => true]);
    }
}
