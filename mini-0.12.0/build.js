/**
 * @file: build.js
 * @description ..
 */
const pathLib = require('path');
const chalk = require('chalk');

const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const IdHelpers = require('webpack/lib/ids/IdHelpers');
const CssDependency = require('mini-css-extract-plugin/dist/CssDependency').default;

const projectRoot = __dirname;

function getDefaultConfig(mode = 'production') {
    const config = {
        mode,
        context: projectRoot,
        entry: pathLib.resolve(projectRoot, 'src/index.js'),
        output: {
            path: pathLib.resolve(projectRoot, 'dist'),
            publicPath: '/',
            filename: '[name].js'
        },
        plugins: [
            new CleanWebpackPlugin(),
            new MiniCssExtractPlugin({
                filename: '[name].css'
            })
        ],
        module: {
            rules: [
                {
                    test: /\.css$/,
                    use: [
                        MiniCssExtractPlugin.loader,
                        'css-loader'
                    ]
                },
                {
                    test: /\.m?js$/,
                    exclude: /(node_modules|bower_components)/,
                    use: {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-env']
                        }
                    }
                }
            ]
        },
        optimization: {
            minimize: false
        }
    };
    return config;
}

function runWebpack(config) {
    webpack(config, (err, stats) => {
        if (err) {
            console.log('Webpack Run Error:', err);
            return;
        }

        if (stats.hasErrors()) {
            console.log('Webpack Has Error:', stats.toString());
            return;
        }

        const expectChunkIds = [179, 362].join(' ');
        const receivedChunkIds = Array.from(stats.compilation.chunks).map(chunk => chunk.id).sort().join(' ');

        let chalkColor = chalk.green;
        let result = 'Right';
        if (expectChunkIds !== receivedChunkIds) {
            chalkColor = chalk.red;
            result = 'Wrong';
        }

        console.log(chalkColor(`${result}:`));
        console.log(chalk.green(`    Expect chunkIds: ${expectChunkIds}`));
        console.log(chalkColor(`    Received chunkIds: ${receivedChunkIds}`))
    });
}

function mockGetFullChunkName() {
    const ori = IdHelpers.getFullChunkName;
    let errorShowed = false;
    IdHelpers.getFullChunkName = (...args) => {
        const name = ori.call(this, ...args);

        if (!errorShowed && name.includes(projectRoot)) {
            const stack = ((new Error('x')).stack || '').split('\n').slice(1).join('\n    ');
            console.log(chalk.red([
                'FullChunkName includes context of project, it may make the effect of '
                + '"optimization.chunkIds: \"deterministic\"" not as expected',
                `    fullChunkName: ${name}`,
                `    context: ${projectRoot}`,
                '    stack:',
                `    ${stack}`,
                ''
            ].join('\n')));
            errorShowed = true;
        }

        return name;
    };
}

function mockCssDependency() {
    CssDependency.prototype.getModuleEvaluationSideEffectsState
        = webpack.Dependency.prototype.getModuleEvaluationSideEffectsState;
}

mockGetFullChunkName();
if (process.argv[2] === 'disable-feature') {
    mockCssDependency();
}


runWebpack(getDefaultConfig());
