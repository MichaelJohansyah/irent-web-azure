<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'partner_id',
        'name',
        'description',
        'storage',
        'color',
        'rent_price',
        'max_rent_day',
        'stock',
        'image',
    ];

    protected $casts = [
        // Remove specs and color_options casts
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
