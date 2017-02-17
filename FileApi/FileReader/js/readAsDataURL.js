const IMAGE_MAX_SIZE = 2
let iLeft, iRight, iTop, iBottom

fileImageCut.addEventListener('change', (ev) => {
    let files = ev.target.files, file;
    //检查图片类型
    if (files.length && (file = files[0])) {
        if (!checkFile(file)) {
            return
        }
        //重置高宽
        imgPreview.removeAttribute('height')
        imgPreview.removeAttribute('width')
        imgPreview.style.width = imgPreview.style.height = null
        imgPreview.removeAttribute('width')
        imgResult.style.width = null

        let fr = new FileReader()
        fr.onload = () => {
            imgPreview.onload = () => {
                resizeImage(imgPreview)
                //计算图片相对浏览器的限值
                iLeft = imgPreview.getBoundingClientRect().left + document.documentElement.scrollLeft
                iTop = imgPreview.getBoundingClientRect().top + document.documentElement.scrollTop
                iRight = iLeft + imgPreview.clientWidth
                iBottom = iTop + imgPreview.clientHeight
            }
            imgResult.src = imgPreview.src = fr.result

        }
        //如果错误，抛出异常
        fr.onerror = (ev) => {
            alert(ev.target.error)
        }
        fr.readAsDataURL(file)
    }
}, false)



function checkFile(file) {
    if (!file.type.startsWith("image")) {
        alert('不是有效的图片')
        return false
    }
    if (file.size > IMAGE_MAX_SIZE * 1024 * 1024) {
        alert(`上传的图片不允许大于${IMAGE_MAX_SIZE}M`)
        return false
    }
    return true
}

function resizeImage(img) {
    let h = img.height, w = img.width,
        ph = img.parentElement.clientHeight, pw = img.parentElement.clientWidth,
        phc = h / ph, pwc = w / pw
    phc > pwc ? img.height = ph : img.width = pw

}

imgPreview.addEventListener('dragenter ', ev => {
    console.log('dragenter')
    return false
}, false)






let cLeft, cRight, cTop, cBottom, cOffsetX, cOffsetY, cBorderWidth = Number.parseInt(cutter.style.borderWidth.replace('px', ''))




cutter.addEventListener('dragstart', ev => {
    cOffsetX = ev.offsetX
    cOffsetY = ev.offsetY
    //let dragIcon = document.createElement("img") 
    //dragIcon.width = cutter.width
   // dragIcon.height = cutter.height   
    //ev.dataTransfer.setDragImage(dragIcon, 0, 0);
    console.log('dragstart')
    return false
}, false)

cutter.addEventListener('dragover', ev => {
    //ev.stopPropagation()
    //ev.preventDefault()
    console.log('dragover')
    return false
}, false)

cutter.addEventListener('dragleave', ev => {
    //ev.stopPropagation()
    //ev.preventDefault()
    console.log('dragleave')
    return false
}, false)

cutter.addEventListener('drop', ev => {
    console.log('drop')
}, false)

cutter.addEventListener('dragend', ev => {
    cLeft = ev.clientX - cOffsetX - cBorderWidth
    cTop = ev.clientY - cOffsetY - cBorderWidth
    cRight = cLeft + cutter.clientWidth + cBorderWidth
    cBottom = cTop + cutter.clientHeight + cBorderWidth

    if (!iTop || cTop < iTop || cLeft < iLeft || cRight > iRight || cBottom > iBottom) {
        ev.stopPropagation()
        ev.preventDefault()
    } else {
        cutter.style.left = (cLeft - iLeft) + 'px'
        cutter.style.top = (cTop - iTop) + 'px'
    }
}, false)