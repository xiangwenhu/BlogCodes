/* 计算点的位置:Begin*/
function circleSP(radius, length) {
    this.length = length;
    this.radius = radius;
}

circleSP.prototype.getAVAngle = function () {
    return Math.PI * 2 / this.length;
}

circleSP.prototype.getAngle = function (i) {
    return this.getAVAngle() * i;
}

circleSP.prototype.getPos = function (i) {
    var r = this.radius,
        angle = this.getAngle(i),
        p = {
            x: r + 1.5 * r * Math.cos(angle).toFixed(2), // 横向1.5倍
            y: r + r * Math.sin(angle).toFixed(2)
        }
    return p;
}

circleSP.prototype.getPoses = function () {
    var points = [], point;
    for (var i = 0; i < this.length; i++) {
        point = this.getPos(i)
        points.push(point)
    }
    return points;
}

/* 计算点的位置:End*/

var systems = [{
    name: 'XXX用户',
    count: 60,
    color: 'blue'
}, {
    name: '会员中心',
    count: 100,
    color: 'red'
}, {
    name: 'XXX交易基础',
    count: 150,
    color: 'silver'
}, {
    name: 'SSO',
    count: 30,
    color: 'green'
}
]

var r = Math.min(main.clientHeight, main.clientWidth) / 2
var cp = new circleSP(r, systems.length)
var poses = cp.getPoses()

function getGData() {
    return systems.map(function (s, i) {
        return {
            name: s.name + '\n' + s.count,
            x: poses[i].x,
            y: poses[i].y,
            symbolSize: 120,
            itemStyle: {
                normal: {
                    color: s.color
                }
            }
        }
    })
}

function getLinks() {
    var s1, s2, links = []
    for (var i = 0; i < systems.length; i++) {
        s1 = systems[i]
        for (var j = 0; j < systems.length; j++) {
            s2 = systems[j]
            if (s1 !== s2) {
                links.push({
                    source: i,
                    target: j,
                    symbolSize: [5, 20],
                    label: {
                        normal: {
                            show: true,
                            formatter: function (params) {
                                return '成功100\n失败0'
                            }
                        }
                    },
                    lineStyle: {
                        normal: {
                            color: 'green'
                        }
                    }
                })
            }
        }
    }
    return links
}




var myChart = echarts.init(document.getElementById('main'))
myChart.showLoading()
var option = {
    title: {
        text: 'Graph 简单示例'
    },
    calculable: false, // 是否启用拖拽重计算特性，默认关闭
    animation: false, // 是否开启动画，默认开启 
    draggable: false,
    animationDurationUpdate: 1500, // 动画时间
    animationEasingUpdate: 'quinticInOut',
    series: [
        {
            type: 'graph',
            layout: 'none',
            symbolSize: 50,
            roam: true,
            draggable: false,
            focusNodeAdjacency: false,
            label: {
                normal: {
                    show: true,
                    fontSize: 10
                }
            },
            edgeSymbol: ['circle', 'arrow'],
            edgeSymbolSize: [4, 10],
            edgeLabel: {
                normal: {
                    textStyle: {
                        fontSize: 20
                    }
                },
                show: false
            },
            data: getGData(),
            // links: [],
            links: getLinks(),
            lineStyle: {
                normal: {
                    opacity: 1,
                    width: 2,
                    curveness: 0.2,
                    color: 'green'
                }
            }
        }
    ]
};


myChart.setOption(option);
setTimeout(() => {
    myChart.hideLoading()
}, 1500)
myChart.on('click', function (param) {
    console.log(param)
})


window.addEventListener('resize', function () {
    myChart.resize({
        width: document.documentElement.clientWidth,
        height: document.documentElement.clientHeight
    })
});

window.onerror = function (errorMessage, scriptURI, lineNumber, columnNumber, errorObj) {
    console.log(arguments)
}


