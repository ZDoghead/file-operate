# 介绍

每一个文件或目录，都是一个对象的形式。

作用：获取传入路径下的所有子目录或文件

# 使用

**例子：**
```js
// 导入file-operate
const readDir = require(path.resolve(__dirname, 'file-operate'));

const path = require('path');

// 得到需要获取子目录或文件的路径
const filename = path.resolve(__dirname, 'test');

let children = null;
readDir(filename).then(res => {
  children = res;
})

```