<!-- 友情链接 -->
<template>
    <div>
        <yp-nav></yp-nav>
        <div class="container">
            <el-row  :gutter="30">
                <el-col :sm="24" :md="16" style="transition:all .5s ease-out;margin-bottom:30px;">
                    <yp-friends></yp-friends>
                    <yp-message></yp-message>
                </el-col>
                <el-col :sm="24"  :md="8" >
                    <yp-rightlist></yp-rightlist>
                </el-col>
            </el-row>
        </div>
        <div class="footer">
            <a style="color:aliceblue">备案号：</a>
            <a href="https://beian.miit.gov.cn/" class="font">闽ICP备2021019654号-1</a>
            <p style="color:aliceblue; margin-top: 10px">Blog ©2021 Created by yiport</p>
        </div>
    </div>
</template>

<script>
import header from '../components/header.vue'
import friends from '../components/friends.vue'
import rightlist from '../components/rightlist.vue'
import message from '../components/message.vue'
    export default {
        name: 'FriendsLink',
        data() { //选项 / 数据
            return {

            }
        },
        methods: { //事件处理器

        },
        components: { //定义组件
            'yp-nav':header,
            'yp-message':message,
            'yp-friends':friends,
            'yp-rightlist':rightlist,
        },
        created() { //生命周期函数

        }
    }
</script>

<style>

</style>
