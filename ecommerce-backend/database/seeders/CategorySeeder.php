<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Electronics',
            'Fashion',
            'Home & Kitchen',
            'Beauty & Personal Care',
            'Sports & Outdoors',
            'Toys & Games',
            'Books',
            'Health & Wellness',
            'Automotive',
            'Pet Supplies',
            'Office Supplies',
            'Baby Products',
            'Music & Movies',
            'Furniture',
            'Groceries',
            'Garden & Outdoors',
            'Tools & Hardware',
            'Jewelry & Watches',
            'Crafts & DIY',
            'Appliances',
            'Smartphones & Accessories',
            'Gaming',
            'Cameras & Photography',
            'Fitness Equipment',
            'Luggage & Travel',
            'Musical Instruments',
            'Software'
        ];
        foreach ($categories as $category) {
            DB::table('categories')->insert([
                'name' => $category,
                'slug' => Str::slug($category),
                'image' => 'categories/product-' . rand(1, 9) . '.jpg',
                'status' => ['active', 'inactive'][rand(0, 1)], // Randomly selects 'active' or 'inactive'
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }
    }
}
