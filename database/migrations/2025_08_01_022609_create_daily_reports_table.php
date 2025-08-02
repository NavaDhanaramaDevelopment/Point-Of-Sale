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
        Schema::create('daily_reports', function (Blueprint $table) {
            $table->id();
            $table->date('report_date');
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->decimal('total_sales', 16, 2)->default(0);
            $table->decimal('cash_sales', 16, 2)->default(0);
            $table->decimal('non_cash_sales', 16, 2)->default(0);
            $table->integer('total_transactions')->default(0);
            $table->decimal('total_cost', 16, 2)->default(0);
            $table->decimal('gross_profit', 16, 2)->default(0);
            $table->json('top_products')->nullable();
            $table->json('payment_methods')->nullable();
            $table->timestamps();

            $table->unique(['report_date', 'user_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('daily_reports');
    }
};
