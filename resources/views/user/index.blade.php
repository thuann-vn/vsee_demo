@extends('layout.master')

@section('title', 'Page Title')

@section('content')
    <div class="waiting-room-title">
        <h1>Welcome to Code Challenge Waiting Room</h1>
        <p>If this is an emergency, please call 911.</p>
    </div>
    <div class="waiting-form w-75 m-auto">
        <div class="waiting-form_title" data-bind="if: waiting">
            <i class="fa fa-video-camera"></i> Talk to An Nguyen
        </div>
        <div class="waiting-form_body">
            @if ($errors->any())
                <div class="alert alert-danger">
                    <ul>
                        @foreach ($errors->all() as $error)
                            <li>{{ $error }}</li>
                        @endforeach
                    </ul>
                </div>
            @endif

            <form class="" action="{{route('join-room')}}" method="post">
                {{csrf_field()}}
                <div class="form-group">
                    <label for="name">Please fill your name to process</label>
                    <input type="text" class="form-control" id="name" name="name" value="{{old('name')}}" placeholder="Your name">
                </div>
                <div class="form-group">
                    <label for="reason">Reason for visit</label>
                    <textarea class="form-control" name="reason" id="reason" placeholder="Your reason for visit">{!! old('reason') !!}</textarea>
                </div>
                <div class="form-group">
                    <label for="vsee_id">VSee ID <span class="required-mark">*</span></label>
                    <input type="text" class="form-control" name="vsee_id" id="vsee_id" value="{{old('vsee_id')}}" required aria-required="true" placeholder="Your vsee id for doctor to call">
                </div>
                <button class="btn btn-warning" type="submit">Enter waiting room</button>
            </form>
        </div>
    </div>
@endsection
