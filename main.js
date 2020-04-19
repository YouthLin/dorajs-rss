if (typeof $dora == 'undefined') {
    console.error('This project runs only in Dora.js.')
    console.error('Please visit https://dorajs.com/ for more information.')
    process.exit(-1)
}

// 入口文件 自动进入 components/index.js 作为首页

$dora.mixin({
    pageSize: 20
});
