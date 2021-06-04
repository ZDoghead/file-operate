// 读取一个目录中的所有子目录和文件，每个目录或文件都是一个对象

const fs = require('fs');
const path = require('path');

class File {
  constructor(filename, name, ext, size, isFile, createTime, updateTime) {
    this.filename = filename;
    this.name = name;
    this.ext = ext;
    this.size = size;
    this.isFile = isFile;
    this.createTime = createTime;
    this.updateTime = updateTime;
  }

  async getChildren() {
    if (this.isFile) {  // 是一个文件，文件没有子文件或目录
      return [];
    }
    // 不是文件，那就是一个目录
    let children = await fs.promises.readdir(this.filename);
    children = children.map(name => {
      const filename = path.resolve(this.filename, name);
      return File.getFile(filename);
    });
    return Promise.all(children);
  }

  /**
   * 获取文件内容，如果是目录则返回null
   * @param {Boolean} isBuffer 是否以Buffer形式获取，默认值为false
   */
  async getContent(isBuffer = false) {
    if (this.isFile) {  // 是一个文件
      if (isBuffer) {   // 以Buffer形式返回
        return await fs.promises.readFile(this.filename)
      } else {
        return await fs.promises.readFile(this.filename, 'utf-8');
      }
    }
    // 不是文件，是目录
    return null;
  }

  /**
   * 获取一个File对象
   * @param {*} filename 
   */
  static async getFile(filename) {
    const fileStat = await fs.promises.stat(filename);  // 获取filename的状态信息
    const file = new File(
      filename,
      path.basename(filename),
      path.extname(filename),
      fileStat.size / 2 ** 10,  // 以KB为单位
      fileStat.isFile(),
      new Date(fileStat.birthtime),
      new Date(fileStat.mtime)
    )
    return file;
  }

  [Symbol.toStringTag] = 'File';
}

/**
 *  需要：
 *  [
 *    { name: 'xxx', ext: 'xxx', size: 1120, isFile: false, createTime, updateTime, getChildren: fn, ... },
 *    { name: 'xxx.js', ext: '.js', size: 1, isFile: true, createTime, updateTime, getChildren: fn, ... }
 *  ]
 * 
 */

/**
 * 获取传入路径的所以子目录和文件
 * @param {String} filename 
 */
async function readDir(filename) {
  const file = await File.getFile(filename);
  return await file.getChildren();
}

module.exports = readDir;

// async function test(filename) {
//   const file = await File.getFile(filename);
//   // const content = await file.getContent();
//   // console.log(content);
//   const children = await file.getChildren();
//   console.log(children);
// }



