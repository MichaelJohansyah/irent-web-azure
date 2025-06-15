<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return array
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'name' => $this->name,
            'description' => $this->description,
            'rent_price' => $this->rent_price,
            'stock' => $this->stock,
            'max_rent_day' => $this->max_rent_day,
            'storage' => $this->storage,
            'color' => $this->color,
            'image_url' => $this->image ? url('/storage/' . $this->image) : null,
            'partner' => $this->partner ? [
                'id' => $this->partner->id,
                'name' => $this->partner->name,
            ] : null,
        ];
    }
}
