<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
    'from_user_id',
    'to_user_id',
    'order_id',
    'message',
];

// Each message belongs to a sender (user)
public function fromUser()
{
    return $this->belongsTo(User::class, 'from_user_id');
}

// Each message belongs to a receiver (user)
public function toUser()
{
    return $this->belongsTo(User::class, 'to_user_id');
}

// Each message may belong to an order
public function order()
{
    return $this->belongsTo(Order::class);
}
}
