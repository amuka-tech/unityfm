<?php

namespace App\Filament\Resources;

use App\Models\WhistleblowerTip;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class WhistleblowerResource extends Resource
{
    protected static ?string $model = WhistleblowerTip::class;
    protected static ?string $navigationIcon = 'heroicon-o-shield-exclamation';
    protected static ?string $navigationGroup = 'Investigative Desk';
    protected static ?string $navigationLabel = 'Whistleblower Tips';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Card::make('Confidential Submission')->schema([
                    Forms\Components\Grid::make(3)->schema([
                        Forms\Components\TextInput::make('source_name')->disabled(),
                        Forms\Components\TextInput::make('phone_or_whatsapp')->disabled(),
                        Forms\Components\TextInput::make('district')->disabled(),
                    ]),

                    Forms\Components\TextInput::make('topic')->disabled(),
                    Forms\Components\Textarea::make('details')->disabled()->rows(6),

                    Forms\Components\Grid::make(2)->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'new' => 'New Submission',
                                'under_investigation' => 'Under Investigation',
                                'verified' => 'Verified by Investigative Desk',
                                'published' => 'Published Story',
                                'dismissed' => 'Dismissed / Inactionable',
                            ])
                            ->required(),

                        Forms\Components\Select::make('urgency')
                            ->options([
                                'low' => 'Low',
                                'medium' => 'Medium',
                                'high' => 'High Priority',
                                'breaking' => 'Breaking Urgent',
                            ]),
                    ]),

                    Forms\Components\Textarea::make('internal_editorial_notes')
                        ->label('Internal Investigative Notes (Confidential)')
                        ->rows(4),
                ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('created_at')->dateTime('M d, H:i')->label('Received'),
                Tables\Columns\TextColumn::make('topic')->weight('bold')->searchable()->limit(40),
                Tables\Columns\TextColumn::make('district')->badge(),
                Tables\Columns\BadgeColumn::make('urgency')
                    ->colors([
                        'danger' => 'breaking',
                        'warning' => 'high',
                        'primary' => 'medium',
                        'secondary' => 'low',
                    ]),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'danger' => 'new',
                        'warning' => 'under_investigation',
                        'success' => 'verified',
                    ]),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
            ]);
    }
}
