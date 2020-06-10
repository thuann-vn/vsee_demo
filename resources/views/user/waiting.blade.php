@extends('layout.master')

@section('title', 'Waiting room')

@section('content')
    <div class="waiting-room-title">
        <h1>Welcome to Code Challenge Waiting Room</h1>
        <p>If this is an emergency, please call 911.</p>
    </div>
    <div class="waiting-form w-75 m-auto">
        <div class="waiting-form_title">
            <i class="fa fa-clock-o"></i> Connecting with your provider
        </div>
        <div class="waiting-form_body text-center">
            <div data-bind="ifnot: calling">
                <div class="waiting-message" data-bind="if: waiting">
                    Your provider will be with you shortly
                </div>

                <div class="waiting-message" data-bind="if: busy">
                    Doctor is currently busy and will attend to you soon
                </div>

                <form action="{{route('index')}}" method="get" id="backIndexForm">
                    <button class="btn btn-warning" type="button" id="btnLeavingRoom">Exit waiting room</button>
                </form>
                <hr/>
                <p>If you close the video conference by mistake, please <a href="#">click here to relaunch video</a> again.</p>
            </div>

            <div class="waiting-message" data-bind="if: calling">
                The visit is in progress
            </div>

        </div>
    </div>
@endsection

@section('pageJS')
    <!-- Get PubNub javascript SDK-->
    <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.27.4.min.js"></script>

    <!-- Page app.js -->
    <script src="{{secure_asset('/js/app.js')}}"></script>

    <script>
        //PUBNUB
        const chanelName = 'waiting_room';
        const VSeeData = {
            "vsee_id": "{{$vsee_id}}",
            "name": "{{$name}}",
            "reason": "{{$reason}}"
        }
    </script>
@endsection
