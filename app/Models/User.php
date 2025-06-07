<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'ktp_photo',
        'address',
        'is_verified',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

        // A user (partner) can have many products
    public function products()
    {
        return $this->hasMany(Product::class, 'partner_id');
    }

    // A user (customer) can have many orders
    public function orders()
    {
        return $this->hasMany(Order::class, 'customer_id');
    }

    // A user (partner) can have many orders as a partner
    public function partnerOrders()
    {
        return $this->hasMany(Order::class, 'partner_id');
    }

    // A user can have many messages sent
    public function sentMessages()
    {
        return $this->hasMany(Message::class, 'from_user_id');
    }

    // A user can have many messages received
    public function receivedMessages()
    {
        return $this->hasMany(Message::class, 'to_user_id');
    }

    // A user can have many notifications
    public function notifications()
    {
        return $this->hasMany(Notification::class);
    }

    // A user can have many feedbacks
    public function feedbacks()
    {
        return $this->hasMany(Feedback::class);
    }
}
