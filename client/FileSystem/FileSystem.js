/**
 * 参考的API:
 * http://w3c.github.io/quota-api/
 * 
 */

if (!window.location.origin) {
    window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ':' + window.location.port : '');
}
//文件系统请求标识 
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem
//根据URL取得文件的读取权限 
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL

//临时储存和永久存储
navigator.temporaryStorage = navigator.temporaryStorage || navigator.webkitTemporaryStorage;
navigator.persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;

//常量
const _TEMPORARY = 'temporary',
    _PERSISTENT = 'persistent',
    FS_SCHEME = 'filesystem:'

/**
 * 转为promise，主要是把 a.b(param1,param2,successCallback,errorCall) 转为promise
 * @param {*期待的是函数} obj 
 * @param {*上下文} ctx 
 * @param {*参数} args 
 */
function toPromise(obj, ctx = window, ...args) {
    if (!obj) return obj

    //如果已经是Promise对象
    if ('function' == typeof obj.then) return obj

    //若obj是函数直接转换
    if ('function' == typeof obj) return _toPromise(obj)

    return obj;

    //函数转成 promise
    function _toPromise(fn) {
        return new Promise((resolve, reject) => {

            fn.call(ctx, ...args, (...ags) => {
                //多个参数返回数组，单个直接返回对象
                resolve(ags && ags.length > 1 ? ags : ags[0])
            }, (err) => {
                reject(err)
            })

        })
    }
}


/**
 * 查询和申请定额
 * 测试脚本：
 * 使用情况： FileStorageQuota.instance.queryInfo().then(data=>console.log(data))
 * 申请空间： FileStorageQuota.instance.requestPersistentQuota().then(data=>console.log(data))
 */
class FileStorageQuota {

    constructor() {

        let supportedTypes = [_TEMPORARY, _PERSISTENT];

        this.storageQuota = navigator.storageQuota || {
            storages: { [_TEMPORARY]: navigator.webkitTemporaryStorage, [_PERSISTENT]: navigator.webkitPersistentStorage },
            queryInfo: function (type) {
                return toPromise(this.storages[type].queryUsageAndQuota, this.storages[type]).then(arr => {
                    return { usage: arr[0], quota: arr[1] }
                })
            },
            requestPersistentQuota: function (requestQuota) {
                return toPromise(this.storages[_PERSISTENT].requestQuota, this.storages[_PERSISTENT], requestQuota * 1024 * 1024).then(quota => {
                    return { quota }
                })
            },
            supportedTypes
        }
        this.supportedTypes = supportedTypes
        this._instance = null //实例
    }

    /**
     * 获得实例
     */
    static get instance() {
        return !!this._instance ? this._instance : this._instance = new FileStorageQuota()
    }

    /**
     * 已经分配的额度和适用查询
     * @param {*类型  window.TEMPORAR(0) |window.PERSISTENT(1) }  type
     */
    queryInfo(type = window.TEMPORARY) {

        return new Promise((resolve, reject) => {
            this.storageQuota.queryInfo(this.supportedTypes[type])
                .then(storageInfo => resolve({ quota: this.tansferBytes(storageInfo.quota), usage: this.tansferBytes(storageInfo.usage) }))
                .catch(this.errorHandler(reject))
        })

    }

    /**
     * 请求配额，只有PERSISTENT才需要用户允许，
     * 返回值是你请求的和已经分配的大值   
     * @param {* 请求的配额大小} requestQuota  
     */
    async requestPersistentQuota(requestQuota = 5) {
        let { quota: quotaM, usage } = await this.queryInfo(window.PERSISTENT)
        if (requestQuota > quotaM) {
            return new Promise((resolve, reject) =>
                this.storageQuota.requestPersistentQuota(requestQuota * 1024 * 1024)
                    .then(storageInfo => {
                        return resolve({ quota: this.tansferBytes(storageInfo.quota), usage: this.tansferBytes(storageInfo.usage || usage) })
                    })
                    .catch(this.errorHandler(reject)))
        }
        return { quota: Math.max(requestQuota, quotaM), usage }
    }

    /**
     * 把bytes换算成KB,M,G等
     * @param {* bytes的长度}  bytesLength
     * @param {* 转为目标的单位} target
     */
    tansferBytes(bytesLength, target = 'M') {
        let m = {
            'Byte': 0,
            'KB': 1,
            'M': 2,
            'G': 3
        }
        return bytesLength / Math.pow(1024, m[target] || 0)
    }

    /**
     * Promise里面的错误处理
     * @param {*}  reject
     */
    errorHandler(reject) {
        return error => {
            reject(error)
        }
    }
}


class LocalFileSystem {

    constructor(fs) {
        this._fs = fs
        this._root = fs.root
        this._instance = null
        this._type = null
        this._fsBaseUrl = null
    }


    /**
       * 
       * @param {* window.TEMPORAR(0) |window.PERSISTENT(1)} type
       * @param {* 申请空间大小，单位为M } size
       */
    static getInstance(type = window.TEMPORARY, size = 1) {

        if (this._instance) {
            return Promise.resolve(this._instance)
        }
        //类型
        let typeValue = type,
            //文件系统基础地址
            fsBaseUrl = FS_SCHEME + location.origin + '/' + (type == 1 ? _PERSISTENT : _TEMPORARY) + '/'
        return new Promise((resolve, reject) => {
            window.requestFileSystem(type, size * 1024 * 1024, fs => {
                this._instance = new LocalFileSystem(fs)
                this._instance._type = typeValue;
                this._instance._fsBaseUrl = fsBaseUrl
                return resolve(this._instance)
            }, (err) => reject(err))
        })

    }

    /**
     * 获得FileEntry
     * @param {*文件路径} path  
     */
    _getFileEntry(path) {
        return toPromise(this._root.getFile, this._root, path, { create: true, exclusive: false })
    }

    _getDirectory(path = '') {
        return toPromise(this._root.getDirectory, this._root, path, { create: false })
    }

    /**
     * 获得Entry
     * @param {*路径} path 
     */
    _getEntry(path) {
        return toPromise(window.resolveLocalFileSystemURL, window, `${this._fsBaseUrl}${path.startsWith('\/') ? path.substr(1) : path}`)
    }

    /**
     * 获得文件
     * @param {*文件路径} path 
     */
    async getFile(path) {
        let fe = await this._getFileEntry(`${this.fsBaseUrl}`)
        return toPromise(fe.file, fe)
    }

    /**
     * 往文件写入内容
     * @param {*文件路径} path 
     * @param {*写入的内容} content 
     * @param {*数据类型} type 
     * @param {*是否是append} append 
     */
    async writeToFile(path, content, type = 'text/plain', append = false) {

        let fe = await this._getFileEntry(path)
        let writer = await toPromise(fe.createWriter, fe);
        let data = content;

        //不是blob，转为blob
        if (content instanceof ArrayBuffer) {
            data = new Blob([new Uint8Array(content)], { type })
        } else if (typeof content == 'string') {
            data = new Blob([content], { type: 'text/plain' })
        } else {
            data = new Blob([content])
        }

        if (append) {
            writer.seek(writer.length)
        }

        return new Promise((resolve, reject) => {
            //写入成功
            writer.onwriteend = () => {
                resolve(true)
            }

            //写入失败
            writer.onerror = (err) => {
                reject(err)
            }

            writer.write(data)
        })
    }

    async readEntries(path = '') {

        let fe = await this._getDirectory(path)
        let reader = fe.createReader()
        return toPromise(reader.readEntries, reader);
    }

    async clear() {

    }

    /**
    * Promise里面的错误处理
    * @param {*reject}  
    */
    errorHandler(reject) {
        return (error) => {
            reject(error)
        }
    }

}

