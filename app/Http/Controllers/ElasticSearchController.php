<?php

namespace App\Http\Controllers;

use App\Posts;
use App\Repositories\Repository\PostRepository;
use App\Repositories\Repository\PostRepositoryInterface;
use Illuminate\Http\Request;

class ElasticSearchController extends Controller
{
    /**
     * @var PostRepository
     */
    private $postRepository;

    public function __construct(PostRepositoryInterface $postRepository)
    {
        $this->postRepository = $postRepository;
    }

    public function index(){
//        $this->postRepository->all()->searchable();
    }

    public function search(Request $request)
    {
        $posts = $this->postRepository->search($request->input('q'))->get();
        dd($posts->toArray());
    }
}
