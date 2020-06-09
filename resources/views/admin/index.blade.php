@extends('layout.master')

@section('title', 'Admin')

@section('content')
    <div class="waiting-room-title">
        <h1>Welcome to Code Challenge Waiting Room</h1>
        <p>If this is an emergency, please call 911.</p>
    </div>
    <div class="waiting-form w-75 m-auto">
        <div class="waiting-form_title" data-bind="if: waiting">
            <i class="fa fa-clock-o"></i> Connecting with your provider
        </div>
        <div class="waiting-form_body text-center" data-bind="if: waiting">
            <div class="waiting-message">
                Your provider will be with you shortly
            </div>

            <form class="" action="{{route('exit-room')}}" method="post">
                {{csrf_field()}}
                <button class="btn btn-warning" type="submit">Exit waiting room</button>
            </form>

            <hr/>
            <p>If you close the video conference by mistake, please <a href="#">click here to relaunch video</a> again.</p>
        </div>
    </div>
@endsection

@section('pageJS')
    <!-- Get PubNub javascript SDK-->
    <script src="https://cdn.pubnub.com/sdk/javascript/pubnub.4.27.4.min.js"></script>

    <!-- Page app.js -->
    <script src="{{asset('/js/app.js')}}"></script>

    <script>
        //PUBNUB
        const chanelName = 'waiting_room';

        //Init pubnub
        const uuid = PubNub.generateUUID();
        const pubnub = new PubNub({
            publishKey: '{{config('constants.pubnub.publishKey')}}',
            subscribeKey: '{{config('constants.pubnub.subscribeKey')}}',
            uuid: uuid
        });

        pubnub.addListener({
            message: function(event) {
                console.log('Received message', event);
            },
            presence: function(event) {
                console.log('presence', event);
            },
            status: function(event) {
                console.log('Status', event);
            }
        });

        pubnub.subscribe({
            channels: [chanelName]
        });

        submitUpdate = function(anEntry, anUpdate) {
            pubnub.publish({
                    channel : chanelName,
                    message : {'entry' : anEntry, 'update' : anUpdate}
                },
                function(status, response) {
                    if (status.error) {
                        console.log(status)
                    }
                    else {
                        displayMessage('[PUBLISH: sent]',
                            'timetoken: ' + response.timetoken);
                    }
                });
        };
    </script>
@endsection
