const rspack = require("@rspack/core");
const { container: { ModuleFederationPlugin }, } = require('@rspack/core');
const refreshPlugin = require("@rspack/plugin-react-refresh");
const isDev = process.env.NODE_ENV === "development";
const path = require("path");
/**
 * @type {import('@rspack/cli').Configuration}
 */
module.exports = {
	context: __dirname,
	entry: {
		main: "./src/main.tsx"
	},
	resolve: {
		extensions: ["...", ".ts", ".tsx", ".jsx"],
    alias: {
      "@": path.resolve(__dirname, './src'),
    },
	},
	module: {
		rules: [
			{
				test: /\.svg$/,
				type: "asset"
			},
			{
				test: /\.(jsx?|tsx?)$/,
				use: [
					{
						loader: "builtin:swc-loader",
						options: {
							jsc: {
								parser: {
									syntax: "typescript",
									tsx: true
								},
								transform: {
									react: {
										runtime: "automatic",
										development: isDev,
										refresh: isDev
									}
								}
							},
							env: {
								targets: [
									"chrome >= 87",
									"edge >= 88",
									"firefox >= 78",
									"safari >= 14"
								]
							}
						}
					}
				]
			}
		]
	},
	plugins: [
		new rspack.DefinePlugin({
			"process.env.NODE_ENV": JSON.stringify(process.env.NODE_ENV)
		}),
		new rspack.ProgressPlugin({}),
		new rspack.HtmlRspackPlugin({
			template: "./index.html"
		}),

    new ModuleFederationPlugin({
      name: 'app_02',
      filename: 'remoteEntry.js',
      remotes: {
        //app_01: 'app_01@http://localhost:3001/remoteEntry.js',
        //app_03: 'app_03@http://localhost:3003/remoteEntry.js',
      },
      exposes: {
        './ModuleA': './src/components/ModuleA',
      },
      shared: {
        // ...deps,
        // '@material-ui/core': {
        //   singleton: true,
        // },
        // 'react-router-dom': {
        //   singleton: true,
        // },
        'react-dom': {
          singleton: true,
        },
        react: {
          singleton: true,
        },
      },
    }),
		isDev ? new refreshPlugin() : null
	].filter(Boolean)
};
