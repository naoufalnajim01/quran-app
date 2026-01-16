<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class EditionResource extends JsonResource
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
            'identifier' => $this->identifier, 
            'language' => $this->language, 
            'name' => $this->name, 
            'name_en' => $this->name_en, 
            'format' => $this->format, 
            'type' => $this->type,
            'ayahs' => AyahResource::collection($this->whenLoaded('ayahs')),
        ];
    }

    /**
     * @param $products Collection|array A list of Item Id's.
     * @return array The unique item.id's and their frequency counts.
     */
    protected function surahs($products)
    {

    }
}
