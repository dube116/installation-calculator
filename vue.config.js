module.exports = {
    chainWebpack: config => {
        config
            .plugin('html')
            .tap(args => {
                args[0].title = "艦これ 對陸計算機";
                return args;
            })
    },
    publicPath: process.env.NODE_ENV === 'production'
    ? '/installation-calculator/'
    : '/'
}