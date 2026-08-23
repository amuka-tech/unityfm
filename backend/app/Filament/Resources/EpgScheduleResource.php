<?php

namespace App\Filament\Resources;

use App\Models\EpgSchedule;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class EpgScheduleResource extends Resource
{
    protected static ?string $model = EpgSchedule::class;
    protected static ?string $navigationIcon = 'heroicon-o-calendar';
    protected static ?string $navigationGroup = 'Live TV & Media Operations';
    protected static ?string $navigationLabel = 'TV Schedule (EPG)';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make('Program Details')->schema([
                    Forms\Components\TextInput::make('show_name')
                        ->required()
                        ->placeholder('e.g. Unity News 8PM'),

                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\TextInput::make('presenter_name')
                            ->required()
                            ->placeholder('e.g. Okello Moses'),
                        Forms\Components\TextInput::make('presenter_role')
                            ->placeholder('e.g. Chief News Anchor'),
                    ]),

                    Forms\Components\Select::make('day_of_week')
                        ->options([
                            'Monday' => 'Monday',
                            'Tuesday' => 'Tuesday',
                            'Wednesday' => 'Wednesday',
                            'Thursday' => 'Thursday',
                            'Friday' => 'Friday',
                            'Saturday' => 'Saturday',
                            'Sunday' => 'Sunday',
                        ])
                        ->required(),

                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\TimePicker::make('start_time')->required(),
                        Forms\Components\TimePicker::make('end_time')->required(),
                    ]),

                    Forms\Components\Select::make('category')
                        ->options([
                            'News' => 'News & Bulletins',
                            'Talk Show' => 'Talk Show & Politics',
                            'Agriculture' => 'Agriculture & Agribusiness',
                            'Sports' => 'Sports (FUFA & Local)',
                            'Culture' => 'Luo Heritage & Culture',
                            'Entertainment' => 'Entertainment & Music',
                        ])
                        ->default('News'),

                    Forms\Components\Textarea::make('description')->required()->rows(3),

                    Forms\Components\FileUpload::make('banner_image')
                        ->image()
                        ->directory('epg'),

                    Forms\Components\Toggle::make('is_featured')->label('Highlight on Shows Hub'),
                    Forms\Components\Toggle::make('is_live_broadcast')->label('Live Studio Broadcast'),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('show_name')->weight('bold')->searchable(),
                Tables\Columns\BadgeColumn::make('day_of_week')->color('primary'),
                Tables\Columns\TextColumn::make('start_time')->label('Start'),
                Tables\Columns\TextColumn::make('end_time')->label('End'),
                Tables\Columns\TextColumn::make('presenter_name')->label('Anchor'),
                Tables\Columns\BadgeColumn::make('category')->color('warning'),
                Tables\Columns\IconColumn::make('is_live_broadcast')->boolean()->label('Live'),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('day_of_week')
                    ->options([
                        'Monday' => 'Monday', 'Tuesday' => 'Tuesday', 'Wednesday' => 'Wednesday',
                        'Thursday' => 'Thursday', 'Friday' => 'Friday', 'Saturday' => 'Saturday', 'Sunday' => 'Sunday'
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
