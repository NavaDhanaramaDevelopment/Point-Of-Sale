<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Permission extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'display_name',
        'module',
        'description'
    ];

    /**
     * Get the role permissions for this permission.
     */
    public function rolePermissions()
    {
        return $this->hasMany(RolePermission::class);
    }

    /**
     * Get roles that have this permission
     */
    public function roles()
    {
        return $this->rolePermissions->pluck('role')->unique();
    }

    /**
     * Check if a role has this permission
     */
    public function hasRole(string $role): bool
    {
        return $this->rolePermissions()->where('role', $role)->exists();
    }
}
