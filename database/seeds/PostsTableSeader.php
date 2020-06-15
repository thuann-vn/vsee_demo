<?php

use Illuminate\Database\Seeder;

class PostsTableSeader extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        //
        factory(\App\Posts::class, 20000)->create();
    }
}
