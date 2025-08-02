<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class OutletSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $outlets = [
            [
                'name' => 'Main Store',
                'code' => 'MAIN',
                'address' => 'Jl. Raya No. 123, Jakarta',
                'phone' => '+6281234567890',
                'email' => 'main@posretail.com',
                'manager_name' => 'John Doe',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Branch Store - Bandung',
                'code' => 'BDG',
                'address' => 'Jl. Asia Afrika No. 456, Bandung',
                'phone' => '+6287654321098',
                'email' => 'bandung@posretail.com',
                'manager_name' => 'Jane Smith',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'name' => 'Branch Store - Surabaya',
                'code' => 'SBY',
                'address' => 'Jl. Pemuda No. 789, Surabaya',
                'phone' => '+6281122334455',
                'email' => 'surabaya@posretail.com',
                'manager_name' => 'Bob Johnson',
                'is_active' => true,
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ];

        foreach ($outlets as $outlet) {
            \App\Models\Outlet::create($outlet);
        }
    }
}
