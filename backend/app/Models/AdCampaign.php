<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdCampaign extends Model
{
    use HasFactory;

    protected $fillable = [
        'ad_slot_id',
        'advertiser_name',
        'campaign_title',
        'banner_image_url',
        'mobile_banner_image_url',
        'destination_url',
        'cta_text',
        'start_date',
        'end_date',
        'impressions_count',
        'clicks_count',
        'is_active',
        'is_sponsored_content',
    ];

    protected $casts = [
        'start_date' => 'datetime',
        'end_date' => 'datetime',
        'is_active' => 'boolean',
        'is_sponsored_content' => 'boolean',
        'impressions_count' => 'integer',
        'clicks_count' => 'integer',
    ];

    public function slot()
    {
        return $this->belongsTo(AdSlot::class, 'ad_slot_id');
    }

    public function impressions()
    {
        return $this->hasMany(AdImpression::class);
    }
}
