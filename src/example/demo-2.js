/**
 * Created by baidm in 2020/9/17 on 13:22
 *
 */
const data = {
    // 点集
    nodes: [
        {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: "起始点"
        },
        {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label: "结束点"
        },
    ],
    // 边集
    edges: [
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            label: "我是连线"
        },
    ],
};

const graph = new G6.Graph({
    container: 'mountNode', // String | HTMLElement，必须
    width: 800, // Number，必须，图的宽度
    height: 500, // Number，必须，图的高度
    fitView: true, // 将图适配到画布中
    fitViewPadding: [20, 40, 50, 20], // 画布上四周的留白宽度
    animate: true, // 是否启用图动画
    // 图上行为模式的集合
    modes: {
        default: ['drag-node', 'drag-canvas']
    },
    // 节点的默认属性
    defaultNode: {
        type: 'rect',
        color: '#ff602c',
        size: [100,50],             // 元素的大小
        labelCfg: {           // 标签配置属性
            positions: 'center',// 标签的属性，标签在元素中的位置
            style: {            // 包裹标签样式属性的字段 style 与标签其他属性在数据结构上并行
                fontSize: 12      // 标签的样式属性，文字字体大小
            }
        }
    },
    // 边的默认属性
    defaultEdge: {
        type: 'polyline',
        color: '#3ca8ff',
    },
    // 节点其他状态下的样式
    nodeStateStyles: {
        hover: {},
        select: {}
    },
    // 边在其他状态下的样式
    edgeStateStyles: {
        hover: {},
        select: {}
    }
});

graph.data(data); // 读取数据源到图上
graph.render(); // 渲染图