<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Order extends Model
{
    protected $fillable = [
    'customer_id',
    'product_id',
    'partner_id',
    'start_date',
    'end_date',
    'duration',
    'total_price',
    'status',
];

// Each order belongs to a customer (user)
public function customer()
{
    return $this->belongsTo(User::class, 'customer_id');
}

// Each order belongs to a partner (user)
public function partner()
{
    return $this->belongsTo(User::class, 'partner_id');
}

// Each order belongs to a product
public function product()
{
    return $this->belongsTo(Product::class);
}

// Each order can have many messages
public function messages()
{
    return $this->hasMany(Message::class);
}

}
