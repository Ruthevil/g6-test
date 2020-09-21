/**
 * Created by baidm in 2020-09-18 on 上午 9:30
 */
/**
 * 解决文字过长溢出问题
 * @param {string} str 
 */
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
/**
 * 创建提示
 * @param position 鼠标点击的位置
 * @param name 节点名称
 * @param id 节点id
 */
const createTooltip = (position, name, id) => {
    const offsetTop = -60;
    const existTooltip = document.getElementById(id);
    const x = position.x + 'px';
    const y = position.y + offsetTop + 'px';
    if (existTooltip) {
        existTooltip.style.left = x;
        existTooltip.style.top = y;
    } else {
        // content
        const tooltip = document.createElement('div');
        const span = document.createElement('span');
        span.textContent = name;
        tooltip.style.padding = '10px';
        tooltip.style.background = 'rgba(0,0,0, 0.65)';
        tooltip.style.color = '#fff';
        tooltip.style.borderRadius = '4px';
        tooltip.appendChild(span);
        // box
        const div = document.createElement('div');
        div.style.position = 'absolute';
        div.style.zIndex = '99';
        div.id = id;
        div.style.left = x;
        div.style.top = y;
        div.appendChild(tooltip);
        document.body.appendChild(div);
    }
};
/**
 * 删除提示
 * @param id
 */
const removeTooltip = (id) => {
    const removeNode = document.getElementById(id);
    if (removeNode) {
        document.body.removeChild(removeNode);
    }
};
const findNodeBySource = function (source) {
    const nodes = graph.getNodes();
    let res = null;
    if (nodes.length) {
        res = nodes.find((item) => {
            return item._cfg.id === source;
        })
    }
    return res;
};
const findNodeByTarget = function (target) {
    const nodes = graph.getNodes();
    let res = null;
    if (nodes.length) {
        res = nodes.find((item) => {
            return item._cfg.id === target;
        })
    }
    return res;
};
/**
 * 追寻当前节点的上游节点
 * @param edgeItems
 * @param initItem
 * @param lastItem
 * @param nodeStyle
 * @param labelStyle
 * @param edgeStyle
 */
const findParents = function (edgeItems, initItem, lastItem, {nodeStyle, labelStyle, edgeStyle}) {
    edgeItems.length && edgeItems.forEach((edgeItem) => {
        const parentNode = findNodeBySource(edgeItem.getModel().source);
        const indexNode = findNodeByTarget(edgeItem.getModel().target);
        graph.setItemState(edgeItem, 'highlight', true);
        graph.update(edgeItem, {
            style: edgeStyle
        });
        if (parentNode) {
            if (parentNode._cfg.id !== initItem._cfg.id && parentNode._cfg.id !== lastItem._cfg.id) {
                graph.setItemState(parentNode, 'highlight', true);
                graph.update(parentNode, {
                    style: nodeStyle,
                    labelCfg: {
                        style: labelStyle
                    }
                });
                findParents(parentNode.getInEdges(), initItem, indexNode, {nodeStyle, labelStyle, edgeStyle});
            }
        }
    });
};
/**
 * 追寻当前节点的下游节点
 * @param edgeItems
 * @param initItem
 * @param lastItem
 * @param nodeStyle
 * @param labelStyle
 * @param edgeStyle
 */
const findSons = function (edgeItems, initItem, lastItem, {nodeStyle, labelStyle, edgeStyle}) {
    edgeItems.length && edgeItems.forEach((edgeItem) => {
        const indexNode = findNodeByTarget(edgeItem.getModel().source);
        const sonNode = findNodeByTarget(edgeItem.getModel().target);
        graph.setItemState(edgeItem, 'highlight', true);
        graph.update(edgeItem, {
            style: edgeStyle
        });
        if (sonNode) {
            if (sonNode._cfg.id !== initItem._cfg.id && sonNode._cfg.id !== lastItem._cfg.id) {
                graph.setItemState(sonNode, 'highlight', true);
                graph.update(sonNode, {
                    style: nodeStyle,
                    labelCfg: {
                        style: labelStyle
                    }
                });
                findSons(sonNode.getOutEdges(), initItem, indexNode, {nodeStyle, labelStyle, edgeStyle});
            }
        }
    });
};
/**
 * 置灰节点
 * @param nodeStyle
 * @param labelStyle
 * @param edgeStyle
 */
const changeOthers = function ({nodeStyle, labelStyle, edgeStyle}) {
    graph.getNodes() && graph.getNodes().forEach((item) => {
        if (item.getStates().findIndex(node => {
            return node === 'highlight'
        }) === -1) {
            graph.update(item, {
                style: nodeStyle,
                labelCfg: {
                    style: labelStyle
                }
            })
        }
    })
};
const clearStates = function ({nodeStyle, labelStyle, edgeStyle}) {
    graph.getNodes() && graph.getNodes().forEach((item) => {
        if (item.getStates().findIndex(node => {
            return node === 'highlight'
        }) !== -1) {
            graph.setItemState(item, 'highlight', false);
        }
        graph.update(item, {
            style: nodeStyle,
            labelCfg: {
                style: labelStyle
            }
        })
    });
    graph.getEdges() && graph.getEdges().forEach((item) => {
        if (item.getStates().findIndex(edge => {
            return edge === 'highlight'
        }) !== -1) {
            graph.setItemState(item, 'highlight', false);
            graph.update(item, {
                style: edgeStyle
            })
        }
    })
};