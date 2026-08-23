<?php

namespace App\Filament\Resources;

use App\Models\Broadcast;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class BroadcastResource extends Resource
{
    protected static ?string $model = Broadcast::class;
    protected static ?string $navigationIcon = 'heroicon-o-video-camera';
    protected static ?string $navigationGroup = 'Live TV & Media Operations';
    protected static ?string $navigationLabel = 'Live Stream Switcher';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make('Live Stream Inputs')->schema([
                    Forms\Components\TextInput::make('channel_name')
                        ->required()
                        ->default('Unity TV Uganda - Live from Lira City'),

                    Forms\Components\TextInput::make('stream_url_hls')
                        ->label('Primary HLS Stream (.m3u8)')
                        ->placeholder('https://stream.unitytv.ug/live/index.m3u8')
                        ->required(),

                    Forms\Components\TextInput::make('stream_url_youtube')
                        ->label('YouTube Live Stream Embed / Video ID')
                        ->placeholder('https://www.youtube.com/embed/...'),

                    Forms\Components\Toggle::make('is_live')
                        ->label('Broadcasting On-Air')
                        ->default(true),

                    Forms\Components\Toggle::make('is_emergency_slate')
                        ->label('Emergency / Standby Test Pattern Slate')
                        ->default(false),

                    Forms\Components\TextInput::make('emergency_slate_message')
                        ->label('Standby Notice')
                        ->placeholder('We are experiencing technical adjustments. Live broadcast will resume shortly.'),
                ]),

                Forms\Components\Card::make('Now Playing & Up Next Meta')->schema([
                    Forms\Components\TextInput::make('now_playing_title')
                        ->required()
                        ->placeholder('e.g. Lango Breakfast Express'),

                    Forms\Components\TextInput::make('now_playing_host')
                        ->placeholder('e.g. Moses Okello & Grace Akello'),

                    Forms\Components\Textarea::make('now_playing_desc')
                        ->rows(2),

                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('up_next_title')
                            ->placeholder('e.g. Unity News 8PM'),
                        Forms\Components\TextInput::make('up_next_time')
                            ->placeholder('20:00 EAT'),
                    ]),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('channel_name')->weight('bold'),
                Tables\Columns\IconColumn::make('is_live')->boolean()->label('On-Air'),
                Tables\Columns\IconColumn::make('is_emergency_slate')->boolean()->label('Emergency Slate'),
                Tables\Columns\TextColumn::make('now_playing_title')->label('Current Show'),
                Tables\Columns\TextColumn::make('updated_at')->dateTime('M d, H:i'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }
}
