<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;

class IndexController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show index page to user
     * @return View
     */
    public function index()
    {
        return view('user.index');
    }

    /**
     * Join room request
     * @param Request $request
     * @rerurn View
     */
    public function joinRoom(Request $request){
        //Validate input
        $request->validate([
            'vsee_id' => 'required|email',
        ]);

        $params = [
            'name' => $request->input('name', ''),
            'reason' => $request->input('reason', ''),
            'vsee_id' => $request->input('vsee_id', ''),
        ];

        return view('user.waiting', $params);
    }
}
