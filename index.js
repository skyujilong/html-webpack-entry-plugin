const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require('path');

class HtmlWebpackEntryPlugin {
    constructor() {
        this.pluginName = 'html-webpack-entry-plugin';
    }
    apply(compiler) {
        compiler.hooks.compilation.tap(this.pluginName, (compilation) => {
            HtmlWebpackPlugin.getHooks(compilation).alterAssetTags.tapAsync('beforeAssetTagGeneration', (data, cb) => {
                // debugger;
                // 获取入口名字
                let entryName = this.getEntryName(data);

                for (let item of compilation.entrypoints) {
                    // key值为入口名字，entryPoint中，含有整个html中需要的js文件。
                    let key = item[0],
                        entryPoint = item[1];
                    if (key === entryName) {
                        let renderResource = this.getAssetTagsScriptsAndStyles(entryPoint.chunks, data);
                        data.assetTags.scripts = renderResource[0];
                        data.assetTags.styles = renderResource[1];
                        break;
                    }
                }
                cb(null, data);
            })
        });
    }
    getEntryName(data) {
        let entryName = data.plugin.options.entryName || path.basename(data.plugin.options.filename).split('.')[0];
        return entryName;
    }
    /**
     * 获取该htmlwepbackplugin实例对应的入口js文件。
     * @param {*} entryChunkList 入口的文件
     * @param {*} data html webpack 实力，要渲染的资源
     */
    getAssetTagsScriptsAndStyles(entryChunkList, data) {
        // mode中的值 production 生产环境
        // let mode = compilation.options.mode;
        let assetTagsScripts = data.assetTags.scripts;
        let assetTagsStyles = data.assetTags.styles;
        let resourceList = assetTagsScripts.concat(assetTagsStyles);
        let renderJsList = [];
        let renderCssList = [];
        entryChunkList.forEach(chunk => {
            chunk.files.forEach(fileName => {
                resourceList.forEach(resource => {

                    if (resource.tagName === 'script' && resource.attributes.src.indexOf(fileName) != -1) {
                        renderJsList.push(resource);
                    } else if (resource.tagName === 'link' && resource.attributes.href.indexOf(fileName) != -1) {
                        renderCssList.push(resource);
                    }

                });
            })
        });
        return [renderJsList, renderCssList];
    }
}

module.exports = HtmlWebpackEntryPlugin;