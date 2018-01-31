const Fixtip = require('@ui/fixtip');

module.exports = {
    timeDown:function(fn,startTime,endTime){
        var startTime = startTime - 0;
        var endTime = endTime - 0;
        var speed = 1000;
        var days    = 24*60*60,
            hours   = 60*60,
            minutes = 60;

        var count = function() {
            var nMS=Math.floor((endTime - startTime) / 1000);
            var nD=Math.floor(nMS/days);
                nMS -= nD*days;

            var nH=Math.floor(nMS/hours);
                nMS -= nH*hours;

            var nM=Math.floor(nMS/minutes);
                nMS -= nM*minutes;

            var nS=nMS;

            if(startTime >= endTime || nD==0&&nH==0&&nM==0&&nS==0){
                fn({type:0,nD:'00',nH:'00',nM:'00',nS:'00'});
            }else{
                nD = nD<10?"0"+nD:nD;
                nH = nH<10?"0"+nH:nH;
                nM = nM<10?"0"+nM:nM;
                nS = nS<10?"0"+nS:nS;

                fn({type:1,nD:nD,nH:nH,nM:nM,nS:nS});
                setTimeout(function(){
                    count();
                },speed);
                startTime+=1000;
            }
        }
        count();
    },
    validatePhone: function(phone) {
        const phonePattern = /^1\d{10}$/;
        if (!phonePattern.test(phone)) {
            return false;
        }
        return true;
    }
}