<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
    'partner_id',
    'name',
    'type',
    'description',
    'price_per_day',
    'max_duration',
    'stock',
    'specs',
    'color_options',
    'image',
];

    protected $casts = [
        'specs' => 'array',
        'color_options' => 'array',
    ];

    public function partner()
    {
        return $this->belongsTo(User::class, 'partner_id');
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }
}
