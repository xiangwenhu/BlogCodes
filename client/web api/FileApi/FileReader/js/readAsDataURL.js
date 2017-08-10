const IMAGE_MAX_SIZE = 2
const CUTTER_WIDTH = CUTTER_HEIGHT = 300

class SimpleImageCutter {
    constructor(options) {
        this.fileUpload = options.fileUpload
        this.imgPreview = options.imgPreview
        this.imgResult = options.imgResult
        this.cutter = options.cutter

        this.percentage = this.imgResult.parentElement.clientWidth / this.cutter.clientWidth
        this.iLeft = this.iRight = this.iTop = this.iBottom = null
    }

    init() {
        this.resgiterEvents()
    }

    resgiterEvents() {
        let cLeft, cRight, cTop, cBottom, cOffsetX, cOffsetY,
            cutter = this.cutter, imgPreview = this.imgPreview, cBorderWidth = Number.parseInt(cutter.style.borderWidth.replace('px', '')),
            cPBorderWidth = Number.parseInt(imgPreview.style.borderWidth.replace('px', ''))

        this.fileUpload.addEventListener('change', (ev) => {
            let files = ev.target.files, file;
            //检查图片类型
            if (files.length && (file = files[0])) {
                if (!this.checkFile(file)) {
                    return
                }
                //重置高宽
                imgPreview.removeAttribute('height')
                imgPreview.removeAttribute('width')
                imgPreview.style.width = imgPreview.style.height = null
                imgPreview.style.visibility = 'hidden'
                let fr = new FileReader()
                fr.onload = () => {
                    imgPreview.onload = () => {
                        this.resizeImage()
                        imgPreview.style.visibility = 'visible'
                        this.resizeCutter()
                        this.refreshPercentage()
                        this.resizeResult()
                        //计算图片相对浏览器的限值
                        this.iLeft = imgPreview.getBoundingClientRect().left + document.documentElement.scrollLeft + cPBorderWidth
                        this.iTop = imgPreview.getBoundingClientRect().top + document.documentElement.scrollTop + cPBorderWidth
                        this.iRight = this.iLeft + imgPreview.clientWidth
                        this.iBottom = this.iTop + imgPreview.clientHeight
                    }
                    this.imgResult.src = imgPreview.src = fr.result
                }
                //如果错误，抛出异常
                fr.onerror = ev　=> alert(ev.target.error)                
                fr.readAsDataURL(file)
            }
        }, false)

        cutter.addEventListener('dragstart', ev => {
            cOffsetX = ev.offsetX
            cOffsetY = ev.offsetY
            /*
            let dragIcon = document.createElement("img") 
            dragIcon.src = 'image/drag.jpg'
            dragIcon.width = cutter.width  
            document.body.appendChild(dragIcon) 
            ev.dataTransfer.setDragImage(dragIcon, 0, 0); */
            //cutter.style.border = "2px red solid"   
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

            if (!this.iTop || cTop < this.iTop || cLeft < this.iLeft || cRight > this.iRight || cBottom > this.iBottom) {
                ev.stopPropagation()
                ev.preventDefault()
            } else {
                cutter.style.left = (cLeft - this.iLeft) + 'px'
                cutter.style.top =  (cTop - this.iTop) + 'px'
                imgResult.style.left = -((cLeft - this.iLeft) * this.percentage).toFixed(2) + 'px'
                imgResult.style.top = -((cTop - this.iTop) * this.percentage).toFixed(2) + 'px'
            }
        }, false)
    }

    checkFile(file) {
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

    resizeImage() {
        let img = this.imgPreview, h = img.height, w = img.width,
            ph = img.parentElement.clientHeight, pw = img.parentElement.clientWidth,
            phc = h / ph, pwc = w / pw
        phc > pwc ? img.height = ph : img.width = pw
    }

    resizeCutter() {
        let minValue = Math.min(Math.min(imgPreview.clientHeight, CUTTER_HEIGHT), Math.min(imgPreview.clientWidth, CUTTER_WIDTH))
        cutter.style.height = cutter.style.width = minValue + 'px'
        cutter.style.top = cutter.style.left = null
    }

    resizeResult() {
        imgResult.style.width = (imgPreview.clientWidth * this.percentage).toFixed(2) + 'px'
        imgResult.style.height = (imgPreview.clientHeight * this.percentage).toFixed(2) + 'px'
        imgResult.style.top = imgResult.style.left = null
    }

    refreshPercentage() {
        this.percentage = this.imgResult.parentElement.clientWidth / this.cutter.clientWidth
    }
}

(new SimpleImageCutter({
    fileUpload: fileImageCut,
    imgPreview: imgPreview,
    imgResult: imgResult,
    cutter: cutter
})).init()









