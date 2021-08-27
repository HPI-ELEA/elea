importScripts("MessageHandler.js");

// create a coroutine wrapper
// https://x.st/javascript-coroutines/
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    return function(x) {
        o.next(x);
    }
}

function* main() {
    var arr = new Array();
    var threads = new Array();

    // spawn the threads and send initial argument
    for (let index = 0; index < 15; index++) {
        let thread = threads.push(Handler.createThread("worker2.js"));

        console.log("Initialising thread", thread);
        Handler.sendMessage(new Message(thread, index + 30));
    }

    // receive the values and delete the threads
    for (let index = 0; index < threads.length; index++) {
        const element = threads[index];

        consoleLog("Receiving Thread", element);
        arr.push(yield(Handler.recvRequest(new RecvRequest(element))));

        consoleLog("Removing Thread", element)
        Handler.removeThread(element);
    }
    consoleLog(arr);

    console.log(Handler);
}

var main = coroutine(main);
main();