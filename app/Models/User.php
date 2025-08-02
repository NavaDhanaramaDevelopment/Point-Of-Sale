<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'phone',
        'password',
        'role',
        'is_active',
        'is_trial',
        'trial_expired_at',
        'super_admin_id',
        'outlet_id',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'trial_expired_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'is_trial' => 'boolean',
        ];
    }

    /**
     * Check if user has admin role
     */
    public function isAdmin(): bool
    {
        return $this->role === 'admin';
    }

    /**
     * Check if user has owner role
     */
    public function isOwner(): bool
    {
        return $this->role === 'owner';
    }

    /**
     * Check if user has manager role
     */
    public function isManager(): bool
    {
        return $this->role === 'manager';
    }

    /**
     * Check if user has kasir role
     */
    public function isKasir(): bool
    {
        return $this->role === 'kasir';
    }

    /**
     * Check if user has permission for role
     */
    public function hasRole(string $role): bool
    {
        return $this->role === $role;
    }

    /**
     * Check if user has any of the given roles
     */
    public function hasAnyRole(array $roles): bool
    {
        return in_array($this->role, $roles);
    }

    /**
     * Get user subscriptions
     */
    public function userSubscriptions()
    {
        return $this->hasMany(UserSubscription::class);
    }

    /**
     * Get current active subscription
     */
    public function activeSubscription()
    {
        return $this->hasOne(UserSubscription::class)
                    ->active()
                    ->with('subscription')
                    ->latest();
    }

    /**
     * Check if user has active subscription
     */
    public function hasActiveSubscription(): bool
    {
        return $this->activeSubscription()->exists();
    }

    /**
     * Get current subscription plan
     */
    public function getCurrentSubscription()
    {
        return $this->activeSubscription;
    }

    /**
     * Check if user has access to feature
     */
    public function hasFeatureAccess(string $feature): bool
    {
        $activeSubscription = $this->getCurrentSubscription();

        if (!$activeSubscription || !$activeSubscription->isActive()) {
            return false;
        }

        return $activeSubscription->subscription->hasFeature($feature);
    }

    /**
     * Get the sales associated with the user.
     */
    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Get the shifts associated with the user.
     */
    public function shifts()
    {
        return $this->hasMany(Shift::class);
    }

    /**
     * Get the purchase orders created by the user.
     */
    public function purchaseOrders()
    {
        return $this->hasMany(PurchaseOrder::class);
    }

    /**
     * Check if user has specific permission
     */
    public function hasPermission(string $permissionName): bool
    {
        // Owner has all permissions
        if ($this->role === 'owner') {
            return true;
        }

        return RolePermission::roleHasPermission($this->role, $permissionName);
    }

    /**
     * Get all permissions for user's role
     */
    public function getPermissions()
    {
        return RolePermission::getPermissionsForRole($this->role);
    }

    /**
     * Check if user can access module
     */
    public function canAccessModule(string $module): bool
    {
        $permissions = $this->getPermissions();
        return $permissions->where('module', $module)->isNotEmpty();
    }

    /**
     * Get the super admin (parent) user
     */
    public function superAdmin()
    {
        return $this->belongsTo(User::class, 'super_admin_id');
    }

    /**
     * Get child users (if this user is a super admin)
     */
    public function childUsers()
    {
        return $this->hasMany(User::class, 'super_admin_id');
    }

    /**
     * Get outlets managed by this super admin
     */
    public function managedOutlets()
    {
        return $this->hasMany(Outlet::class, 'super_admin_id');
    }

    /**
     * Check if trial has expired
     */
    public function isTrialExpired(): bool
    {
        return $this->is_trial && $this->trial_expired_at && $this->trial_expired_at < now();
    }

    /**
     * Get remaining trial days
     */
    public function getTrialDaysRemaining(): int
    {
        if (!$this->is_trial || !$this->trial_expired_at) {
            return 0;
        }

        $daysRemaining = now()->diffInDays($this->trial_expired_at, false);
        return max(0, $daysRemaining);
    }
}
