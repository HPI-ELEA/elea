importScripts("MessageHandler.js");

// create a coroutine wrapper
// https://x.st/javascript-coroutines/
function coroutine(f) {
    var o = f(); // instantiate the coroutine
    return function(x) {
        o.next(x);
    }
}

function fib(n) {
    if (n < 2) return n;
    return fib(n-1) + fib(n-2);
}

function* main() {
    consoleLog("running worker");

    let n = yield(Handler.recvRequest(new RecvRequest(0)));
    return Handler.sendMessage(new Message(0, fib(n)));
}

var main = coroutine(main);
main();