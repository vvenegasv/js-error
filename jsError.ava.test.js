import test from 'ava';
import JsError from './index';
import HD from './helpers';

test('test of basic error', t => {
    const expected = "Error: There is one error\n\
StackTrace:\n\
    at t (/home/vladimir/src/js-error/jsError.ava.test.js:32:11)\n\
    at Test.callFn (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:364:21)\n\
    at Test.run (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:377:23)\n\
    at Runner.runSingle (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:259:19)\n\
    at runHooks.then.hooksOk (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:322:16)\n\
    at <anonymous>\n\
    at process._tickCallback (internal/process/next_tick.js:188:7)\n\
Data: {}";
    
    try {
        throw new JsError('There is one error');
    } 
    catch(err) {
        t.deepEqual(expected, err.toString());
        t.pass();
    }
});


test('test with child error', t => {
    const expected = "Error: There is another error\n\
StackTrace:\n\
    at t (/home/vladimir/src/js-error/jsError.ava.test.js:63:13)\n\
    at Test.callFn (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:364:21)\n\
    at Test.run (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:377:23)\n\
    at Runner.runSingle (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:259:19)\n\
    at runHooks.then.hooksOk (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:322:16)\n\
    at <anonymous>\n\
    at process._tickCallback (internal/process/next_tick.js:188:7)\n\
Data: {}\n\
    Inner Error: There is one error\n\
    StackTrace:\n\
        at t (/home/vladimir/src/js-error/jsError.ava.test.js:61:13)\n\
        at Test.callFn (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:364:21)\n\
        at Test.run (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:377:23)\n\
        at Runner.runSingle (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:259:19)\n\
        at runHooks.then.hooksOk (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:322:16)\n\
        at <anonymous>\n\
        at process._tickCallback (internal/process/next_tick.js:188:7)";
        21
    try {
        try {
            throw new Error('There is one error');
        }
        catch(err) {
            throw new JsError('There is another error', err);
        }        
    } 
    catch(err) {
        t.deepEqual(expected, err.toString());        
        t.pass();
    }
});


test('test with child error and data', t => {
    const expected = "Error: There is another error\n\
StackTrace:\n\
    at t (/home/vladimir/src/js-error/jsError.ava.test.js:98:22)\n\
    at Test.callFn (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:364:21)\n\
    at Test.run (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:377:23)\n\
    at Runner.runSingle (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:259:19)\n\
    at runHooks.then.hooksOk (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:322:16)\n\
    at <anonymous>\n\
    at process._tickCallback (internal/process/next_tick.js:188:7)\n\
Data: {\n\
    \"param1\": \"hello world\"\n\
}\n\
    Inner Error: There is one error\n\
    StackTrace:\n\
        at t (/home/vladimir/src/js-error/jsError.ava.test.js:95:13)\n\
        at Test.callFn (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:364:21)\n\
        at Test.run (/home/vladimir/src/js-error/node_modules/ava/lib/test.js:377:23)\n\
        at Runner.runSingle (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:259:19)\n\
        at runHooks.then.hooksOk (/home/vladimir/src/js-error/node_modules/ava/lib/runner.js:322:16)\n\
        at <anonymous>\n\
        at process._tickCallback (internal/process/next_tick.js:188:7)";

    try {
        try {
            throw new Error('There is one error');
        }
        catch(err) {
            let param1 = 'hello world';   
            let newError = new JsError('There is another error', err);
            let wasSuccess = newError.tryAddData(HD.nameof({param1}), param1);
            if(!wasSuccess)
                t.fail();
            throw newError;
        }
    } 
    catch(err) {
        t.deepEqual(expected, err.toString());        
        t.pass();
    }
});