// 首页
//------

module.exports = {
    // 顶部选项卡
    type: 'topTab',
    tabMode: 'scrollable',
    actions: [
        {
            title: '添加',
            onClick: async function () {
                const feedUrl = await $input.prompt({
                    title: '请输入 RSS 地址',
                    hint: '示例：https://youthlin.com/feed',
                    value: ''
                });
                if (feedUrl) {

                }
            }
        },
        {
            title: '移除',
            onClick: async function () {

            }
        }
    ],
    async fetch() {
    }
}
