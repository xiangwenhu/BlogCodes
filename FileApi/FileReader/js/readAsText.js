function handleFiles(files) {
    if (files.length) {
        var file = files[0];
        var reader = new FileReader();
        reader.onload = () => {
            let jp = new JSONParser(reader.result, '#results')
            jp.init()
        }
        reader.readAsText(file);
    }
}

class JSONParser {
    constructor(source, selector) {
        this.source = source
        this.json = null
        this.rootElement = document.querySelector(selector)
        this.results = []
        this.deep = 0
    }

    init() {
        try {
            this.json = JSON.parse(this.source)
        } catch (e) {
            alert(e)
        }
        this.format(undefined, this.json)
        this.rootElement.innerHTML = this.results.join('<br/>')
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
        let k = key === undefined || key === '' ? '' : `${key}:`
        let v = value === null ? 'null' : value
        return '&nbsp'.repeat(this.deep) + `${k}${value}`
    }

} 