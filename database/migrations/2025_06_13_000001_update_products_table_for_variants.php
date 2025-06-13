<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn(['type', 'specs', 'color_options']);
            $table->decimal('rent_price', 10, 2)->default(0);
            $table->integer('max_rent_day')->default(1);
            $table->string('storage')->nullable()->after('description');
            $table->string('color')->nullable()->after('storage');
            $table->integer('stock')->default(0)->change();
            $table->string('image')->nullable()->change();
        });
        // Optionally, rename price_per_day to rent_price if exists
        if (Schema::hasColumn('products', 'price_per_day')) {
            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('price_per_day', 'rent_price');
            });
        }
        if (Schema::hasColumn('products', 'max_duration')) {
            Schema::table('products', function (Blueprint $table) {
                $table->renameColumn('max_duration', 'max_rent_day');
            });
        }
    }

    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->string('type')->nullable();
            $table->json('specs')->nullable();
            $table->json('color_options')->nullable();
            $table->decimal('price_per_day', 10, 2)->nullable();
            $table->integer('max_duration')->nullable();
            $table->dropColumn(['rent_price', 'max_rent_day', 'storage', 'color']);
        });
    }
};
