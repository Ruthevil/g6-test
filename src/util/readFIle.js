/**
 * Created by 86185 in 2020/8/9 on 10:53
 */
// 该文件必须在node环境下执行，直接将文件内容copy到node环境中执行
const readPath = "D:\\workspace\\maptalks-test\\src\\data\\les-miserables.gexf";
const writePath = "D:\\workspace\\maptalks-test\\src\\data\\27-graph.txt";

Promise.resolve(fs.readFileSync(readPath)).then(res => {
    console.log(res);
    fs.writeFile(writePath, res, (info) => {
        console.log("数据已经写入文件",info)
    })
})