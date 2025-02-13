const { merge } = require('webpack-merge');
const vanilla = require('vanilla-webpack');
const webpack = require('webpack');
const fs = require('fs-extra');
const helpers = require('./helpers');

exports.default = {
    pre: function (options) {
        if (helpers.isProd()) {
            options.outputPath = '../../Gantry/Frontend.Gantry.Host/ClientDist';
        }
    },
    config: function (config) {
        const isDevServer = helpers.isDevServer();
        const isProd = helpers.isProd();
        config = merge(config, {
            output: {
                path: isProd ? helpers.root('../Gantry/Frontend.Gantry.Host/ClientDist') : config.path,
                publicPath: isDevServer ? 'https://localhost:8896/ClientDist/' : '/ClientDist/'
            },
            plugins: [
                new webpack.DefinePlugin({
                    PACKAGEVERSIONS: JSON.stringify(vanilla.utils.getVersionsOfPackages())
                }),
                new vanilla.CreatePackageVersionsManifestPlugin(),
                new vanilla.FilterVanillaLocalesPlugin(),
                new vanilla.ManifestPlugin()

                //new vanilla.NamedLazyChunksWebpackPlugin(),
            ],
            optimization: {
                chunkIds: 'named',
                splitChunks: {
                    cacheGroups: {
                        common: false,
                        default: false,
                        vendor: {
                            test: /@frontend[\\/]vanilla|@angular[\\/]|genesys-web-chat/,
                            name: 'vendor',
                            chunks: 'initial',
                        },
                        locales: {
                            test: /[\\/]locales[\\/]/,
                            name(module, chunks, cacheGroupKey) {
                                const identifier = module.identifier().replace(/.*?[\\/]@angular[\\/]common[\\/]/, '');
                                return vanilla.utils.normalizePath(identifier.replace(/(\.ngfactory)?(\.(js|ts))?$/, '').replace(/\.module$/, ''));
                            },
                            chunks: 'all',
                            enforce: true
                        },
                    }
                }
            }
        });
        vanilla.helpers.config.removeFilteredThemes(config);
        return config;
    },
    post: (options) => {
        if (options.serviceWorker) {
            const nsgwJsonPath = helpers.root(options.outputPath, 'ngsw.json');
            if (fs.existsSync(nsgwJsonPath)) {
                const json = fs.readJSONSync(nsgwJsonPath);
                json.index = '/';
                json.assetGroups.find(g => g.name === 'Gantry')?.urls.unshift('/');
                fs.writeJSONSync(nsgwJsonPath, json, { spaces: 2 });
            }
        }
    }
}