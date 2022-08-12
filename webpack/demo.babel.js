/**
 * @prettier
 */

 import path from "path"
 import ReactRefreshWebpackPlugin from "@pmmmwh/react-refresh-webpack-plugin"
 import HtmlWebpackPlugin from "html-webpack-plugin"
 import { HtmlWebpackSkipAssetsPlugin } from "html-webpack-skip-assets-plugin"
 
 import configBuilder from "./_config-builder"
 import styleConfig from "./stylesheets.babel"
 
 const projectBasePath = path.join(__dirname, "../")
 const isDevelopment = process.env.NODE_ENV !== "production"
 
 const demoConfig = configBuilder(
   {
    minimize: true,
    mangle: true,
    sourcemaps: true,
    includeDependencies: false,
   },
   {
     entry: {
       "app": [
         path.resolve(projectBasePath, "flavors/app.jsx"),
       ],
     },
 
     output: {
       filename: "[name].js",
       chunkFilename: "[id].js",
       library: {
         name: "[name]",
         export: "default",
       },
       publicPath: "/tea-swagger-ui",
     },
 
     module: {
       rules: [
         {
           test: /\.jsx?$/,
           include: [
             path.join(projectBasePath, "flavors"),
             path.join(projectBasePath, "src"),
             path.join(projectBasePath, "node_modules", "object-assign-deep"),
           ],
           loader: "babel-loader",
           options: {
             retainLines: true,
             cacheDirectory: true,
             plugins: [isDevelopment && require.resolve("react-refresh/babel")].filter(Boolean),
           },
         },
         {
           test: /\.(txt|yaml)$/,
           type: "asset/source",
         },
         {
           test: /\.(png|jpg|jpeg|gif|svg)$/,
           type: "asset/inline",
         },
         {
           test: /\.css/,
           use: ["style-loader", "css-loader"], 
         }
       ],
     },
 
     plugins: [
       new HtmlWebpackPlugin({
         template: path.join(projectBasePath, "dev-helpers", "index.html"),
       }),
     ],
     resolve: {
       alias: {
         "@src": path.join(projectBasePath, "src"),
         "swagger-ui-es-bundle-core": path.join(projectBasePath, "src/index.js")
       },
     },
   },
 )
 
 // mix in the style config's plugins and loader rules
 
 demoConfig.plugins = [...demoConfig.plugins, ...styleConfig.plugins]
 
 demoConfig.module.rules = [
   ...demoConfig.module.rules,
   ...styleConfig.module.rules,
 ]
 
export default demoConfig
