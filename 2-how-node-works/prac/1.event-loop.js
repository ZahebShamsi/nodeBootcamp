const fs = require('fs');
const crypto = require('crypto');

const start = Date.now();
process.env.UV_THREADPOOL_SIZE = 4;
//#region 1 - Event Loop

    // => code start 
        setImmediate(() => console.log("setImmediate 1"));
        setTimeout(() => console.log("setTimeout 1"), 0);
        fs.readFile('./test-file.txt', ()=>{
            console.log('I/O finished')
        })
        console.log("console top-level code");
    // => code end 


    // => Result start
        // console console top-level code
        // setTimeout 1
        // setImmediate 1
        // I/O finished
    // => Result end

    // => Explanation start
        // Because node thread process works following =>
        // 1. all top-level non-blocking thread process
        // 2. require modules
        // 3. register callBacks
        // 4. then comes Start Event Loop => callback function process with execution flow as follows
        //     a) expired timer callbacks
        //     b) I/O polling and callbacks
        //     c) setImmediate
        //     d) close callback functions like websocket/ webserver shutDown

        // The above code doesn't run inside a callback , hence 4th point execution process is not followed
        // because the code is not inside callback.

        // The prompt is exited automatically in terminal because there are not pending thread running . all registered 
        // callback has finished execution.
    // => Explanation end

//#endregion 1


//#region 2 - MicroTask and I/O callback

    // => code start 
        // setTimeout(() => console.log("setTimeout 1"), 0);
        // setImmediate(() => console.log("setImmediate 1"));
        // fs.readFile('./test-file.txt', ()=>{
        //     console.log('I/O finished')
        //     console.log('------top level code execution finised , now callback inside callback starts------')

        //     setTimeout(() => console.log("setTimeout 2"), 0);
        //     setTimeout(() => console.log("setTimeout 3"), 3000);
        //     setImmediate(() => console.log("setImmediate 2"));
        //     process.nextTick(() => console.log("Process.nextTick"))
        // })
        // console.log("console top-level code");
    // => code end 

    // => Result start
        // console top-level code
        // setTimeout 1
        // setImmediate 1
        // I/O finished
        // ------------
        // "Process.nextTick"
        // setImmediate 2
        // setTimeout 2
        // setTimeout 3
    // => Result end

    // => Explanation start
        // a) process.nextTick is microTask , hence it will be executes between every step in eventLoop execution phase of expired timer callbacks
        // expired timer callbacks -> microTask -> I/O polling and callbacks -> microTask -> setImmediate -> microTask -> close callback functions
        
        // b) when inside I/O polling , setImmediate will execute rigght after the I/O polling phase then setTimeout will be executed ,
        // hence "setImmediate 2" is executed before "setTimeout 2"
    // => Explanation end

//#endregion 2


//#region 3 - ThreadPool 

    // => code start 
        // setTimeout(() => console.log("setTimeout 1"), 0);
        // setImmediate(() => console.log("setImmediate 1"));
        // fs.readFile('./test-file.txt', ()=>{
        //     console.log('I/O finished')
        //     console.log('------top level code execution finised , now callback inside callback starts------')

        //     setTimeout(() => console.log("setTimeout 2"), 0);
        //     setTimeout(() => console.log("setTimeout 3"), 3000);
        //     setImmediate(() => console.log("setImmediate 2"));
        //     process.nextTick(() => console.log("Process.nextTick"));

        //     // crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        //     //     console.log(Date.now() - start, "Password encrypted 1");
        //     // })
        //     // crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        //     //     console.log(Date.now() - start, "Password encrypted 2");
        //     // })
        //     // crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        //     //     console.log(Date.now() - start, "Password encrypted 3");
        //     // })
        //     // crypto.pbkdf2('password', 'salt', 100000, 1024, 'sha512', () => {
        //     //     console.log(Date.now() - start, "Password encrypted 4");
        //     // })

        //     crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
        //     console.log(Date.now() - start, "Password encrypted 1");
        //     crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
        //     console.log(Date.now() - start, "Password encrypted 2");
        //     crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
        //     console.log(Date.now() - start, "Password encrypted 3");
        //     crypto.pbkdf2Sync('password', 'salt', 100000, 1024, 'sha512')
        //     console.log(Date.now() - start, "Password encrypted 4");
        // })
        // console.log("console top-level code");
    // => code end 

    // => result start
        // console top-level code
        // setTimeout 1
        // setImmediate 1
        // I/O finished
        // ------top level code execution finised , now callback inside callback starts------
        // Process.nextTick
        // setImmediate 2
        // setTimeout 2
        // 1219 Password encrypted 2
        // 1220 Password encrypted 3
        // 1226 Password encrypted 1
        // 1226 Password encrypted 4
        // setTimeout 3
    // => Result end

    // => Explanation start
    // a) 1st ThreadPool takes 2 sec and other 3 doesn't take much time to complete. 
        // change threadpool size to 1 and see every action will take 2 second to complete

        // b) on using pbkdf2Sync, main thread will be blocked . hence all threadpols result will be consoled first
        // then settimeouts will be executed later 

    // => Explanation end

//#endregion 3