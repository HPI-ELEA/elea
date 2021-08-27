new Worker("scripts/worker1.js").onmessage = function(msg) {
    if (msg.data.ctrl == "log") {
        console.log.apply(this, msg.data.data);
    }
};