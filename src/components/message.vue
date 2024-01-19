<!-- 留言评论模块 -->
<template>
    <div class="tmsgBox"  ref="tmsgBox">
        <div class="tmsg-respond"  ref="respondBox">
            <h3>发表评论
            <small v-show="textarea" class="tcolorm" @click="textarea=''">清空</small></h3>
            <form class="">
                <el-input
                  id="rootInput"
                  type="textarea"
                  placeholder="文明评论，友善发言"
                  v-model="textarea"
                  @focus="checkLogin"
                  maxlength="300"
                  show-word-limit>
                </el-input>
                <div :class="pBody?'OwO':'OwO OwO-open'">
                    <div class="OwO-logo" @click="pBody=!pBody">
                        <span>OwO表情</span>
                    </div>
                    <div class="OwO-body">
                        <ul class="OwO-items OwO-items-show">
                            <li class="OwO-item" v-for="(oitem,index) in OwOlist" :key="'oitem'+index" :title="oitem.title" @click="choseEmoji(oitem.title,'root')">
                                <img
                                style="width: 22px; height: 22px; margin-left: 0"
                                :src="'static/img/emot/image/'+oitem.url"
                                :alt="oitem.title">
                            </li>
                        </ul>
                        <div class="OwO-bar">
                            <ul class="OwO-packages">
                                <li class="OwO-package-active">Emoji</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <el-row class="tmsg-r-info">
                    <el-col :span="24" class="info-submit">
                        <p class="tcolors-bg" @click="sendMsg('root')">{{sendTip}}</p>
                    </el-col>
                </el-row>
            </form>
        </div>
        <div class="tmsg-respond" v-show="showRespondBox1" ref="respondBox1">
            <h3>发表评论
            <small v-show="isRespond" class="tcolorm" @click="removeRespond">取消回复</small>
            <small v-show="cTextarea" class="tcolorm" @click="cTextarea=''">清空</small></h3>
            <form class=""  >
                <el-input
                  ref="childrenInput"
                  type="textarea"
                  :autosize="{ minRows: 2, maxRows: 6 }"
                  placeholder="文明评论，友善发言"
                  v-model="cTextarea"
                  @focus="checkLogin"
                  maxlength="300"
                  show-word-limit>
                </el-input>
                <div :class="cpBody?'OwO':'OwO OwO-open'">
                    <div class="OwO-logo" @click="cpBody=!cpBody">
                        <span>OwO表情</span>
                    </div>
                    <div class="OwO-body">
                        <ul class="OwO-items OwO-items-show">
                            <li class="OwO-item" v-for="(oitem,index) in OwOlist" :key="'oitem'+index" :title="oitem.title" @click="choseEmoji(oitem.title,'children')">
                                <img style="width: 22px; height: 22px"
                                :src="'static/img/emot/image/'+oitem.url"
                                :alt="oitem.title">
                            </li>
                        </ul>
                        <div class="OwO-bar">
                            <ul class="OwO-packages">
                                <li class="OwO-package-active">Emoji</li>
                            </ul>
                        </div>
                    </div>
                </div>
                <el-row class="tmsg-r-info">
                    <el-col :span="24" class="info-submit">
                        <p class="tcolors-bg" @click="sendMsg('children')">{{cSendTip}}</p>
                    </el-col>
                </el-row>
            </form>
        </div>
        <div class="tmsg-comments" ref="listDom">
            <a class="tmsg-comments-tip">全部评论 {{total}}</a>
            <div class="tmsg-commentshow">
                <ul class="tmsg-commentlist">
                    <li class="tmsg-c-item" v-for="(item,index) in commentList" :key="'common'+index">
                        <article class="">
                            <header>
                              <el-popover
                                :open-delay="500"
                                @show="handleShow()"
                                @after-enter="handleAfterEnter(item.createBy)"
                                @hide="handleHide"
                                placement="top-start"
                                title=""
                                width="250"
                                transition="el-zoom-in-bottom"
                                trigger="hover">
                                <img
                                  slot="reference"
                                  :src="item.avatar?item.avatar:$store.state.errorImg"
                                >
                                <slot>
                                <img
                                :src="item.avatar?item.avatar:$store.state.errorImg"
                                >
                                <template v-if="loading">
                                    <p style="font-size:1.5em;font-weight:bolder;margin-bottom:5px">-- --&nbsp;--</p>
                                    <el-avatar style="font-size: 10px;width: 28px;height: 15px;line-height: 16px;" shape="square" size="small">UID</el-avatar>
                                    <em style="font-size:1.3em;">--</em>
                                    <p>已加入 <em style="font-size:1.5em">--</em>天</p>
                                </template>
                                <template v-else>
                                    <p style="font-size:1.5em;font-weight:bolder;margin-bottom:5px">{{otherUserInfo.nickName}}&nbsp;
                                        <i v-show="otherUserInfo.sex!=null"
                                            :class="otherUserInfo.sex==='0'?'el-icon-male':'el-icon-female'"
                                            :style="otherUserInfo.sex==='0'?'color:#409eff':'color:#fb7299'" /></p>
                                    <el-avatar style="font-size: 10px;width: 28px;height: 15px;line-height: 16px;" shape="square" size="small">UID</el-avatar>
                                    <em style="font-size:1.3em;">&nbsp;{{otherUserInfo.uid}}</em>
                                    <p>已加入 <em style="font-size:1.5em">{{otherUserInfo.totalDay}}</em>天</p>
                                </template>
                                </slot>
                                </el-popover>

                              <div class="i-name">
                                    {{item.createNick}}
                                </div>
                                <div v-if="item.createBy===$store.state.createBy" class="m-class">
                                    博主
                                </div>
                                <div v-if="item.label==='1'" class="i-class">
                                    置顶
                                </div>
                                <div class="i-time">
                                    <time>{{item.createTime}}</time>
                                </div>
                            </header>
                            <section>
                              <p style="letter-spacing: 1px" v-html="analyzeEmoji(item.filterContent)"></p>
                                <div class="tmsg-replay-div">
                                    <span v-if="haslogin" class="tmsg-replay-span" @click="respondMsg(item.id,item.id,item.createBy)">
                                        回复
                                    </span>
                                    <span v-if="$store.state.isMy && item.label==='0'" class="tmsg-replay-span" @click="handleTop(item.id,'1')">
                                        置顶
                                    </span>
                                    <span v-if="$store.state.isMy && item.label==='1'" class="tmsg-replay-span" @click="handleTop(item.id,'0')">
                                        取消置顶
                                    </span>
                                    <span v-if="isAdmin" class="tmsg-replay-span" @click="deleteComment(item.id)">
                                        删除
                                    </span>
                                </div>
                            </section>
                        </article>
                        <ul v-if="item.children" :class="item.children.length?'tmsg-commentlist-children':'tmsg-commentlist'">
                            <li class="tmsg-c-item" v-for="(citem,cindex) in item.children" :key="'citem'+cindex">
                                <article class="">
                                    <header>
                                        <el-popover
                                            :open-delay="500"
                                            @show="handleShow()"
                                            @after-enter="handleAfterEnter(citem.createBy)"
                                            @hide="handleHide"
                                            placement="top-start"
                                            title=""
                                            width="250"
                                            transition="el-zoom-in-bottom"
                                            trigger="hover">
                                            <img
                                                slot="reference"
                                                style="width: 40px; height: 40px"
                                                :src="citem.avatar?citem.avatar:$store.state.errorImg"
                                            >
                                            <slot>
                                            <img
                                            :src="citem.avatar?citem.avatar:$store.state.errorImg"
                                            >
                                            <template v-if="loading">
                                                <p style="font-size:1.5em;font-weight:bolder;margin-bottom:5px">-- --&nbsp;--</p>
                                                <el-avatar style="font-size: 10px;width: 28px;height: 15px;line-height: 16px;" shape="square" size="small">UID</el-avatar>
                                                <em style="font-size:1.3em;">--</em>
                                                <p>已加入 <em style="font-size:1.5em">--</em>天</p>
                                            </template>
                                            <template v-else>
                                                <p style="font-size:1.5em;font-weight:bolder;margin-bottom:5px">{{otherUserInfo.nickName}}&nbsp;
                                                    <i v-show="otherUserInfo.sex!=null"
                                                     :class="otherUserInfo.sex===0?'el-icon-male':'el-icon-female'"
                                                     :style="otherUserInfo.sex===0?'color:#409eff':'color:#fb7299'" /></p>
                                                <el-avatar style="font-size: 10px;width: 28px;height: 15px;line-height: 16px;" shape="square" size="small">UID</el-avatar>
                                                <em style="font-size:1.3em;">&nbsp;{{otherUserInfo.uid}}</em>
                                                <p>已加入 <em style="font-size:1.5em">{{otherUserInfo.totalDay}}</em>天</p>
                                            </template>
                                            </slot>
                                        </el-popover>
                                        <div class="i-name">
                                            <span>{{citem.createBy === userId ? '' : citem.createNick}}</span>
                                            <span style="cursor: default">回复</span>
                                            <span>{{item.createNick}}</span>
                                          </div>
                                          <div v-if="citem.createBy===$store.state.createBy" class="m-class">
                                            博主
                                          </div>
                                          <div class="i-time">
                                            <time>{{citem.createTime}}</time>
                                          </div>

                                    </header>
                                    <section>
                                          <p style="letter-spacing: 1px" v-html="analyzeEmoji(citem.filterContent)"></p>
                                          <div class="tmsg-replay-div">
                                                <span v-if="isAdmin" class="tmsg-replay-span" @click="deleteComment(citem.id)">
                                                    删除
                                                </span>
                                          <!-- <div v-show="haslogin" class="tmsg-replay-div" @click="respondMsg(item.id,citem.id,citem.createBy)">
                                              回复
                                          </div> -->
                                        </div>
                                    </section>
                                </article>
                            </li>
                        </ul>
                    </li>
                </ul>
                <h1 v-show='hasMore' class="tcolors-bg" @click="addMoreFun" >查看更多</h1>
                <h1 v-show='!hasMore' class="tcolors-bg" >到底了~</h1>
            </div>
        </div>
    </div>
</template>

<script>
import {sendComment,getArticleComment,getLinkComment,setTop,deleteComment} from '../api/comment.js'
import { getToken } from '../utils/auth.js'
import { getOtherUser } from '../api/user.js'
import { MessageBox } from 'element-ui'
import router from '@/router'
export default {
    data() { //选项 / 数据
        return {
            respondBox:'',//评论表单
            listDom:'',//评论列表
            tmsgBox:'',//总评论盒子
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                articleId: -1
            },
            total: 0,
            showRespondBox1: false,
            isRespond:false,
            textarea: '',//根评论文本框输入内容
            cTextarea: '',//子评论文本框输入内容
            pBody:true,//根评论表情打开控制
            cpBody:true,//子评论表情打开控制
            commentList:[],//评论列表数据
            aid:0,//文章id
            hasMore:false,
            haslogin:false,
            userId:'',//用户id
            isAdmin:false,
            userInfo:{},
            type:0,//回复评论的当前的commentId
            leavePid:'',//赞赏等其他模块的分类id
            pid:'',//回复评论的一级commentId
            rootId:"-1",//根评论id，如果是针对文字评论直接用-1表示
            toCommentId:-1,//所回复评论的id
            toCommentUserId:-1,//所评论的用户id
            sendTip:'发送~',
            cSendTip:'发送~',
            OwOlist:[//表情包和表情路径
                {'title':'并不简单','url':'d_bingbujiandan.png'},
                {'title':'鼓掌','url':'d_guzhang.png'},
                {'title':'费解','url':'d_feijie.png'},
                {'title':'坏笑','url':'d_huaixiao.png'},
                {'title':'疑问','url':'d_yiwen.png'},
                {'title':'太开心','url':'d_taikaixin.png'},
                {'title':'思考','url':'d_sikao.png'},
                {'title':'求饶','url':'d_qiurao.png'},
                {'title':'困','url':'d_kun.png'},
                {'title':'爱你','url':'d_aini.png'},
                {'title':'awsl','url':'d_awsl.png'},
                {'title':'拜拜','url':'d_baibai.png'},
                {'title':'抱抱','url':'d_baobao.png'},
                {'title':'抱一抱','url':'d_baoyibao.png'},
                {'title':'悲伤','url':'d_beishang.png'},
                {'title':'鄙视','url':'d_bishi.png'},
                {'title':'闭嘴','url':'d_bizui.png'},
                {'title':'彩虹屁','url':'d_caihongpi.png'},
                {'title':'馋嘴','url':'d_chanzui.png'},
                {'title':'吃瓜','url':'d_chigua.png'},
                {'title':'吃惊','url':'d_chijing.png'},
                {'title':'揣手','url':'d_chuaishou.png'},
                {'title':'打call','url':'d_dacall.png'},
                {'title':'打哈欠','url':'d_dahaqi.png'},
                {'title':'打脸','url':'d_dalian.png'},
                {'title':'单身狗','url':'d_danshengou.png'},
                {'title':'盯','url':'d_ding.png'},
                {'title':'doge','url':'d_doge.png'},
                {'title':'二哈','url':'d_erha.png'},
                {'title':'奥特曼','url':'d_aoteman.png'},
                {'title':'感冒','url':'d_ganmao.png'},
                {'title':'跪了','url':'d_guile.png'},
                {'title':'哈哈','url':'d_haha.png'},
                {'title':'害羞','url':'d_haixiu.png'},
                {'title':'汗','url':'d_han.png'},
                {'title':'航天员','url':'d_hangtianyuan.png'},
                {'title':'呵呵','url':'d_hehe.png'},
                {'title':'嘿嘿嘿','url':'d_heiheihei.png'},
                {'title':'黑线','url':'d_heixian.png'},
                {'title':'哼','url':'d_heng.png'},
                {'title':'花心','url':'d_huaxin.png'},
                {'title':'挤眼','url':'d_jiyan.png'},
                {'title':'举手','url':'d_jushou.png'},
                {'title':'开学季','url':'d_kaixueji.png'},
                {'title':'可爱','url':'d_keai.png'},
                {'title':'可乐','url':'d_kele.png'},
                {'title':'可怜','url':'d_kelian.png'},
                {'title':'酷','url':'d_ku.png'},
                {'title':'骷髅','url':'d_kulou.png'},
                {'title':'苦涩','url':'d_kuse.png'},
                {'title':'懒得理你','url':'d_landelini.png'},
                {'title':'累','url':'d_lei.png'},
                {'title':'裂开','url':'d_liekai.png'},
                {'title':'妙','url':'d_miao.png'},
                {'title':'男孩儿','url':'d_nanhaier.png'},
                {'title':'怒','url':'d_nu.png'},
                {'title':'怒骂','url':'d_numa.png'},
                {'title':'女孩儿','url':'d_nvhaier.png'},
                {'title':'钱','url':'d_qian.png'},
                {'title':'亲亲','url':'d_qinqin.png'},
                {'title':'傻眼','url':'d_shayan.png'},
                {'title':'生病','url':'d_shengbing.png'},
                {'title':'伸手','url':'d_shenshou.png'},
                {'title':'失望','url':'d_shiwang.png'},
                {'title':'帅','url':'d_shuai.png'},
                {'title':'睡觉','url':'d_shuijiao.png'},
                {'title':'666','url':'d_sixsixsix.png'},
                {'title':'酸','url':'d_suan.png'},
                {'title':'摊手','url':'d_tanshou.png'},
                {'title':'添','url':'d_tian.png'},
                {'title':'偷笑','url':'d_touxiao.png'},
                {'title':'吐','url':'d_tu.png'},
                {'title':'兔子','url':'d_tuzi.png'},
                {'title':'哇','url':'d_wa.png'},
                {'title':'挖鼻屎','url':'d_wabishi.png'},
                {'title':'哇喔','url':'d_wawo.png'},
                {'title':'委屈','url':'d_weiqu.png'},
                {'title':'捂','url':'d_wu.png'},
                {'title':'笑哭','url':'d_xiaoku.png'},
                {'title':'星星眼','url':'d_xingxingyan.png'},
                {'title':'熊猫','url':'d_xiongmao.png'},
                {'title':'嘻嘻','url':'d_xixi.png'},
                {'title':'嘘','url':'d_xu.png'},
                {'title':'赢牛奶','url':'d_yingniunai.png'},
                {'title':'阴险','url':'d_yinxian.png'},
                {'title':'右哼哼','url':'d_youhengheng.png'},
                {'title':'左哼哼','url':'d_zuohengheng.png'},
                {'title':'晕','url':'d_yun.png'},
                {'title':'允悲','url':'d_yunbei.png'},
                {'title':'抓狂','url':'d_zhuakuang.png'},
                {'title':'猪头','url':'d_zhutou.png'}
            ],
            otherUserInfo:'',
            loading: false
        }
    },
    methods: { //事件处理器
        handleShow(){
            this.loading = true;
        },
        handleAfterEnter(userId){
            getOtherUser(userId).then(res => {
                this.otherUserInfo = res
                this.loading = false;
            })
        },
        handleHide(){
            this.otherUserInfo = '';
        },
        preText(pretext) {
            return pretext.replace(/\r\n/g, '<br/>')
                        .replace(/\n/g, '<br/>')
                        .replace(/\s/g, '&nbsp;');
        },
        setData(initData,result){
            this.total = result.total;
            var msg = result.rows;
            if(initData){
                //刷新列表
                this.commentList = msg;
                this.hasMore = result.total>this.commentList.length
            }else{
                //加载更多
                if(msg.length !== 0){
                    this.commentList = this.commentList.concat(msg);
                    this.hasMore = result.total>this.commentList.length;
                }
                else this.hasMore = false;
            }

            },
        //选择表情包
        choseEmoji(inner,value){
            if(value === 'root') {
                this.textarea +='[' + inner + ']';
            }
            if(value === 'children') {
                this.cTextarea +='[' + inner + ']';
            }
        },
        analyzeEmoji(cont){//编译表情替换成图片展示出来
            if (typeof cont !== 'string') {
                console.error('Invalid input: cont must be a string');
                return; // Exit the function if cont is not a string
            }
            // console.log('cont',cont)
            var pattern1 = /\[[\u4e00-\u9fa5]+\]/g;
            var pattern2 = /\[[\u4e00-\u9fa5]+\]/;
            var urlRegex= /(https|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|](&nbsp;|<br\/>){1}/g;
            var content = cont.match(pattern1);
            // console.log('content', content);
            var str = cont;
            str = this.preText(str);
            if(content){
                for(var i=0;i<content.length;i++){
                    for(var j=0;j<this.OwOlist.length;j++){
                        if("["+this.OwOlist[j].title +"]" == content[i]){
                            var src = this.OwOlist[j].url;
                            break;
                        }
                    }
                    str = str.replace(pattern2,'<img src="static/img/emot/image/'+src+'"/>');

                }
            }
            var url = str.match(urlRegex)
            if(url) {
                for(let i=0; i<url.length; i++) {
                    let endUrl = url[i].replace(/(&nbsp;|<br\/>){1}/, "")
                    str = str.replace(endUrl,'<img style="margin: 0" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHBhdGggZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiIGQ9Ik02LjU4NTUxIDQuNDY1MDhDNS4yMTg2OCA1LjgzMTkxIDUuMjE4NjggOC4wNDc5OSA2LjU4NTUxIDkuNDE0ODNDNi44NzQ0NCA5LjcwMzc2IDcuMjAyMTkgOS45MzIxOSA3LjU1MjQ1IDEwLjA5OTRDNy44MDE2NiAxMC4yMTgzIDguMTAwMTEgMTAuMTEyNyA4LjIxOTA1IDkuODYzNDlDOC4zMzggOS42MTQyNyA4LjIzMjM5IDkuMzE1ODIgNy45ODMxOCA5LjE5Njg4QzcuOTI1ODIgOS4xNjk1IDcuODY5MjYgOS4xMzk4IDcuODEzNjUgOS4xMDc3NkM3LjYyNzcyIDkuMDAwNjQgNy40NTIzMSA4Ljg2NzQyIDcuMjkyNjIgOC43MDc3MkM2LjMxNjMxIDcuNzMxNDEgNi4zMTYzMSA2LjE0ODUgNy4yOTI2MiA1LjE3MjE5TDguOTQyNTMgMy41MjIyN0M5LjkxODg0IDIuNTQ1OTYgMTEuNTAxOCAyLjU0NTk2IDEyLjQ3ODEgMy41MjIyN0MxMy40NTQ0IDQuNDk4NTggMTMuNDU0MSA2LjA4MTcyIDEyLjQ3NzggNy4wNTgwM0wxMS40MTc4IDguMTE5NDRDMTEuMzg1IDguMTUyMjkgMTEuMzU3NyA4LjE4ODU1IDExLjMzNiA4LjIyNzA5QzExLjIyODMgOC40MTc4MyAxMS4yNTU3IDguNjY0MjEgMTEuNDE4MyA4LjgyNjU1QzExLjYxMzcgOS4wMjE2OCAxMS45MzAyIDkuMDIxNDggMTIuMTI1NCA4LjgyNjA5TDEzLjE4NTQgNy43NjQ2OEMxNC41NTIgNi4zOTc4MyAxNC41NTE5IDQuMTgxOTIgMTMuMTg1MiAyLjgxNTE2QzExLjgxODMgMS40NDgzMyA5LjYwMjI2IDEuNDQ4MzMgOC4yMzU0MyAyLjgxNTE2TDYuNTg1NTEgNC40NjUwOFpNMi44MTQxOSA4LjIzNjU3QzEuNDQ3MzUgOS42MDM0IDEuNDQ3MzUgMTEuODE5NSAyLjgxNDE5IDEzLjE4NjNDNC4xODEwMiAxNC41NTMxIDYuMzk3MSAxNC41NTMxIDcuNzYzOTQgMTMuMTg2M0w5LjQxMzg1IDExLjUzNjRDMTAuMjQ5OCAxMC43MDA0IDEwLjU3NDUgOS41NDY4NCAxMC4zODc5IDguNDY0MTNDMTAuMjY5NCA3Ljc3NjUzIDkuOTQ0NzQgNy4xMTc1MyA5LjQxMzg1IDYuNTg2NjVDOS4xMjU1MyA2LjI5ODMyIDguNzk4NTMgNi4wNzAyNCA4LjQ0OTEgNS45MDMxNkM4LjE5OTk3IDUuNzg0MDQgNy45MDE0NSA1Ljg4OTQ0IDcuNzgyMzMgNi4xMzg1N0M3LjY2MzIxIDYuMzg3NyA3Ljc2ODYxIDYuNjg2MjIgOC4wMTc3NCA2LjgwNTM0QzguMjY2MjggNi45MjQxOCA4LjQ5OTcxIDcuMDg2NzMgOC43MDY3NSA3LjI5Mzc2QzkuMTA0NjYgNy42OTE2NyA5LjM0MDM5IDguMTkwMzQgOS40MTM5NSA4LjcwNzY0QzkuNTIwODggOS40NTk1OSA5LjI4NTE1IDEwLjI1MDkgOC43MDY3NSAxMC44MjkzTDcuMDU2ODMgMTIuNDc5MkM2LjA4MDUyIDEzLjQ1NTUgNC40OTc2MSAxMy40NTU1IDMuNTIxMyAxMi40NzkyQzIuNTQ1MDIgMTEuNTAyOSAyLjU0NTA4IDkuOTE5OTkgMy41MjEzIDguOTQzNjdMNC41ODI0NyA3Ljg4Mzg4QzQuNzc3ODYgNy42ODg3NCA0Ljc3ODA3IDcuMzcyMTYgNC41ODI5MyA3LjE3Njc3QzQuMzg3OCA2Ljk4MTM4IDQuMDcxMjIgNi45ODExNyAzLjg3NTgzIDcuMTc2MzFMMi44MTQxOSA4LjIzNjU3WiIgZmlsbD0iIzJDOUNDOCIvPgo8L3N2Zz4K"><a target="_blank" href=' + endUrl + '>' + endUrl + '</a>' + '&nbsp;');
                }
            }
            return str;
        },
        // 发送留言前先登录
        checkLogin(event){
            if(!getToken()){
                // 失去焦点
                this.$refs.input.blur()
                MessageBox.confirm('未登录！请先登录', '系统提示', {
                    confirmButtonText: '登录',
                    cancelButtonText: '取消',
                    type: 'warning'
                    }).then(() => {
                        localStorage.setItem('logUrl', router.currentRoute.fullPath);
                        router.push({
                            path: '/Login?login=1'
                    });
                    }).catch(() => {})
                        return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
            }
        },
        //发送留言
        sendMsg(value){//留言
            var that = this;
            if(value === 'root') {
                if(that.textarealength > 300) {
                    this.$message({
                        type:'warning',
                        message:'评论不得超过300字'
                    })
                }
                if(that.textarea){
                    if(getToken()){
                        that.sendTip = '咻~~';
                        var info = JSON.parse(localStorage.getItem('userInfo'));
                        const textarea = that.textarea + "&nbsp;";
                        sendComment(that.type,that.aid,that.rootId,that.toCommentId,that.toCommentUserId,textarea,info.nickName,info.avatar).then((response)=>{
                            this.$message({
                                type:'success',
                                message:'评论成功'
                            })
                            that.textarea = '';
                            that.rootId = "-1";
                            that.toCommentId = "-1";
                            that.toCommentUserId="-1";

                            that.routeChange();
                            that.removeRespond();
                            var timer02 = setTimeout(function(){
                                that.sendTip = '发送~';
                                clearTimeout(timer02);
                            },1000)
                        })
                    }else{
                        MessageBox.confirm('未登录！请先登录', '系统提示', {
                        confirmButtonText: '登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            localStorage.setItem('logUrl', router.currentRoute.fullPath);
                            router.push({
                                path: '/Login?login=1'
                            });
                            }).catch(() => { })
                            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
                    }
                }else{
                    that.sendTip = '内容不能为空~'
                    var timer = setTimeout(function(){
                        that.sendTip = '发送~';
                        clearTimeout(timer);
                    },3000)
                }
            }
            if(value === 'children') {
                if(that.cTextarea.length > 300) {
                    this.$message({
                        type:'warning',
                        message:'评论不得超过300字'
                    })
                }
                if(that.cTextarea){
                    if(getToken()){
                        that.cSendTip = '咻~~';
                        var info = JSON.parse(localStorage.getItem('userInfo'));
                        const cTextarea = that.cTextarea + "&nbsp;";
                        sendComment(that.type,that.aid,that.rootId,that.toCommentId,that.toCommentUserId,cTextarea,info.nickName,info.avatar).then((response)=>{
                            this.$message({
                                type:'success',
                                message:'评论成功'
                            })
                            that.cTextarea = '';
                            that.rootId = "-1";
                            that.toCommentId = "-1";
                            that.toCommentUserId="-1";

                            that.routeChange();
                            that.removeRespond();
                            var timer02 = setTimeout(function(){
                                that.cSendTip = '发送~';
                                clearTimeout(timer02);
                            },1000)
                        })
                    }else{
                        MessageBox.confirm('未登录！请先登录', '系统提示', {
                        confirmButtonText: '登录',
                        cancelButtonText: '取消',
                        type: 'warning'
                        }).then(() => {
                            localStorage.setItem('logUrl', router.currentRoute.fullPath);
                            router.push({
                                path: '/Login?login=1'
                            });
                            }).catch(() => { })
                            return Promise.reject('无效的会话，或者会话已过期，请重新登录。')
                    }
                }else{
                    that.cSendTip = '内容不能为空~'
                    var timer = setTimeout(function(){
                        that.cSendTip = '发送~';
                        clearTimeout(timer);
                    },3000)
                }
            }
        },
        handleTop(id,label) {       //置顶、取消置顶
            // console.log(id,label)
            setTop(id,label).then(res => {
                getArticleComment(this.queryParams).then((response)=>{
                    this.setData(true,response);
                })
            })
        },
        respondMsg(rootId,toCommentId,toCommentUserId){   //回复留言
            // console.log(leavePid,pid);
            var that = this;
            if(getToken()){
                var dom = event.currentTarget;
                dom = dom.parentNode;
                this.isRespond = true;
            //   this.leavePid = leavePid;
                this.rootId = rootId
                this.toCommentId = toCommentId;
                this.toCommentUserId = toCommentUserId
                dom.appendChild(this.$refs.respondBox1);
                this.showRespondBox1 = true;
            }else{
                that.$confirm('登录后即可评论，是否前往登录页面?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }).then(() => {//确定，跳转至登录页面
                    //储存当前页面路径，登录成功后跳回来
                    localStorage.setItem('logUrl',that.$route.fullPath);
                    that.$router.push({path:'/Login?login=1'});
                }).catch(() => {

                });
            }
        },
        removeRespond(){      //取消回复留言
            this.isRespond = false;
            this.showRespondBox1 = false;
            this.rootId = "-1";
            this.toCommentId = "-1";
            this.toCommentUserId="-1";
            this.$refs.tmsgBox.insertBefore(this.$refs.respondBox,this.$refs.listDom);
        },
        showCommentList(initData){      //评论列表
            var that = this;
            that.aid = that.$route.query.aid==undefined?-1:parseInt(that.$route.query.aid);//获取传参的aid
            that.queryParams.articleId = that.aid
            //判断当前用户是否登录
            if(localStorage.getItem('userInfo')){
                that.haslogin = true;
                that.userInfo = JSON.parse(localStorage.getItem('userInfo'));
                that.userId = that.userInfo.id;
                // console.log(that.userInfo.id,that.detailObj)
                // console.log(that.userInfo);
            }else{
                that.haslogin = false;
            }
            //公用设置数据方法
            if(that.$route.name=='DetailArticle'){//文章列表的评论
                that.type = 0;
                getArticleComment(that.queryParams).then((response)=>{
                    that.setData(initData,response);
                })
            }else{//其他评论
                if(that.$route.name == 'FriendsLink'){
                    that.type = 1
                    getLinkComment(that.queryParams).then((response)=>{
                        that.setData(initData,response);
                    })
                }
            }
        },
        addMoreFun(){     //查看更多
            this.queryParams.pageNum++
            this.showCommentList(false);
        },
        routeChange(){    //重新加载
            this.queryParams.pageNum = 1
            this.showCommentList(true);
          this.isAdmin = this.userId === "1"?true:false;
        },
        deleteComment(id){
            MessageBox.confirm('确定要删除评论吗？且该评论下的回复也一并会被删除', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteComment(id).then((response) => {
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                    this.routeChange();
                })
            })
        }
    },
    components: { //定义组件

    },
    computed: {
        isMy() {
            return this.$store.state.isMy
        }
    },
    watch: {
        // 如果路由有变化，会再次执行该方法
        '$route':'routeChange',
        /* textarea(newValue) {
            this.textarea = this.analyzeEmoji(newValue)//编译表情替换成图片展示出来
        } */
    },
    created() { //生命周期函数
        // console.log(this.$route);
        var that = this;
        that.routeChange();
    },
    mounted(){//页面加载完成后

    }
}
</script>

<style>
.el-popover, .el-radio-button:first-child:last-child .el-radio-button__inner {
  border-radius: 7px;
}
.tmsgBox{
    position: relative;
    background: #fff;
    padding:15px;
    margin-bottom: 20px;
    border-radius: 5px;
}
.tmsg-respond h3{
    font-size: 18px;
    font-weight: bold;
    margin-bottom: 8px;
}
.tmsg-respond h3 small{
    font-size: smaller;
    cursor: pointer;
}
.tmsg-respond textarea{
    background:#f4f6f7;
    margin-bottom: 10px;
}
.OwO{
    position: relative;
    z-index: 1;
}
.OwO .OwO-logo{
    position: relative;
    border-radius: 4px;
    color:#444;
    display: inline-block;
    background: #fff;
    border:1px solid #ddd;
    font-size: 13px;
    padding:0 6px;
    cursor: pointer;
    height:30px;
    box-sizing: border-box;
    z-index: 2;
    line-height: 30px;
}
.OwO .OwO-logo:hover{
    animation:a 5s infinite ease-in-out;
    -webkit-animation:a 5s infinite ease-in-out;
}
.OwO .OwO-body{
    position: absolute;
    background: #fff;
    border:1px solid #ddd;
    z-index: 1;
    top:29px;
    border-radius: 0 4px 4px 4px;
    display: none;
}
.OwO-open .OwO-body{
    display: block;
}
.OwO-open .OwO-logo{
    border-radius: 4px 4px 0 0;
    border-bottom: none;
}
.OwO-open .OwO-logo:hover{
    animation:none;
    -webkit-animation:none;
}
.OwO .OwO-items {
    max-height: 197px;
    overflow: scroll;
    font-size: 0;
    padding:10px;
    z-index: 1
}
.OwO .OwO-items .OwO-item{
    background: #f7f7f7;
    padding:5px 10px;
    border-radius: 5px;
    display: inline-block;
    margin: 0 10px 12px 0;
    transition: 0.3s;
    line-height: 19px;
    font-size: 20px;
    cursor: pointer;
}
.OwO .OwO-items .OwO-item:hover{
    background: #eee;
    box-shadow: 0 2px 2px 0 rgba(0,0,0,.14),
                0 3px 1px -2px rgba(0,0,0,.2),
                0 1px 5px 0 rgba(0,0,0,.12);
    animation:a 5s infinite ease-in-out;
    -webkit-animation:a 5s infinite ease-in-out;
}
.OwO .OwO-body .OwO-bar{
    width:100%;
    height:30px;
    border-top: 1px solid #ddd;
    background: #fff;
    border-radius: 0 0 4px 4px;
    color: #444;
}
.OwO .OwO-body .OwO-bar .OwO-packages li{
    display: inline-block;
    line-height: 30px;
    font-size: 14px;
    padding: 0 10px;
    cursor: pointer;
    margin-right: 3px;
    text-align: center;
}
.OwO .OwO-body .OwO-bar .OwO-packages li:first-of-type{
    border-radius: 0 0 0 3px;
}
@-webkit-keyframes a{
    2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
    8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
    10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
    12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
    16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}
    18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
    20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
    24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
    28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}
    30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    32%,34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
    36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
    40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}
    44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
    46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
    52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
    56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}
    60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
    68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
    72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
    74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}
    86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
    88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}
    92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}
    94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}
    96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}
}
@keyframes a{
    2%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    4%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    6%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
    8%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
    10%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
    12%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    14%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
    16%{-webkit-transform:translateY(-.5px) rotate(-1.5deg);transform:translateY(-.5px) rotate(-1.5deg)}
    18%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
    20%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    22%{-webkit-transform:translateY(.5px) rotate(-1.5deg);transform:translateY(.5px) rotate(-1.5deg)}
    24%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    26%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
    28%{-webkit-transform:translateY(.5px) rotate(1.5deg);transform:translateY(.5px) rotate(1.5deg)}
    30%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    32%,34%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
    36%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    38%{-webkit-transform:translateY(1.5px) rotate(-1.5deg);transform:translateY(1.5px) rotate(-1.5deg)}
    40%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    42%{-webkit-transform:translateY(2.5px) rotate(-1.5deg);transform:translateY(2.5px) rotate(-1.5deg)}
    44%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
    46%{-webkit-transform:translateY(-1.5px) rotate(2.5deg);transform:translateY(-1.5px) rotate(2.5deg)}
    48%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    50%{-webkit-transform:translateY(.5px) rotate(.5deg);transform:translateY(.5px) rotate(.5deg)}
    52%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    54%{-webkit-transform:translateY(-1.5px) rotate(1.5deg);transform:translateY(-1.5px) rotate(1.5deg)}
    56%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    58%{-webkit-transform:translateY(.5px) rotate(2.5deg);transform:translateY(.5px) rotate(2.5deg)}
    60%{-webkit-transform:translateY(2.5px) rotate(2.5deg);transform:translateY(2.5px) rotate(2.5deg)}
    62%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    64%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    66%{-webkit-transform:translateY(1.5px) rotate(-.5deg);transform:translateY(1.5px) rotate(-.5deg)}
    68%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    70%{-webkit-transform:translateY(1.5px) rotate(.5deg);transform:translateY(1.5px) rotate(.5deg)}
    72%{-webkit-transform:translateY(2.5px) rotate(1.5deg);transform:translateY(2.5px) rotate(1.5deg)}
    74%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    76%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    78%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    80%{-webkit-transform:translateY(1.5px) rotate(1.5deg);transform:translateY(1.5px) rotate(1.5deg)}
    82%{-webkit-transform:translateY(-.5px) rotate(.5deg);transform:translateY(-.5px) rotate(.5deg)}
    84%{-webkit-transform:translateY(1.5px) rotate(2.5deg);transform:translateY(1.5px) rotate(2.5deg)}
    86%{-webkit-transform:translateY(-1.5px) rotate(-1.5deg);transform:translateY(-1.5px) rotate(-1.5deg)}
    88%{-webkit-transform:translateY(-.5px) rotate(2.5deg);transform:translateY(-.5px) rotate(2.5deg)}
    90%{-webkit-transform:translateY(2.5px) rotate(-.5deg);transform:translateY(2.5px) rotate(-.5deg)}
    92%{-webkit-transform:translateY(.5px) rotate(-.5deg);transform:translateY(.5px) rotate(-.5deg)}
    94%{-webkit-transform:translateY(2.5px) rotate(.5deg);transform:translateY(2.5px) rotate(.5deg)}
    96%{-webkit-transform:translateY(-.5px) rotate(1.5deg);transform:translateY(-.5px) rotate(1.5deg)}
    98%{-webkit-transform:translateY(-1.5px) rotate(-.5deg);transform:translateY(-1.5px) rotate(-.5deg)}
    0%,to{-webkit-transform:translate(0) rotate(0deg);transform:translate(0) rotate(0deg)}
}
/*用户输入表单*/
.tmsg-r-info{
    margin:10px 0;
}
.tmsg-r-info input{
    height:30px;
    border-radius: 4px;
    background: #f4f6f7;
}
.tmsg-r-info .info-submit{
    margin: 10px 0;
    text-align: center;
}
.tmsg-r-info .info-submit p,.tmsg-commentshow h1{
    /*background: #97dffd;*/
    color:#fff;
    border-radius: 5px;
    cursor: pointer;
    /*transition: all .3s ease-in-out;*/
    height:30px;
    line-height: 30px;
    text-align: center;
}
/*.tmsg-r-info .info-submit p:hover{
    background: #47456d;
}*/
/*评论列表*/
.tmsg-comments .tmsg-comments-tip{
    display: block;
    border-left: 4px solid #97dffd;
    padding: 0 10px;
    margin: 40px 0;
    font-size: 20px;
}
.tmsg-commentlist {
    margin-bottom:20px;
}
.tmsg-commentlist-children {
    position: relative;
    margin-bottom:20px;
    margin-left: 50px;
    padding: 0 20px 5px 20px;
    list-style: none;
    background: #f8f8f8;
    border-radius: 6px;
}
.tmsg-commentlist-children:before{
    position: absolute;
    left: 15px;
    top: -17px;
    border: 9px solid transparent;
    border-bottom: 10px solid #f8f8f8;
    content: "";
}
.tmsg-commentshow>.tmsg-commentlist{
    border-bottom: 1px solid #e5eaed;
}
.tmsg-commentshow>.tmsg-commentlist-children{
    border-bottom: 1px solid #e5eaed;
}
.tmsg-c-item{
    border-top: 1px solid rgba(239,239,239,.8);
}
.tmsg-c-item article{
    margin:15px 0;
}
.tmsg-c-item article header{
    margin-bottom:10px;
}
.tmsg-c-item article header img{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    float: left;
    transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    margin-right: 15px;
    object-fit: cover;
    cursor: pointer;
}
.el-popover img{
    width: 60px;
    height: 60px;
    border-radius: 50%;
    float: left;
    transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    margin-right: 15px;
    object-fit: cover;
    cursor: pointer;
}
/* .tmsg-c-item article header img:hover{
    width: 45px;
    height: 45px;
    border-radius: 50%;
    float: left;
    transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    margin-right: 15px;
    object-fit: cover;
}
.tmsg-c-item-children article header img:hover{
    transform: rotate(360deg);
    -webkit-transform: rotate(360deg);
    cursor: pointer;
} */
.tmsg-c-item article header .i-name{
    font-size: 14px;
    margin:5px 8px 7px 0;
    color:#444;
    font-weight: bold;
    display: inline-block;
    cursor: pointer;
}
/* .tmsg-c-item article header .i-class{
    display: inline-block;
    margin-left:10px;
    background: #dff0d8;
    color:#3c763d;
    border-radius: 5px;
    padding: 3px 6px;
    font-size: 12px;
    font-weight: 400;
} */
.tmsg-c-item article header .i-class{
    display: inline-block;
    margin-left:5px;
    background-color: #c0e8af;
    color: #2a632b;
    padding: 1px 5px;
    margin-right: 5px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 400;
}
/* .tmsg-c-item article header .m-class{
    display: inline-block;
    margin-left:10px;
    background: #fde4717a;
    color:#ffa800;
    border-radius: 5px;
    padding: 3px 6px;
    font-size: 12px;
    font-weight: 400;
} */
.tmsg-c-item article header .m-class{
    display: inline-block;
    margin-left:5px;
    background-color: #FBD54E;
    color: #B72025;
    padding: 1px 5px;
    margin-right: 5px;
    border-radius: 3px;
    font-size: 12px;
    font-weight: 400;
}
.tmsg-c-item article header .i-time{
    color:#aaa;
    font-size: 12px;
}
.tmsg-c-item article section{
    margin-left: 60px;
}
.tmsg-c-item article section p{
    line-height: 190%;
    text-overflow: ellipsis;
    overflow: hidden;
}
.tmsg-c-item article section p img{
    vertical-align: middle;
    margin: 0 3px 0 3px;
    width: 18px;
    height: 18px;
}
.tmsg-c-item article section p a{
    letter-spacing: 0;
    color: #47a8cf;
    /* color: #008ac5; */
    /* text-decoration: underline; */
}
.tmsg-c-item article section p a:hover{
    letter-spacing: 0;
    color: #40c5f1;
    /* color: #0363fc; */
    text-decoration: underline;
}
.tmsg-c-item article section .tmsg-replay-div{
    margin:10px 10px 10px 0;
    font-size: 12px;
    color:#64609E;
    cursor: pointer;
}
.tmsg-c-item article section .tmsg-replay-span{
    margin:10px 10px 10px 0;
    font-size: 12px;
    color:#64609E;
    cursor: pointer;
}
.tmsg-c-item article section .tmsg-replay-span:hover{
    margin:10px 10px 10px 0;
    font-size: 12px;
    font-weight: bold;
    color:#45436e;
    cursor: pointer;
}
.el-textarea__inner{
    white-space: nowrap;
}

</style>
