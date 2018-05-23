
function createRandomItemStyle() {
    return {
        normal: {
            color: 'rgb(' + [
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160),
                Math.round(Math.random() * 160)
            ].join(',') + ')'
        }
    };
}

/**
 * 字符云Trends
 * param ( title,data )=>( 标题,数据 )
 * value ( 字符云 , {'组A':123,'组B':456,'组C':789} )
 */
export function Trends(
    title,data){

    let dt = []
    for(let index in data){
        let obj = {}
        obj['name'] = data[index].name
        obj['value'] = data[index].value
        obj['textStyle'] = createRandomItemStyle()
        dt.push(obj)
    }
    return {
        title: {
            text: title,
        },
        tooltip: {
            show: true
        },
        series: [{
            name: title,
            type: 'wordCloud',
            size: ['80%', '80%'],
            textRotation : [0, 45, 90, -45],
            textPadding: 0,
            autoSize: {
                enable: true,
                minSize: 14
            },
            data: dt
        }]
    }
}


/**
 * 时间线
 * param ( title,lineName,data )=>( 标题,线条名称，数据 )
 * value ( 周报,代码发布数目,[1,2,3,4,5,6,7] )
 */
export function TimeLine(
    title,lineName,data){

    let now = new Date().toLocaleDateString()
    let item = []
    let value = []
    for(let index in data){
        item.push(data[index].name)
        value.push(data[index].value)
    }
    return {
        title: {
            text: title,
            subtext: now
        },
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data: [lineName]
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },   
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                magicType : {show: true, type: ['line', 'bar']},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable: true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : item
            }
        ],
        yAxis: [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value}'
                }
            }
        ],
        series: [
            {
                name: lineName,
                type: 'line',
                data: value,
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            }
        ]
    }
}


/**
 * 饼图
 * param ( title,data )=>( 标题,线条名称，数据 )
 * value ( 
 *       周报,[
                    {value:335, name:'直接访问'},
                    {value:310, name:'邮件营销'},
                    {value:234, name:'联盟广告'},
                    {value:135, name:'视频广告'},
                    {value:1548, name:'搜索引擎'}]
         )
 */
export function Pie(title,data){
    let dt = []
    let item = []
    for(let d in data){
        let obj = {}
        obj['name'] = data[d].name
        obj['value'] = data[d].value
        item.push(data[d].name)
        dt.push(obj)
    }
    let now = new Date().toLocaleDateString()
    return {
        title : {
            text: title,
            subtext: now,
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data: item
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                dataView : {show: true, readOnly: false},
                magicType : {
                    show: true, 
                    type: ['pie', 'funnel'],
                    option: {
                        funnel: {
                            x: '25%',
                            width: '50%',
                            funnelAlign: 'left',
                            max: 1548
                        }
                    }
                },
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        toolbox: {
            show : true,
            feature : {
                mark : {show: true},
                restore : {show: true},
                saveAsImage : {show: true}
            }
        },
        calculable : true,
        series : [
            {
                name: title,
                type:'pie',
                radius : '55%',
                center: ['50%', '60%'],
                data: dt
            }
        ]
    }
}