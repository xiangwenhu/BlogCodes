var req = new Request('/源码/fetch/fetch.js')

fetch(req, {
    mode: 'same-origin',
    headers: {
        'Content-Type': 'application/json'
    }
}).then(function(res) {

    console.log(res.headers.keys().next().value)

    for (let header of res.headers) {
        console.log(header);       
    }
    return res.text()
}).then(function(content) {
    console.log('complete');
})
