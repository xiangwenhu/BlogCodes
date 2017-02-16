const IMAGE_MAX_SIZE = 2

fileImageCut.addEventListener('change', (ev) => {
    let files = ev.target.files, file;
    //检查图片类型
    if (files.length && (file = files[0])) {
        if(!checkFile(file)){
            return
        }
        //重置高宽
        imgPreview.removeAttribute('height')
        imgPreview.removeAttribute('width')
        let fr = new FileReader()
        fr.onload = () => {
            imgPreview.onload = () => {
                resizeImage(imgPreview)
            }
            imgPreview.src = fr.result
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
    if(file.size > IMAGE_MAX_SIZE * 1024 * 1024){
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
