<!-- 友情链接模块 -->
<template>
<div class="tFriendsBox">
    <el-row>
        <el-col :lg="12" :xs="24" class="tf-item" v-for="(item,index) in friendslink" :key="'f'+index">
            <el-card style="margin: 5px">
                <a :href="item.address" target="_blank">
                    <img :src="item.logo?item.logo:'/static/img/empty.png'"  :onerror="$store.state.errorImg">
                    <h4>{{item.name}}</h4>
                    <p style="white-space: pre-wrap;text-align: left;">{{item.description}}</p>
                </a>
            </el-card>
        </el-col>
    </el-row>
</div>
</template>

<script>
import {getAllLink} from '../api/link.js'
export default {
    data() { //选项 / 数据
        return {
            friendslink:[]//友情链接
        }
    },
    methods: { //事件处理器
        getList(){
            getAllLink().then((response)=>{
                this.friendslink = response
            })
        }
    },
    components: { //定义组件

    },
    created() { //生命周期函数
        this.getList()
    }
}
</script>

<style>
.tFriendsBox{
    background: #fff;
    padding:15px;
    border-radius: 5px;
    margin-bottom: 40px;
}
.tFriendsBox h1{
    padding:15px 0;
    font-size: 25px;
    font-weight: bold;
}
.tFriendsBox .tf-item{
    transition: all 0.3s ease-out;
    border-radius: 5px;
    position: relative;
}
.tFriendsBox .tf-item:hover{
    background: rgba(137, 186, 209, 0.5);
}
.tFriendsBox .tf-item a{
    display: block;
    padding:0;
    height:90px;
}
.tFriendsBox .tf-item a img{
    width:60px;
    height:60px;
    border-radius: 50%;
    position: absolute;
    top:15px;
    left:15px;
    cursor: pointer;
    object-fit: cover;
}
.tFriendsBox .tf-item a h4{
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-size: 20px;
    padding-top:15px;
    font-weight: bold;
}
.tFriendsBox .tf-item a p{
    margin:10px 0;
    font-size: 12px;
    line-height: 24px;
    color:#999;
    cursor: pointer;
    white-space: nowrap;
    text-overflow: ellipsis;
}
</style>
