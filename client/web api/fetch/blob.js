var barr = new Uint8Array(),
    currentLength = 0
fetch('p0022w4yvpo.p312.1.mp4').then(response => {
    // response.body is a readable stream.
    // Calling getReader() gives us exclusive access to the stream's content
    var reader = response.body.getReader();
    var bytesReceived = 0;
    contentLength = + response.headers.get('content-length')
    barr = new Uint8Array(contentLength)

    // read() returns a promise that resolves when a value has been received
    reader.read().then(function processResult(result) {
        // Result objects contain two properties:
        // done  - true if the stream has already given you all its data.
        // value - some data. Always undefined when done is true.
        if (result.done) {
            console.log("Fetch complete");
            player.src = window.URL.createObjectURL(new Blob([barr]))
            player.play()
            return;
        }
        // result.value for fetch streams is a Uint8Array


        barr.set(result.value, bytesReceived)
        bytesReceived += result.value.length;

        if (bytesReceived < contentLength / 2) {
            //player.src = window.URL.createObjectURL(new Blob([barr]))
        }
        console.log(player.src)

        console.log('Received', bytesReceived, 'bytes of data so far');

        // Read some more, and call this function again
        return reader.read().then(processResult);
    });
}) 