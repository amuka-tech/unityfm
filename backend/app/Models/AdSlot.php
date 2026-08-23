<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class AdSlot extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'slot_key',
        'dimensions',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public function campaigns()
    {
        return $this->hasMany(AdCampaign::class);
    }

    public function activeCampaign()
    {
        return $this->hasOne(AdCampaign::class)->where('is_active', true)->latest();
    }
}
