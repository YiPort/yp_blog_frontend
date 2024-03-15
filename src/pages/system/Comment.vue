<template>
    <div>
    <yp-navbar></yp-navbar>
    <div style="margin: 20px">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="评论类型" prop="status">
            <el-select
            v-model="queryParams.type"
            placeholder="评论类型"
            clearable
            style="width: 240px"
            >
            <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="创建时间">
            <el-date-picker
            v-model="dateRange"
            style="width: 240px"
            value-format="yyyy-MM-dd"
            type="daterange"
            range-separator="-"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            ></el-date-picker>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="commentTable" :data="dataList" stripe border>
        <el-table-column label="ID" align="center" prop="id" width="80" />
        <el-table-column label="评论类型" align="center" prop="type" width="100">
            <template slot-scope="scope">
                <el-tag :type="scope.row.type==='0'?'':'info'">{{scope.row.type==='0'?'文章':'友链'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否根评论" align="center">
            <template slot-scope="scope">
                <el-tag :type="scope.row.rootId==='-1'?'success':'danger'">{{scope.row.rootId==='-1'?'是':'否'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="评论内容" align="center" :show-overflow-tooltip="true">
            <template slot-scope="scope">
            <router-link :to="scope.row.type==='0'?'/DetailArticle?aid=' + scope.row.articleId:'/Friendslink'" class="link-type">
                <p style="color: #409EFF;" class="comment-table"
                @click="filterContentDetail(scope.row.filterContent,scope.row.avatar,scope.row.createNick)">
                {{formatter(scope.row.filterContent)}}</p>
             </router-link>
            </template>
        </el-table-column>
        <el-table-column label="过滤后的评论" align="center">
            <template slot-scope="scope">
                <p style="color: #409EFF;" class="comment-table"
                @click="filterContentDetail(scope.row.filterContent,scope.row.avatar,scope.row.createNick)">
                {{formatter(scope.row.filterContent)}}</p>
             </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
            <el-tag :type="scope.row.status==='0'?'danger':'success'">{{scope.row.status==='0'?'隐藏':'展示'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" prop="createTime" width="180" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
            >删除</el-button>
            </template>
        </el-table-column>
        </el-table>

        <el-dialog
        title="评论详情"
        :visible.sync="dialogVisible"
        width="30%"
        center>
        <img class="avatar-img" :src="avatar?avatar:$store.state.errorImg">
        <p style="font-size:1.5em;font-weight:bolder;margin-bottom:5px">{{createNick}}</p>
        <p style="margin-left: 60px;" class="comment-table" v-html="analyzeEmoji(filterContent)" />
        <div slot="footer" class="dialog-footer">
            <el-button type="primary" @click="dialogVisible = false">确定</el-button>
        </div>
        </el-dialog>

        <pagination
        v-show="total>0"
        :total="total"
        :page.sync="queryParams.pageNum"
        :limit.sync="queryParams.pageSize"
        @pagination="getList"
        />
    </div>
    </div>
</template>
<script>
import header from '../../components/header.vue'
import {allCommentList,deleteComment} from '../../api/comment'

export default {
    data() {
        return {
            loading: false,
            filterContent: '',
            avatar: '',
            createNick: '',
            dialogVisible: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                type: undefined,
                articleId: undefined,
                startTime: undefined,
                endTime: undefined
            },
            // 日期范围
            dateRange: [],
            dataList: null,
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
            options: [{
                value: '0',
                label: '文章评论'
            }, {
                value: '1',
                label: '友链评论'
            },]
        }
    },
    created(){
        this.$nextTick(() => {
            if(this.$store.state.isAdmin){
                this.getList();
            }else{
                this.$message({
                    type: 'error',
                    message: '无访问权限！'
                })
                this.$router.push({path: '/'})
            }
        })
    },
    methods: {
        getList(){
            this.loading = true;
            if(this.dateRange){
                this.queryParams.startTime = this.dateRange[0]
                this.queryParams.endTime = this.dateRange[1]
            }
            allCommentList(this.queryParams).then(res => {
                this.loading = false;
                this.total = res.total;
                this.dataList = res.rows;
                this.$nextTick(() => {
                  this.$refs.commentTable.doLayout()
                })
            })
        },
        preText(pretext) {
            return pretext.replace(/\r\n/g, '<br/>')
                        .replace(/\n/g, '<br/>')
                        .replace(/\s/g, '&nbsp;');
        },
        formatter(cont){
            var str = cont;
            str = this.preText(str);
            if (str.length > 25) {   // 超过contentLength长度的内容隐藏
                return str.slice(0, 25) + '...';
            }
            return str;
        },
        analyzeEmoji(cont){//编译表情替换成图片展示出来
            var pattern1 = /\[[a-z0-9\u4e00-\u9fa5]+\]/g;
            var pattern2 = /\[[a-z0-9\u4e00-\u9fa5]+\]/;
            var urlRegex= /(https|http|ftp|file):\/\/[-A-Za-z0-9+&@#/%?=~_|!:,.;]+[-A-Za-z0-9+&@#/%=~_|](&nbsp;|<br\/>){1}/g;
            var content = cont.match(pattern1);
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
        filterContentDetail(filterContent,avatar,createNick){
            this.filterContent = filterContent;
            this.avatar=avatar;
            this.createNick=createNick;
            this.dialogVisible = true;
        },
        handleDelete(row){
            this.$confirm('确定要删除评论吗？且该评论下的回复也一并会被删除', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteComment(row.id).then((res) => {
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                    this.getList();
                })
            })
        },
        /** 搜索按钮操作 */
        handleQuery() {
            this.queryParams.pageNum = 1;
            this.getList();
        },
        /** 重置按钮操作 */
        resetQuery() {
            this.dateRange = [];
            this.queryParams = {
                pageNum: 1,
                pageSize: 10,
                type: undefined,
                articleId: undefined,
                startTime: undefined,
                endTime: undefined
            };
            this.handleQuery();
        },
    },
    components: {
        'yp-navbar':header,
    }
}
</script>
<style>
.comment-table{
    letter-spacing: 1px;
    cursor: pointer;
}
.comment-table img{
    vertical-align: middle;
    margin: 0 3px 0 3px;
    width: 18px;
    height: 18px;
}
.comment-table a{
    letter-spacing: 0;
    color: #47a8cf;
}
.avatar-img{
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
</style>
