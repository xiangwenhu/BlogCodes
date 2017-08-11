var container = document.querySelector('.container')

var count = 0
container.addEventListener('mousemove', getUserAction)
function getUserAction() {
    count++
    container.innerText = count
}