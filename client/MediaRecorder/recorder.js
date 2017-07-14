navigator.getUserMedia = (navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia)

let btnRecord = document.querySelector('#btnRecord'),
    btnCancel = document.querySelector('#btnCancel'),
    btnSave = document.querySelector('#btnSave'),
    labelTiming = document.querySelector('#timing'),
    audioPre = document.querySelector('#audioPreview')

if (navigator.getUserMedia && !(MediaRecorder in window)) {
    var constraints = { audio: true }
    var chunks = [], recording = false,
        startTime = 0, tickets = null,
        mediaRecorder

    var onSuccess = function (stream) {

        mediaRecorder = new MediaRecorder(stream)

        mediaRecorder.onstop = function (e) {
            var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' })
            var audioURL = window.URL.createObjectURL(blob)
            audioPre.src = audioURL
        }

        mediaRecorder.ondataavailable = function (e) {
            chunks.push(e.data)
        }

        registerEvents()

    }

    var registerEvents = function () {

        btnRecord.addEventListener('click', function (ev) {
            startTime = new Date()
            recording = !recording
            if (recording) {
                if (mediaRecorder && mediaRecorder.state != 'recording') {
                    mediaRecorder.start()
                }
                tickets = setInterval(function () {
                    labelTiming.innerText = ((new Date() - startTime) / 1000).toFixed(1) + 's'
                }, 100)
            } else {
                clearInterval(tickets)
                labelTiming.innerText = ''
                if (mediaRecorder && mediaRecorder.state != 'inactive') {
                    mediaRecorder.stop()
                }
                this.style.display = 'none'
                btnCancel.style.display = btnSave.style.display = 'block'
            }
            this.innerText = recording ? '停止' : '录制'
        })

        btnSave.addEventListener('click', function () {
            var blob = new Blob(chunks, { 'type': 'audio/ogg; codecs=opus' }),
                time = new Date().toLocaleString().replace(/[^\x00-\xff]/g,'')
            var name = window.prompt('请输入音乐的名字',`我的音乐-${time}`)
            recording = false
            btnRecord.style.display = 'block'
            btnSave.style.display = btnCancel.style.display = 'none'
            labelTiming.innerText = ''         
            audioPre.src = ''
            chunks = []

        })

        btnCancel.addEventListener('click', function () {
            recording = false
            btnRecord.style.display = 'block'
            btnSave.style.display = btnCancel.style.display = 'none'
            labelTiming.innerText = ''
            clearInterval(tickets)
            audioPre.src = ''
            chunks = []
            if (mediaRecorder && mediaRecorder.state != 'inactive') {
                mediaRecorder.stop()
            }
        })
    }


    var onError = function (err) {
        console.log('The following error occured: ' + err);
    }


    navigator.getUserMedia(constraints, onSuccess, onError);


} else {
    console.log('getUserMedia not supported on your browser!');
}
