<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class AdminController extends Controller
{
    /**
     * Show index page to admin
     * @return View
     */
    public function index()
    {
        return view('admin.index');
    }
}
