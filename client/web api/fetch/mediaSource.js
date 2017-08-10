
//http://nickdesaulniers.github.io/mp4info/
//https://msdn.microsoft.com/en-us/library/dn254964(v=vs.85).aspx
//是否支持webm MediaSource.isTypeSupported('video/webm; codecs="vorbis,vp8"');
//是否支持mp4 MediaSource.isTypeSupported('video/mp4; codecs="avc1.42E01E,mp4a.40.2"');
//是否支持ts MediaSource.isTypeSupported('video/mp2t; codecs="avc1.42E01E,mp4a.40.2"');
var mimeCodec = 'video/mp4; codecs="avc1.64001e, mp4a.40.2"'
if ('MediaSource' in self && MediaSource.isTypeSupported(mimeCodec)) {
    var mediaSource = new MediaSource()
    mediaSource.addEventListener('sourceopen', sourceOpen)
    player.src = URL.createObjectURL(mediaSource)

    var tempArrayBuffer
    function sourceOpen() {
        var mediaSource = this;
        var sourceBuffer = mediaSource.addSourceBuffer(mimeCodec);

        sourceBuffer.addEventListener('updateend', function () {
            mediaSource.endOfStream();
            player.play()
        })


        sourceBuffer.addEventListener('error', function (ev) {

        })


        fetch('p0022w4yvpo.p312.1.mp4').then(response => {
            var reader = response.body.getReader();
            var contentLength = +response.headers.get('content-length')
            var bytesReceived = 0
            tempArrayBuffer = new Uint8Array(contentLength)
            reader.read().then(function processResult(result) {
                if (result.done) {
                    console.log("Fetch complete");
                    sourceBuffer.appendBuffer(tempArrayBuffer);
                    return;
                }
                bytesReceived += result.value.length
                tempArrayBuffer.set(result.value, result.value.bytesReceived)

                return reader.read().then(processResult);
            });
        })


    }
}