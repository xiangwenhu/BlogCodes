function handleFiles(files) {
    if (files.length) {
        let file = files[0], reader = new FileReader()
        reader.onload = () => {
            (new JSONParser(reader.result, '#results')).init()
        }
        reader.readAsText(file)
    }
}
class JSONParser {
    constructor(source, selector) {
        this.source = source
        this.selector = selector
        this.results = []
        this.deep = 0      
    }
    init() {
        try {
            let json = JSON.parse(this.source)
            this.format(undefined, json)
            document.querySelector(this.selector).innerHTML = this.results.join('<br/>')
        } catch (e) {
            alert(e)
        }
    }
    format(key = '', value) {
        if (value instanceof Array) {
            this.results.push(this.generateLine(key, '['))
            this.deep++
            value.forEach((v, i) => {
                this.format(i, v)
            })
            this.deep--
            this.results.push(this.generateLine(undefined, ']'))
        } else if (value && typeof value == 'object') {
            this.results.push(this.generateLine(key, '{'))
            Object.keys(value).forEach(k => {
                this.deep++
                this.format(k, value[k])
                this.deep--
            })
            this.results.push(this.generateLine(undefined, '}'))
        } else {
            this.results.push(this.generateLine(key, value))
        }
    }
    generateLine(key, value) {
        let k = key === undefined || key === '' ? '' : `${key}:`,
            v = value === null ? 'null' : value
        return '&nbsp'.repeat(this.deep) + `${k}${v}`
    }
} 