<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Add outlet_id to users table
        Schema::table('users', function (Blueprint $table) {
            $table->foreignId('outlet_id')->nullable()->after('role')->constrained()->onDelete('set null');
        });

        // Add outlet_id to customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('phone')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('name')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to subcategories table
        Schema::table('subcategories', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('name')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to products table
        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('subcategory_id')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to suppliers table
        Schema::table('suppliers', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('contact_person')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to purchase_orders table
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->foreignId('outlet_id')->after('supplier_id')->constrained()->onDelete('cascade');
        });

        // Add outlet_id to sales table if exists
        if (Schema::hasTable('sales')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->foreignId('outlet_id')->after('customer_id')->constrained()->onDelete('cascade');
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        // Remove outlet_id from users table
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from customers table
        Schema::table('customers', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from categories table
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from subcategories table
        Schema::table('subcategories', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from products table
        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from suppliers table
        Schema::table('suppliers', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from purchase_orders table
        Schema::table('purchase_orders', function (Blueprint $table) {
            $table->dropForeign(['outlet_id']);
            $table->dropColumn('outlet_id');
        });

        // Remove outlet_id from sales table if exists
        if (Schema::hasTable('sales')) {
            Schema::table('sales', function (Blueprint $table) {
                $table->dropForeign(['outlet_id']);
                $table->dropColumn('outlet_id');
            });
        }
    }
};
