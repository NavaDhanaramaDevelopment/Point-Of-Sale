<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddSuperAdminIdToOutletsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('outlets', function (Blueprint $table) {
            $table->unsignedBigInteger('super_admin_id')->nullable()->after('updated_at');

            $table->foreign('super_admin_id')->references('id')->on('users')->onDelete('set null');
            $table->index('super_admin_id');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('outlets', function (Blueprint $table) {
            $table->dropForeign(['super_admin_id']);
            $table->dropIndex(['super_admin_id']);
            $table->dropColumn('super_admin_id');
        });
    }
}
