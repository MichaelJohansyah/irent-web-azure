<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Delete all existing products and reset the primary key sequence
        DB::statement('TRUNCATE TABLE products RESTART IDENTITY CASCADE');

        \App\Models\Product::create([
            'partner_id' => 1,
            'name' => 'iPhone 14 Pro 128GB Silver',
            'description' => 'Latest iPhone 14 Pro, 128GB, Silver variant.',
            'storage' => '128GB',
            'color' => 'Silver',
            'rent_price' => 150000,
            'max_rent_day' => 14,
            'stock' => 5,
            'image' => 'iphone14pro_silver.jpg',
        ]);
        \App\Models\Product::create([
            'partner_id' => 1,
            'name' => 'iPhone 13 256GB Blue',
            'description' => 'iPhone 13, 256GB, Blue variant.',
            'storage' => '256GB',
            'color' => 'Blue',
            'rent_price' => 120000,
            'max_rent_day' => 10,
            'stock' => 3,
            'image' => 'iphone13_blue.jpg',
        ]);
        \App\Models\Product::create([
            'partner_id' => 2,
            'name' => 'iPhone 12 Mini 64GB Green',
            'description' => 'iPhone 12 Mini, 64GB, Green variant.',
            'storage' => '64GB',
            'color' => 'Green',
            'rent_price' => 100000,
            'max_rent_day' => 7,
            'stock' => 2,
            'image' => 'iphone12mini_green.jpg',
        ]);
    }
}
