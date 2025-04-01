// babel-preset-taro 更多选项和默认值：
// https://github.com/NervJS/taro/blob/next/packages/babel-preset-taro/README.md
module.exports = {
  presets: [
    ['taro', {
      framework: 'vue3',
      ts: true
    }],
    [
      '@babel/preset-env',
      {
        targets: {
          ios: '9',
          android: '4.4'
        },
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins: [
    [
      'import',
      {
        'libraryName': '@nutui/nutui-taro',
        'libraryDirectory': 'dist/packages',
        'style': true,
        'camel2DashComponentName': false
      },
      'nutui4-taro'
    ],
    '@babel/plugin-transform-runtime'
  ]
}