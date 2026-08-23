<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class WhistleblowerTip extends Model
{
    use HasFactory;

    protected $fillable = [
        'source_name',
        'phone_or_whatsapp',
        'email',
        'district',
        'topic',
        'details',
        'attachment_url',
        'attachment_type',
        'urgency',
        'status',
        'internal_editorial_notes',
    ];
}
