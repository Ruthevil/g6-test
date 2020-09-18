const COLLAPSE_ICON = function COLLAPSE_ICON(x, y, r) {
    return [
        ['M', x - r, y - r],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x + 2 - r, y - r],
        ['L', x + r - 2, y - r],
    ];
};
const EXPAND_ICON = function EXPAND_ICON(x, y, r) {
    return [
        ['M', x - r, y - r],
        ['a', r, r, 0, 1, 0, r * 2, 0],
        ['a', r, r, 0, 1, 0, -r * 2, 0],
        ['M', x + 2 - r, y - r],
        ['L', x + r - 2, y - r],
        ['M', x, y - 2 * r + 2],
        ['L', x, y - 2],
    ];
};
let style = {
    default: {
        nodeStyle: {
            stroke: '#333', // 节点描边色
            fill: '#fff', // 节点填充色
            cursor: 'default',
        },
        labelStyle: {
            fill: "#333", // 文本颜色
        },
        edgeStyle: {
            stroke: '#333',
            endArrow: {
                path: 'M 0,0 L 8,4 A 5,5,0,0,1,8,-4 Z',
                fill: '#333'
            }
        },
    },
    highlight: {
        nodeStyle: {
            stroke: '#FD9839',
            fill: '#fff',
            cursor: 'pointer',
        },
        labelStyle: {
            fill: "#FD9839",
        },
        edgeStyle: {
            stroke: '#FD9839',
            endArrow: {
                path: 'M 0,0 L 8,4 A 5,5,0,0,1,8,-4 Z',
                fill: '#FD9839'
            }
        }
    }
};

G6.registerNode('card-node', {
    /**
     * 绘制节点，包含文本
     * @param  {Object} cfg 节点的配置项
     * @param  {G.Group} group 图形分组，节点中图形对象的容器
     * @return {G.Shape} 返回一个绘制的图形作为 keyShape，通过 node.get('keyShape') 可以获取。
     */
    draw: function drawShape(cfg, group) {
        const r = 2;
        const w = cfg.size[0];
        const h = cfg.size[1];

        const calcStrLen = str => {
            let len = 0;
            for (let i = 0; i < str.length; i++) {
                if (str.charCodeAt(i) > 0 && str.charCodeAt(i) < 128) {
                    len++;
                } else {
                    len += 2;
                }
            }
            return len;
        };
        //解决文字过长溢出问题
        const fittingString = (str, maxWidth, fontSize) => {
            const fontWidth = fontSize * 1.3; // 字号+边距
            maxWidth = maxWidth * 2; // 需要根据自己项目调整
            const width = calcStrLen(str) * fontWidth;
            const ellipsis = '…';
            if (width > maxWidth) {
                const actualLen = Math.floor((maxWidth - 10) / fontWidth);
                return str.substring(0, actualLen) + ellipsis;
            }
            return str;
        };

        const shape = group.addShape('rect', {
            attrs: {
                ...style.default.nodeStyle,
                x: -w / 2,
                y: -h / 2,
                width: w, //200,
                height: h, // 60
                radius: r,
            },
            name: 'main-box',
        });

        group.addShape('text', {
            attrs: {
                ...style.default.labelStyle,
                textAlign: 'center',
                textBaseline: 'middle',
                x: 0,
                y: 0,
                lineHeight: 20,
                text: fittingString(cfg.label, 100, 14),
                isLabel: true
            },
            name: 'text-shape',
        });

        if (cfg.children) {
            group.addShape("marker", {
                attrs: {
                    x: -w / 4,
                    y: h / 2 + 6,
                    r: 6,
                    cursor: "pointer",
                    symbol: EXPAND_ICON,
                    stroke: "green",
                    lineWidth: 1,
                    fill: "#fff"
                },
                name: "add-icon"
            });
        }
        group.addShape("marker", {
            attrs: {
                x: w / 4,
                y: h / 2 + 6,
                r: 6,
                cursor: "pointer",
                symbol: COLLAPSE_ICON,
                stroke: "red",
                lineWidth: 1,
                fill: "#fff"
            },
            name: "delete-icon"
        });
        return shape;
    },
    setState(name, value, item) {
        const group = item.getContainer();
        const boxShape = group.get('children')[0]; // 顺序根据 draw 时确定
        const textShape = group.get('children')[1];
        if (name === "highlight") {
            if (value) {
                boxShape.attrs = Object.assign(boxShape.attrs, style.highlight.nodeStyle);
                textShape.attrs = Object.assign(textShape.attrs, style.highlight.labelStyle);
            } else {
                boxShape.attrs = Object.assign(boxShape.attrs, style.default.nodeStyle);
                textShape.attrs = Object.assign(textShape.attrs, style.default.labelStyle);
            }
        }
    }
});

const data = {
    id: 'A',
    label: "自定义标签",
    children: [
        {
            id: 'A1',
            label: "情报标签目录",
            children: [
                {id: 'A11', label: "情报标签1"},
                {id: 'A12', label: "情报标签2"},
                {id: 'A13', label: "情报标签3"},
                {id: 'A14', label: "情报标签4"}
            ],
        },
        {
            id: 'A2',
            label: "党派组织标签目录",
            children: [
                {
                    id: 'A21',
                    label: "党派组织标签1"
                },
                {
                    id: 'A22',
                    label: "党派组织标签2"
                },
            ],
        },
    ],
};

const width = document.getElementById('mountNode').scrollWidth;
const height = document.getElementById('mountNode').scrollHeight || 500;

const graph = new G6.TreeGraph({
    container: 'mountNode',
    width,
    height,
    defaultNode: {
        type: 'card-node',
        size: [120, 40],
    },
    defaultEdge: {
        type: 'cubic-horizontal',
        style: style.default.edgeStyle,
    },
    layout: {
        type: 'indented',
        direction: 'LR',
        dropCap: false,
        indent: 200,
        getHeight: () => {
            return 60;
        },
    },
});

/**
 * 节点点击事件
 */
let number = 1;
graph.on('node:click', (e) => {
    const node = e.item;
    const name = e.target.get('name');

    const currentNodeId = node.get("id");
    const curGraphHeight = graph.get("height");

    if (name === "add-icon") {
        // TODO：弹窗提供用户自定义输入节点名称
        console.log("add-icon");
        console.log(curGraphHeight);
        graph.height = currentNodeId + 100;  // todo:如何增加节点的同时自改整个graph的高度
        let data = {
            id: `${currentNodeId}-${number++}`,
            label: "我是新节点"
        };
        graph.addChild(data, currentNodeId)
    }
    if (name === "delete-icon") {
        console.log("delete-icon");
        // TODO：递归删除当前节点的子节点
        graph.removeItem(node);
        // 请求后台，成功返回后重新渲染
        graph.render();
        graph.fitView();
    }

});

/**
 * 鼠标移入元素范围内触发，追寻上游和下游节点，并highlight，其余节点置灰；
 */
graph.on("node:mouseenter", (ev) => {
    const item = ev.item;
    const edgeItems = ev.item.getInEdges() || [];
    const sonEdgeItems = ev.item.getOutEdges() || [];
    //追寻上游节点
    findParents(edgeItems, item, item, style.highlight);
    //追寻下游节点
    findSons(sonEdgeItems, item, item, style.highlight);
    //当前节点
    graph.setItemState(item, 'highlight', true);
    //其余节点置灰
    changeOthers(style.default);
});
/**
 * 鼠标在元素内部移到时不断触发，弹出tooltip；
 */
graph.on("node:mousemove", (ev) => {
    const {item, target, x, y} = ev;
    const {
        attrs: {isLabel},
    } = target;
    const model = item.getModel();
    const {label, id} = model;
    if (isLabel) {
        const position = graph.getClientByPoint(x, y);
        createTooltip(position, label, id);
    } else {
        removeTooltip(id);
    }
});
/**
 * 鼠标移出目标元素后触发，移除tooltip；
 */
graph.on("node:mouseout", (ev) => {
    const {item, target} = ev;
    const {
        attrs: {isLabel},
    } = target;
    const model = item.getModel();
    const {id} = model;
    if (isLabel) {
        removeTooltip(id);
    }
});
/**
 * 鼠标移出元素范围时触发，回到所有节点原始状态。
 */
graph.on('node:mouseleave', ev => {
    const item = ev.item;
    clearStates(style.default);
});

graph.data(data);
graph.render();
graph.fitView();