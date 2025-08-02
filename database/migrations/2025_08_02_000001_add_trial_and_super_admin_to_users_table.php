<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddTrialAndSuperAdminToUsersTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('phone')->nullable()->after('email');
            $table->boolean('is_trial')->default(false)->after('remember_token');
            $table->timestamp('trial_expired_at')->nullable()->after('is_trial');
            $table->unsignedBigInteger('super_admin_id')->nullable()->after('trial_expired_at');

            $table->foreign('super_admin_id')->references('id')->on('users')->onDelete('set null');
            $table->index(['is_trial', 'trial_expired_at']);
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['super_admin_id']);
            $table->dropIndex(['is_trial', 'trial_expired_at']);
            $table->dropColumn(['is_trial', 'trial_expired_at', 'super_admin_id']);
        });
    }
}
