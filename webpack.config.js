const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    mode: 'development',
    devtool: 'inline-source-map',
    entry: {
        'index': './src/index.js',
        '01_observables_and_observers': './src/basic/01_observables_and_observers.js',
        'lab_01_scroll_progress_bar': './src/basic/lab_01_scroll_progress_bar.js',
        'lab_02_countdown': './src/basic/lab_02_countdown.js'
    },
    plugins: [
        new CleanWebpackPlugin({ cleanStaleWebpackAssets: false }),
        new CopyWebpackPlugin([
            { from: 'src/**/*.html', flatten: true },
            { from: 'src/**/*.css', flatten: true }
        ],
            { copyUnmodified: true }
        )
    ]
}