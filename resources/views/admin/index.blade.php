@extends('layout.master')

@section('title', 'Admin')

@section('content')
    <div class="waiting-room-title">
        <h1>Welcome to Code Challenge Waiting Room</h1>
        <p>If this is an emergency, please call 911.</p>
    </div>
    <div class="waiting-form w-75 m-auto">
        <div class="waiting-form_title">
            <i class="fa fa-bars"></i> Waiting Room
        </div>
        <div class="waiting-form_body text-center">
            <div class="waiting-form_empty" data-bind="visible:!patients().length">
                The room is empty now!
            </div>
            <div class="waiting-users" data-bind="foreach: patients">
                <div class="waiting-user_item">
                    <div class="waiting-user_icon">
                        <i class="fa fa-user"></i>
                    </div>
                    <div class="waiting-user_info">
                        <h3 class="waiting-user_name" data-bind="text: name"></h3>
                        <p class="waiting-user_reason" data-bind="text: reason"></p>
                        <p class="waiting-user_id" data-bind="text: vsee_id"></p>
                    </div>
                    <div class="waiting-user_status">
                        <div class="waiting-user_online"><i class="fa fa-video-camera text-success"></i> Online</div>
                        <div class="waiting-user_minutes">
                            <i class="fa fa-clock-o"></i> Waiting: <span data-bind="Duration: date"></span> min
                        </div>
                    </div>
                    <div class="waiting-user-buttons">
                        <button class="btn btn-warning" data-bind="attr: { 'data-vseeid': vsee_id }" id="btnComment"><i class="fa fa-comment"></i></button>
                        <button class="btn btn-warning" data-bind="attr: { 'data-vseeid': vsee_id }" id="btnCall"><i class="fa fa-video-camera"></i></button>
                        <button class="btn btn-warning" data-bind="attr: { 'data-vseeid': vsee_id }" id="btnMore"><i class="fa fa-ellipsis-h"></i></button>
                    </div>
                </div>
            </div>
        </div>
    </div>
@endsection

@section('pageJS')
    <!-- Moment -->
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.10.6/moment.min.js"></script>

    <!-- Get PubNub javascript SDK-->
    <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.27.4.min.js"></script>

    <!-- Page app.js -->
    <script src="{{secure_asset('/js/admin.js')}}"></script>
@endsection
