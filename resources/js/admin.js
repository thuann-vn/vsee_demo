var admin = {
    init: function() {
        this.initKnockout();
        this.initPubnub();
        this.initButtons();
    },
    initKnockout: function(){
        var self = this;
        self.patients = ko.observableArray([]);
        ko.applyBindings({patients: self.patients});

        //Add function
        var durationCalculate = function(date, element){
            var duration = moment.duration(date.diff(new Date()));
            var minutes = Math.abs(duration.asMinutes());
            $(element).text(Math.round(minutes));
        }

        ko.bindingHandlers.Duration = {
            update: function (element, valueAccessor) {
                var value = valueAccessor();
                var date = moment(value);
                durationCalculate(date, element);

                //Run interval
                setInterval(function() {
                    durationCalculate(date, element);
                }, 1000 * 60);
            }
        };
    },
    initPubnub: function(){
        var self = this;

        //Init pubnub
        const uuid = PubNub.generateUUID();
        self.pubnub = new PubNub($.extend(PUBNUBCONFIG ,{
            uuid: uuid
        }));

        self.pubnub.addListener({
            message: function(event) {
                if(event.message.type == 'join'){
                    self.patients.push(event.message.data);
                }
            },
            presence: function(event) {
                if(event.action === 'leave' || event.action === 'timeout'){
                    //Remove patients
                    self.patients.remove( function (patient) { return patient.uuid === event.uuid; } );
                }
            }
        });

        self.pubnub.subscribe({
            channels: ['waiting_room'],
            withPresence: true
        });
    },
    initButtons: function(){
        const self = this;
        $('body').on('click' ,'#btnCall', function (e) {
            e.preventDefault();
            const patientId = $(this).data('vseeid');

            //Call user
            self.pubnub.publish(
                {
                    channel: 'waiting_room_' +  patientId,
                    message: {
                        "type" : 'call'
                    }
                },
                function(status, response) {
                    if(status.error){
                        console.error('Publish message failed',status);
                    }
                }
            );

            //Push message to other user
            self.pubnub.publish(
                {
                    channel: 'waiting_room',
                    message: {
                        "type" : 'callOther',
                        'data' : {
                            vsee_id: patientId
                        }
                    }
                },
                function(status, response) {
                    if(status.error){
                        console.error('Publish message failed',status);
                    }
                }
            );
        })
    }
}

$(document).ready(function(){
    admin.init();
})

