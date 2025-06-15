<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'customer_id' => $this->customer_id,
            'product_id' => $this->product_id,
            'partner_id' => $this->partner_id,
            'start_date' => $this->start_date,
            'end_date' => $this->end_date,
            'duration' => $this->duration,
            'total_price' => $this->total_price,
            'status' => $this->status,
            'product' => $this->whenLoaded('product', function() {
                return [
                    'id' => $this->product->id,
                    'name' => $this->product->name,
                    'image_url' => $this->product->image ? url('/storage/' . $this->product->image) : null,
                ];
            }),
            'customer' => $this->whenLoaded('customer', function() {
                return [
                    'id' => $this->customer->id,
                    'name' => $this->customer->name,
                ];
            }),
            'partner' => $this->whenLoaded('partner', function() {
                return [
                    'id' => $this->partner->id,
                    'name' => $this->partner->name,
                ];
            }),
        ];
    }
}
