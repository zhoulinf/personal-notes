var basicNum = 0
function add(a,b){
    return a + b;
}


// exports 刚开始是一个空对象，我们可以对这个对象添加很多属性，添加的属性会被导出
/** 
* 当一个js 文件中exports 和modules.exports同时存在，且导出不同对象时，要以modules.exports导出的对象为准，因为本质上，Node中要导出东西时都是通过moduels.exports导出的，（一般情况下，
moduel对象的exports属性的引用指针指向exports对象，但是当modeul.exports的引用指针不指向exports时，导出的东西以module.export为准
*/
// exports.num = basicNum

module.exports = {
    add: add,
    basicNum: basicNum
}