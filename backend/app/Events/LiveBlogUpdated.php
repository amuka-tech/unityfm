<?php

namespace App\Events;

use App\Models\LiveBlogUpdate;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class LiveBlogUpdated implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public function __construct(
        public int $liveBlogId,
        public LiveBlogUpdate $update
    ) {}

    public function broadcastOn(): array
    {
        return [
            new Channel('live-blog.' . $this->liveBlogId),
        ];
    }

    public function broadcastAs(): string
    {
        return 'update.created';
    }
}
