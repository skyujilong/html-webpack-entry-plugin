
const HtmlWebpackPlugin = require('html-webpack-plugin');

class HtmlWebpackEntryPlugin{
    // constructor(option){

    // }
    apply(compiler){
        compiler.hooks.compilation.tap('HtmlAssetsPlugin', (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('beforeAssetTagGeneration', (data, cb) => {
                // 获取入口名字
                let entryName = this.getEntryName(data);
                let { entrypoints } = compilation;
                for(let item of entrypoints){
                    // key值为入口名字，entryPoint中，含有整个html中需要的js文件。
                    let[key,entryPoint] = item;
                    if(key === entryName){
                        let {
                            chunks
                        } = entryPoint;
                        data.assetTags.scripts = this.getAssetTagsScripts(chunks, data.assetTags.scripts);
                        break;
                    }
                }
                cb(null, data);
            })
        });
    }
    getEntryName(data){
        let entryName = data.plugin.options.filename.split('.')[0];
        return entryName;
    }
    /**
     * 获取该htmlwepbackplugin实例对应的入口js文件。
     * @param {*} compilation webpack编辑环境
     * @param {*} entryChunkList 入口的文件
     * @param {*} assetTagsScripts 所有的文件
     */
    getAssetTagsScripts(entryChunkList, assetTagsScripts) {
        // mode中的值 production 生产环境
        // let mode = compilation.options.mode;
        let renderJsList = [];
        entryChunkList.forEach(chunk => {
            let renderJsName = chunk.files[0];
            assetTagsScripts.forEach(htmlScript => {
                if (htmlScript.attributes.src.indexOf(renderJsName) != -1){
                    renderJsList.push(htmlScript);
                }
            });
        });
        return renderJsList;
    }
}

module.exports = HtmlWebpackEntryPlugin;