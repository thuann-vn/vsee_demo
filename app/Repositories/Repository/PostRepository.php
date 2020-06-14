<?php


namespace App\Repositories\Repository;
use App\Posts;
use App\Repositories\BaseRepository;

class PostRepository extends BaseRepository implements PostRepositoryInterface
{
    public function model(){
        return Posts::class;
    }
}
