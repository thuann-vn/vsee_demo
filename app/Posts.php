<?php

namespace App;

use Elasticquent\ElasticquentTrait;
use Illuminate\Database\Eloquent\Model;

class Posts extends Model
{
    use ElasticquentTrait;
    //
    function getIndexName()
    {
        return "post_index";
    }
}
