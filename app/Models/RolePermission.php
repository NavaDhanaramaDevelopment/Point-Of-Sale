<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class RolePermission extends Model
{
    use HasFactory;

    protected $fillable = [
        'role',
        'permission_id'
    ];

    /**
     * Get the permission for this role permission.
     */
    public function permission()
    {
        return $this->belongsTo(Permission::class);
    }

    /**
     * Get permissions for a specific role
     */
    public static function getPermissionsForRole(string $role)
    {
        return static::where('role', $role)->with('permission')->get()->pluck('permission');
    }

    /**
     * Check if role has specific permission
     */
    public static function roleHasPermission(string $role, string $permissionName): bool
    {
        return static::where('role', $role)
            ->whereHas('permission', function($query) use ($permissionName) {
                $query->where('name', $permissionName);
            })->exists();
    }
}
