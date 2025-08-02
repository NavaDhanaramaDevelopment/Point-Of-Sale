<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        User::create([
            'name' => 'Administrator',
            'email' => 'admin@posretail.com',
            'password' => Hash::make('password123'),
            'role' => 'admin',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Manager User
        User::create([
            'name' => 'Manager Store',
            'email' => 'manager@posretail.com',
            'password' => Hash::make('password123'),
            'role' => 'manager',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);

        // Create Kasir User
        User::create([
            'name' => 'Kasir Store',
            'email' => 'kasir@posretail.com',
            'password' => Hash::make('password123'),
            'role' => 'kasir',
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
    }
}
