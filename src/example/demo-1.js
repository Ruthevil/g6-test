/**
 * Created by baidm in 2020/9/17 on 13:22
 * 画出两个节点，带有节点label，连线，并附上线label
 */
const data = {
    // 点集
    nodes: [
        {
            id: 'node1', // String，该节点存在则必须，节点的唯一标识
            x: 100, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label:"起始点"
        },
        {
            id: 'node2', // String，该节点存在则必须，节点的唯一标识
            x: 300, // Number，可选，节点位置的 x 值
            y: 200, // Number，可选，节点位置的 y 值
            label:"结束点"
        },
    ],
    // 边集
    edges: [
        {
            source: 'node1', // String，必须，起始点 id
            target: 'node2', // String，必须，目标点 id
            label:"我是连线"
        },
    ],
};

const graph = new G6.Graph({
    container: 'mountNode', // String | HTMLElement，必须
    width: 800, // Number，必须，图的宽度
    height: 500, // Number，必须，图的高度
});

graph.data(data); // 读取数据源到图上
graph.render(); // 渲染图