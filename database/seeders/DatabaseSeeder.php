<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create partner users first
        $partner1 = User::factory()->create([
            'name' => 'Partner One',
            'email' => 'partner1@example.com',
            'role' => 'partner',
            'is_verified' => true,
        ]);
        $partner2 = User::factory()->create([
            'name' => 'Partner Two',
            'email' => 'partner2@example.com',
            'role' => 'partner',
            'is_verified' => true,
        ]);

        // Seed products with the correct partner IDs
        Product::create([
            'partner_id' => $partner1->id,
            'name' => 'iPhone 14 Pro',
            'type' => 'iPhone',
            'description' => 'Latest iPhone for rent',
            'price_per_day' => 150000,
            'max_duration' => 14,
            'stock' => 5,
            'specs' => ['storage' => '128GB', 'color' => 'Silver'],
            'color_options' => ['Silver', 'Black'],
            'image' => 'iphone14pro.jpg',
        ]);
        Product::create([
            'partner_id' => $partner1->id,
            'name' => 'iPhone 13',
            'type' => 'iPhone',
            'description' => 'Affordable iPhone for rent',
            'price_per_day' => 120000,
            'max_duration' => 10,
            'stock' => 3,
            'specs' => ['storage' => '256GB', 'color' => 'Blue'],
            'color_options' => ['Blue', 'Red', 'Black'],
            'image' => 'iphone13.jpg',
        ]);
        Product::create([
            'partner_id' => $partner2->id,
            'name' => 'iPhone 12 Mini',
            'type' => 'iPhone',
            'description' => 'Compact iPhone for rent',
            'price_per_day' => 100000,
            'max_duration' => 7,
            'stock' => 2,
            'specs' => ['storage' => '64GB', 'color' => 'Green'],
            'color_options' => ['Green', 'White'],
            'image' => 'iphone12mini.jpg',
        ]);

        // Seed users with different roles
        User::factory()->create([
            'name' => 'Customer One',
            'email' => 'customer1@example.com',
            'role' => 'customer',
            'is_verified' => true,
        ]);
        User::factory()->create([
            'name' => 'Customer Two',
            'email' => 'customer2@example.com',
            'role' => 'customer',
            'is_verified' => true,
        ]);
        User::factory()->create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'role' => 'admin',
            'is_verified' => true,
        ]);

        // Optionally, create a test user
        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
        ]);
    }
}
