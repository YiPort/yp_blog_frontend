<template>
    <el-button 
    type="primary" 
    :disabled="disabled" 
    @click="start()">
    {{defaultContent}}
    </el-button>
</template>

<script>
export default {
    name: 'timeButton',
    props: {
        /* 是否重置 */
        reset: {
            type: Boolean,
            default: false
        },
        /* 初始显示内容 */
        content: {
            type: String,
            default: '获取验证码'
        },
        /* 计时时间（秒） */
        count: {
            type: Number,
            default: 60
        }
    },
    data () {
        return {
            defaultContent: this.content,
            defaultCount: this.count,
            disabled: false
        }
    },
    methods: {
        start() {
        let countDown = setInterval(() => {
            if (this.defaultCount < 1 || this.reset) {
                this.disabled = false;
                this.defaultContent = this.content;
                this.defaultCount = this.count;
                clearInterval(countDown);
            } else {
                this.disabled = true;
                this.defaultContent = this.defaultCount-- + 's 后重试';
            }
        }, 1000)
        }
    }
}
</script>

<style>
</style>
