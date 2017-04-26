console.log('.....')


//https://my.oschina.net/xhload3d/blog/359062

//文件系统请求标识 
window.requestFileSystem = window.requestFileSystem || window.webkitRequestFileSystem;
//根据URL取得文件的读取权限 
window.resolveLocalFileSystemURL = window.resolveLocalFileSystemURL || window.webkitResolveLocalFileSystemURL;
//临时存储
navigator.temporaryStorage = navigator.temporaryStorage || navigator.webkitTemporaryStorage;
//持久存储
navigator.persistentStorage = navigator.persistentStorage || navigator.webkitPersistentStorage;




class FileStorage {

    static storages = {
        0: navigator.temporaryStorage,
        1: navigator.persistentStorage
    };

    static queryUsageAndQuota(type) {
        return new Promise((resolve, reject) => {
            FileStorage.storages[type].queryUsageAndQuota((usage, quota) => {
                resolve({ usage, quota })
            })
        });
    }

    static requestQuota(type, quota) {
        navigator.temporaryStorage.requestQuota(quota * 1024 * 1024, (grantedBytes) => {
            window.requestFileSystem(window.PERSISTENT, grantedBytes, fs => {
                window.fs = fs;
            });
        });
    }
}





class FileSystem {

    constructor() {

    }


    /**
     * 
     * @param {*type}  window.PERSISTENT/window.TEMPORARY
     */
    getInstance(type) {

    }


    queryUsageAndQuota() {

    }

}

FileStorage.queryUsageAndQuota(window.PERSISTENT).then(({ usage, quota }) => {
    console.log(`usage:${usage},quota:${quota}`)
})
