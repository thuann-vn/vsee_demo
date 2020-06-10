const app = {
    init: function() {
        this.initKnockout();
        this.initPubnub();
        this.initLeaveButton();
    },
    initPubnub: function(){
        const self = this;
        //Init pubnub
        const uuid = PubNub.generateUUID();
        self.pubnub = new PubNub($.extend(PUBNUBCONFIG ,{
            uuid: uuid
        }));

        self.pubnub.addListener({
            message: function(event) {
                console.log('Received message', event);
                if(event.message.type === 'call'){
                    self.vm.waiting(false);
                    self.vm.busy(false);
                    self.vm.calling(true);
                }else if(event.message.type == 'callOther' && event.message.data.vsee_id != VSeeData.vsee_id){
                    self.vm.waiting(false);
                    self.vm.calling(false);
                    self.vm.busy(true);
                }
            },
            presence: function(event) {
                console.log('presence', event);
            },
            status: function(event) {
                if (event.category == 'PNConnectedCategory') {
                    //Push a message to notify the admin have someone join the room
                    const joinData = $.extend({uuid: uuid, date: new Date()}, VSeeData);
                    self.pubnub.publish(
                        {
                            channel: chanelName,
                            message: {
                                "type" : 'join',
                                "data" : joinData
                            }
                        },
                        function(status, response) {

                            if(status.error){
                                console.error('Publish message failed',status);
                            }
                        }
                    );
                }
            }
        });

        self.pubnub.subscribe({
            //Subscribe to 2 chanel: main room channel and specified channel
            channels: [chanelName, chanelName + '_' +  VSeeData.vsee_id],
            withPresence: true
        });

        //Represent send
        window.onbeforeunload = function () {
            //Push a message to notify admin that user leaving
            self.pubnub.unsubscribe({
                channels: [chanelName]
            });
        }
    },
    initKnockout: function(){
        const self = this;

        function ViewModel() {
            this.waiting = ko.observable(true);
            this.busy = ko.observable(false);
            this.calling = ko.observable(false);
        }

        self.vm = new ViewModel();

        //KO Bindings
        ko.applyBindings(this.vm);
    },
    initLeaveButton: function(){
        const self = this;
        $('body').on('click' ,'#btnLeavingRoom', function (e) {
            e.preventDefault();
            self.pubnub.unsubscribe({
                channels: ['waiting_room']
            });

            $('#backIndexForm').submit();
        })
    }
}

$(document).ready(function(){
    app.init();
})
