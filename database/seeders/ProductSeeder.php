<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        \App\Models\Product::create([
            'partner_id' => 1,
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
        \App\Models\Product::create([
            'partner_id' => 1,
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
        \App\Models\Product::create([
            'partner_id' => 2,
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
    }
}
