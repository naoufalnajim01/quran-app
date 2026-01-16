<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Edition extends Model
{
    protected $fillable = ['identifier', 'language', 'name', 'name_en', 'format', 'type'];

    /**
     * The ayahs that belong to the edition.
     */
    public function ayahs()
    {
        return $this->belongsToMany(Ayah::class)->withPivot('data', 'is_audio');
    }

    /**
     * Scope a query search.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeBySearch($query, $keyword)
    {
        return $query->when($keyword, function ($collection) use($keyword){
            $collection->where('name', 'LIKE', "%{$keyword}%")
                      ->orWhere('name_en', 'LIKE', "%{$keyword}%")
                      ->orWhere('identifier', 'LIKE', "%{$keyword}%");
        });
    }
}

