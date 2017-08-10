class CanvasProgress {
    constructor(cv, options = {
        bgColor: '#123456',
        cBgColor: 'green',
        edgeWidth: 20
    }) {

        if (!cv || !cv.getContext) {
            throw new Error('参数cv为空或者getContext方法未定义')
        }

        this._ctx = cv.getContext('2d')
        this._diameter = this._getDiameter(cv)  //直径
        this._radius = Math.ceil(this._diameter / 2) //半径
        this._options = Object.assign({
            bgColor: '#123456', //未加载的背景色
            cBgColor: 'green', //已加载的背景色
            edgeWidth: 20,     //边款
            textMaxWidth: this._radius  //进度文本最大长度
        }, options)
        this._options.edgeWidth = Math.min(this._radius * 0.28, this._options.edgeWidth) //重新计算
        this._circleParams = {
            x: this._radius,//圆心的x轴坐标值
            y: this._radius,//圆心的y轴坐标值
            r: Math.floor(this._radius - this._options.edgeWidth / 2 - 1) //圆的半径
        }

        this._resizeCanvas(cv)  //调整canvas宽高一致
        this._initialize() //绘制背景圆
    }


    /**
     * 通过canvas获得直径
     * @param {*canvas对象} cv 
     */
    _getDiameter(cv) {
        return Math.max(cv.height || 0, cv.width || 0) || 200
    }

    /**
     * 进度转换角度
     * @param {*进度} progress 
     */
    _getAngle(progress) {
        return (progress / 100) * Math.PI * 2
    }

    _resizeCanvas(cvProgress) {
        cvProgress.width = cvProgress.height = this._diameter
    }

    /**
     * 调整canvas宽高一致
     */
    _initialize() {
        let ctx = this._ctx
        // 开始一个新的绘制路径
        ctx.beginPath()
        //设置弧线的颜色为蓝色
        ctx.strokeStyle = this._options.bgColor
        ctx.lineWidth = this._options.edgeWidth
        //以canvas中的坐标点(100,100)为圆心，绘制一个半径为50px的圆形
        ctx.arc(this._circleParams.x, this._circleParams.y, this._circleParams.r, 0, Math.PI * 2, false)
        //按照指定的路径绘制弧线
        ctx.stroke()
    }

    /**
     * 更近进度
     * @param {*进度 0-100} progressValue 
     * @param {*绘制圆的设置} circleSettings 
     * @param {*绘制文本的设置} progressTextSettings 
     */
    updateProgress(progressValue, circleSettings, progressTextSettings) {
        if (progressValue <= 0) {
            return
        }
        this._updateCircle(progressValue, circleSettings)
        this._updateProgressText(progressValue, progressTextSettings)
    }

    /**
     * 绘制圆
     * @param {*进度} progressValue 
     * @param {*设置} settings 
     */
    _updateCircle(progressValue, settings) {
        let ctx = this._ctx
        ctx.beginPath()
        let angle = this._getAngle(progressValue)

        ctx.strokeStyle = this._options.cBgColor
        ctx.lineWidth = this._options.edgeWidth

        if (settings) {
            Object.keys(settings).forEach(k => {
                ctx[k] = settings[k]
            })
        }

        ctx.arc(this._circleParams.x, this._circleParams.y, this._circleParams.r, 0 + Math.PI * 1.5, angle + Math.PI * 1.5, false)
        ctx.stroke()
    }

    /**
     * 绘制进度文本
     * @param {*进度} progressValue 
     * @param {*设置} settings 
     */
    _updateProgressText(progressValue, settings) {

        if (progressValue < 0 || progressValue > 100) {
            return
        }

        let ctx = this._ctx,
            r = this._radius,
            fontSize = this._getFontSize(settings)
        ctx.clearRect(r * 0.5, r * 0.5, r, r)
        ctx.font = `${fontSize}px sans-serif`
        ctx.fillStyle = this._getTextGradient()
        if (settings) {
            Object.keys(settings).forEach(k => {
                ctx[k] = settings[k]
            })
        }

        ctx.fillText(progressValue + '%', this._circleParams.x - this._options.textMaxWidth / 2, this._circleParams.y + fontSize / 2, this._options.textMaxWidth)
    }

    /**
     * 渐变设置
     */
    _getTextGradient() {
        var gradient = this._ctx.createLinearGradient(0, 0, 100, 0);
        gradient.addColorStop("0", "red");
        gradient.addColorStop("0.5", "blue");
        gradient.addColorStop("1.0", "green");
        return gradient
    }

    /**
     * 获得当前文字大小
     * @param {*设置} settings 
     */
    _getFontSize(settings) {
        if (settings && settings.font) {
            let matchItem = settings.font.match(/\d{1,2}/)
            if (matchItem) {
                return Number.parseInt(matchItem[0])
            }
        }
        return this._radius * 0.6
    }

}