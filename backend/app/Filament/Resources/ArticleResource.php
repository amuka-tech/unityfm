<?php

namespace App\Filament\Resources;

use App\Models\Article;
use App\Models\Category;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Support\Str;

class ArticleResource extends Resource
{
    protected static ?string $model = Article::class;
    protected static ?string $navigationIcon = 'heroicon-o-newspaper';
    protected static ?string $navigationGroup = 'Editorial & Newsroom';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()->schema([
                    Forms\Components\Card::make()->schema([
                        Forms\Components\TextInput::make('title')
                            ->required()
                            ->maxLength(255)
                            ->live(onBlur: true)
                            ->afterStateUpdated(fn ($state, Forms\Set $set) => $set('slug', Str::slug($state))),

                        Forms\Components\TextInput::make('slug')
                            ->required()
                            ->unique(Article::class, 'slug', ignoreRecord: true),

                        Forms\Components\TextInput::make('sub_headline')
                            ->maxLength(255),

                        Forms\Components\Textarea::make('excerpt')
                            ->required()
                            ->rows(3)
                            ->helperText('Short preview summary for card listings and SEO meta description.'),

                        Forms\Components\RichEditor::make('content')
                            ->required()
                            ->toolbarButtons([
                                'attachFiles', 'blockquote', 'bold', 'bulletList', 'codeBlock',
                                'heading', 'italic', 'link', 'orderedList', 'redo', 'strike', 'undo',
                            ]),
                    ]),

                    Forms\Components\Card::make('Featured Image & Media')->schema([
                        Forms\Components\FileUpload::make('featured_image')
                            ->image()
                            ->imageEditor()
                            ->directory('articles')
                            ->required(),

                        Forms\Components\Grid::make(2)->schema([
                            Forms\Components\TextInput::make('image_caption')
                                ->placeholder('e.g. Lira Main Market vendors during the morning trade.'),
                            Forms\Components\TextInput::make('image_credit')
                                ->placeholder('e.g. Unity TV / Patrick Okot'),
                        ]),

                        Forms\Components\Toggle::make('is_video_story')
                            ->label('Has Video Bulletin / VOD')
                            ->reactive(),

                        Forms\Components\TextInput::make('video_url')
                            ->label('Video Embed URL (HLS / YouTube)')
                            ->visible(fn (Forms\Get $get) => $get('is_video_story')),
                    ]),
                ])->columnSpan(['lg' => 2]),

                Forms\Components\Group::make()->schema([
                    Forms\Components\Card::make('Publishing & Placement')->schema([
                        Forms\Components\Select::make('status')
                            ->options([
                                'draft' => 'Draft',
                                'published' => 'Published',
                                'archived' => 'Archived',
                            ])
                            ->default('published')
                            ->required(),

                        Forms\Components\Select::make('category_id')
                            ->label('Primary Category')
                            ->options(Category::whereNull('parent_id')->pluck('name', 'id'))
                            ->required()
                            ->searchable(),

                        Forms\Components\TextInput::make('location_tag')
                            ->label('Location / District')
                            ->default('Lira City')
                            ->placeholder('Lira City, Dokolo, Oyam, Kampala'),

                        Forms\Components\Toggle::make('is_breaking')
                            ->label('Breaking News Alert (Ticker)')
                            ->default(false),

                        Forms\Components\Toggle::make('is_hero')
                            ->label('Hero Lead Story (Homepage)')
                            ->default(false),

                        Forms\Components\Toggle::make('is_featured_regional')
                            ->label('Feature in Northern Uganda Hub')
                            ->default(true),

                        Forms\Components\DateTimePicker::make('published_at')
                            ->default(now()),

                        Forms\Components\TextInput::make('reading_time_minutes')
                            ->numeric()
                            ->default(3),
                    ]),

                    Forms\Components\Card::make('SEO & Structured Data')->schema([
                        Forms\Components\TagsInput::make('tags')
                            ->suggestions(['Lira City', 'Lango', 'Northern Uganda', 'Agriculture', 'FUFA Drum', 'Economy']),
                        Forms\Components\TagsInput::make('key_takeaways')
                            ->placeholder('Add key bullet summary point...'),
                    ]),
                ])->columnSpan(['lg' => 1]),
            ])->columns(3);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\ImageColumn::make('featured_image')->circular(),
                Tables\Columns\TextColumn::make('title')->searchable()->limit(50)->weight('bold'),
                Tables\Columns\BadgeColumn::make('category.name')->color('warning'),
                Tables\Columns\TextColumn::make('location_tag')->badge()->color('secondary'),
                Tables\Columns\IconColumn::make('is_breaking')->boolean()->label('Breaking'),
                Tables\Columns\IconColumn::make('is_hero')->boolean()->label('Hero'),
                Tables\Columns\BadgeColumn::make('status')
                    ->colors([
                        'primary' => 'draft',
                        'success' => 'published',
                        'danger' => 'archived',
                    ]),
                Tables\Columns\TextColumn::make('view_count')->label('Views')->sortable(),
                Tables\Columns\TextColumn::make('published_at')->dateTime('M d, Y H:i')->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('category')->relationship('category', 'name'),
                Tables\Filters\SelectFilter::make('status')->options(['draft' => 'Draft', 'published' => 'Published']),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ]);
    }
}
