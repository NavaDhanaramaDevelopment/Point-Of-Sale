<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->foreignId('super_admin_id')->nullable()->constrained('users');
        });

        Schema::table('subcategories', function (Blueprint $table) {
            $table->foreignId('super_admin_id')->nullable()->constrained('users');
        });

        Schema::table('products', function (Blueprint $table) {
            $table->foreignId('super_admin_id')->nullable()->constrained('users');
        });
    }

    public function down()
    {
        Schema::table('categories', function (Blueprint $table) {
            $table->dropForeign(['super_admin_id']);
            $table->dropColumn(['super_admin_id']);
        });

        Schema::table('subcategories', function (Blueprint $table) {
            $table->dropForeign(['super_admin_id']);
            $table->dropColumn(['super_admin_id']);
        });

        Schema::table('products', function (Blueprint $table) {
            $table->dropForeign(['super_admin_id']);
            $table->dropColumn(['super_admin_id']);
        });
    }
};
