<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Customer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'phone',
        'email',
        'address',
        'birth_date',
        'gender',
        'points',
        'total_spent',
        'visit_count',
        'last_visit',
        'discount_percentage',
        'is_active'
    ];

    protected $casts = [
        'birth_date' => 'date',
        'total_spent' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'last_visit' => 'datetime',
        'is_active' => 'boolean',
    ];

    public function sales()
    {
        return $this->hasMany(Sale::class);
    }

    public function points()
    {
        return $this->hasMany(CustomerPoint::class);
    }

    // Method untuk menambah poin
    public function addPoints($points, $description = null, $referenceType = null, $referenceId = null)
    {
        $this->increment('points', $points);

        return $this->points()->create([
            'type' => 'earned',
            'points' => $points,
            'description' => $description,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
        ]);
    }

    // Method untuk redeem poin
    public function redeemPoints($points, $description = null, $referenceType = null, $referenceId = null)
    {
        if ($this->points < $points) {
            throw new \Exception('Insufficient points');
        }

        $this->decrement('points', $points);

        return $this->points()->create([
            'type' => 'redeemed',
            'points' => -$points,
            'description' => $description,
            'reference_type' => $referenceType,
            'reference_id' => $referenceId,
        ]);
    }

    // Method untuk update statistik setelah pembelian
    public function updateAfterPurchase($amount)
    {
        $this->increment('total_spent', $amount);
        $this->increment('visit_count');
        $this->update(['last_visit' => now()]);
    }

    // Scope untuk customer aktif
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    // Scope untuk pencarian
    public function scopeSearch($query, $search)
    {
        return $query->where(function($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('phone', 'like', "%{$search}%")
              ->orWhere('email', 'like', "%{$search}%");
        });
    }
}
