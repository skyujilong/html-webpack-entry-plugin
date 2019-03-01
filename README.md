# html-webpack-entry-plugin
A html-webpack-plugin component that supports multiple entrypoint resource file splits.

一个html-webpack-plugin的组件，支持多entrypoint的资源文件拆分。

## Installation

npm i html-webpack-entry-plugin

yarn add html-webpack-entry-plugin

## Environmental needs
webpack4 & html-webpack-plugin@next


## Example Webpack Config

webpack config

```javascript
{
    mode:"production",
    module:{
        rules: [{
            test: /\.js$/,
            exclude: /node_modules/,
            loader: "babel-loader"
        },
        {
            // css资源
            test: /\.(scss|css)$/,
            use: [{
                    loader: MiniCssExtractPlugin.loader,
                },
                {
                    loader: "css-loader"
                },
                {
                    loader:"postcss-loader"
                },
                {
                    loader:"sass-loader"
                }
            ]
        }
    },
    output:{
        path: path.resolve(__dirname, '..', 'assets'),
        filename: "js/[name]-[chunkhash:6].js",
        publicPath: 'http://test.sina.com.cn/'
    },
    optimization:{
        runtimeChunk: {
            name: "manifest"
        },
        splitChunks:{
            //js默认最大初始化并行请求数字
            maxInitialRequests:4,
            chunks: 'initial',
            cacheGroups: {
                vendors: {
                    name:'vendors',
                    test: /[\\/]node_modules[\\/]/,
                    priority: -10
                }
            }
        },
    },
    entry:{
        index:"./index.js",
        next:"./next.js",
        other:"./other.js"
    },
    plugins:{
        new HtmlWebpackPlugin({
            minify:false,
            template: "filePath",
            filename: 'index.html'//this filename need same as entrypoint
        }),
        new HtmlWebpackPlugin({
            minify:false,
            template: "filePath",
            filename: 'next.html'//this filename need same as entrypoint
        }),
        new HtmlWebpackPlugin({
            minify:false,
            template: "filePath",
            filename: 'other.html'//this filename need same as entrypoint
        }),
        new HtmlWebpackEntryPlugin()
    }
}    

```

output:

*index.html*

```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        
        <script src="http://test.sina.com.cn/js/manifest-65c668.js"></script>
        <script src="http://test.sina.com.cn/js/vendors-7dffe1.js"></script>
        <script src="http://test.sina.com.cn/js/index-6eef73.js"></script>
    </body>
    </html>
```

*next.html*

```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        
        <script src="http://test.sina.com.cn/js/manifest-65c668.js"></script>
        <script src="http://test.sina.com.cn/js/vendors-7dffe1.js"></script>
        <script src="http://test.sina.com.cn/js/next-7dca45.js"></script>
    </body>
    </html>
```

*next.html*

```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        
        <script src="http://test.sina.com.cn/js/manifest-65c668.js"></script>
        <script src="http://test.sina.com.cn/js/vendors-7dffe1.js"></script>
        <script src="http://test.sina.com.cn/js/next-7dca45.js"></script>
    </body>
    </html>
```

*other.html*

```HTML
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>Document</title>
    </head>
    <body>
        
        <script src="http://test.sina.com.cn/js/manifest-65c668.js"></script>
        <script src="http://test.sina.com.cn/js/next-66eecc.js"></script>
    </body>
    </html>
```


the index.js and next.js all include the same moudule. 

but other not, so it not have vendors.js
