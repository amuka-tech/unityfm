<?php

namespace App\Filament\Resources;

use App\Models\AdCampaign;
use App\Models\AdSlot;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class AdCampaignResource extends Resource
{
    protected static ?string $model = AdCampaign::class;
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationGroup = 'Monetization & Ad Ops';
    protected static ?string $navigationLabel = 'Ad Campaigns';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make('Campaign Details')->schema([
                    Forms\Components\Select::make('ad_slot_id')
                        ->label('Target Ad Slot')
                        ->options(AdSlot::pluck('name', 'id'))
                        ->required(),

                    Forms\Components\TextInput::make('advertiser_name')
                        ->required()
                        ->placeholder('e.g. Stanbic Bank Lira Branch / Mount Meru Millers'),

                    Forms\Components\TextInput::make('campaign_title')
                        ->required()
                        ->placeholder('e.g. Agri-Finance Soya Promo 2026'),

                    Forms\Components\FileUpload::make('banner_image_url')
                        ->label('Desktop Banner Image')
                        ->image()
                        ->directory('ads')
                        ->required(),

                    Forms\Components\FileUpload::make('mobile_banner_image_url')
                        ->label('Mobile Optimized Banner')
                        ->image()
                        ->directory('ads'),

                    Forms\Components\TextInput::make('destination_url')
                        ->url()
                        ->required()
                        ->placeholder('https://...'),

                    Forms\Components\TextInput::make('cta_text')
                        ->default('Learn More'),

                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\DateTimePicker::make('start_date'),
                        Forms\Components\DateTimePicker::make('end_date'),
                    ]),

                    Forms\Components\Toggle::make('is_active')->default(true),
                    Forms\Components\Toggle::make('is_sponsored_content')->label('Mark as Sponsored Native Article Card'),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('banner_image_url')->label('Banner'),
                Tables\Columns\TextColumn::make('advertiser_name')->weight('bold')->searchable(),
                Tables\Columns\TextColumn::make('slot.name')->badge(),
                Tables\Columns\TextColumn::make('impressions_count')->label('Impressions')->sortable(),
                Tables\Columns\TextColumn::make('clicks_count')->label('Clicks')->sortable(),
                Tables\Columns\IconColumn::make('is_active')->boolean()->label('Active'),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
