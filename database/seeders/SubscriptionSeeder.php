<?php

namespace Database\Seeders;

use App\Models\Subscription;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class SubscriptionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Standard Plan
        Subscription::create([
            'name' => 'Standard',
            'price' => 99000, // Rp 99.000 per bulan
            'duration' => 1, // 1 bulan
            'description' => 'Paket dasar untuk usaha kecil dengan fitur essential POS',
            'badge_color' => 'gray',
            'features' => [
                'basic_pos',
                'inventory_basic',
                'sales_report_basic',
                'max_products_100',
                'max_transactions_500',
                'single_user'
            ],
            'is_active' => true
        ]);

        // Gold Plan
        Subscription::create([
            'name' => 'Gold',
            'price' => 199000, // Rp 199.000 per bulan
            'duration' => 1, // 1 bulan
            'description' => 'Paket populer untuk usaha menengah dengan fitur lengkap',
            'badge_color' => 'yellow',
            'features' => [
                'advanced_pos',
                'inventory_advanced',
                'sales_report_advanced',
                'customer_management',
                'barcode_scanner',
                'max_products_1000',
                'max_transactions_5000',
                'multi_user_5',
                'backup_restore',
                'email_support'
            ],
            'is_active' => true
        ]);

        // Premium Plan
        Subscription::create([
            'name' => 'Premium',
            'price' => 299000, // Rp 299.000 per bulan
            'duration' => 1, // 1 bulan
            'description' => 'Paket terlengkap untuk enterprise dengan semua fitur premium',
            'badge_color' => 'purple',
            'features' => [
                'enterprise_pos',
                'inventory_enterprise',
                'sales_analytics',
                'customer_management_advanced',
                'supplier_management',
                'barcode_scanner',
                'receipt_printer',
                'unlimited_products',
                'unlimited_transactions',
                'unlimited_users',
                'multi_location',
                'api_access',
                'custom_reports',
                'backup_restore',
                'priority_support',
                'whatsapp_integration'
            ],
            'is_active' => true
        ]);
    }
}
