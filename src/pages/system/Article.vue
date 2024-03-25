<template>
    <div>
    <sg-navbar></sg-navbar>
    <div style="margin: 20px" v-viewer>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="80px">
        <el-form-item label="状态:" prop="status">
            <el-select
            v-model="queryParams.status"
            placeholder="状态"
            clearable
            style="width: 100px"
            >
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="审核状态:" prop="articleExamine">
            <el-select
            v-model="queryParams.articleExamine"
            placeholder="审核状态"
            clearable
            style="width: 110px"
            >
            <el-option
                v-for="item in examineOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="是否置顶:" prop="isTop">
            <el-select
            v-model="queryParams.isTop"
            placeholder="是否置顶"
            clearable
            style="width: 110px"
            >
            <el-option
                v-for="item in isTopOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="允许评论:" prop="isComment">
            <el-select
            v-model="queryParams.isComment"
            placeholder="是否允许评论"
            clearable
            style="width: 120px"
            >
            <el-option
                v-for="item in isCommentOptions"
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
        <el-form-item label="文章标题:">
            <el-input
            v-model="queryParams.title"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>
        <!-- <el-form-item label="账号:">
            <el-input
            v-model="queryParams.userAccount"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item> -->
        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="userTable" :data="dataList" stripe border>
        <el-table-column label="ID" align="center" prop="id" width="80"/>
        <el-table-column label="标题" align="center" prop="title"/>
        <el-table-column label="文章内容" align="center" prop="content" >
            <template slot-scope="scope">
                <p style="color: #409EFF;cursor: pointer;" class="comment-table" 
                @click="showArticle(scope.row.content,scope.row.title)">
                {{formatter(scope.row.content)}}</p>
            </template>
        </el-table-column>
        <el-table-column label="文章摘要" align="center" prop="summary" :show-overflow-tooltip="true"/>
        <el-table-column label="缩略图" align="center" width="100">
            <template slot-scope="scope" style="text-align: center;">
                <img class="thumbnail-img" :src="scope.row.thumbnail||$store.state.empty" >
            </template>
        </el-table-column>
        <el-table-column label="是否置顶" align="center" prop="gender" width="80">
            <template slot-scope="scope">
                <el-tag :type="scope.row.isTop==='1'?'success':'danger'">{{scope.row.isTop==='1'?'是':'否'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="是否允许评论" align="center" prop="isComment" width="80">
            <template slot-scope="scope">
                <el-tag :type="scope.row.isComment==='1'?'success':'danger'">{{scope.row.isComment==='1'?'是':'否'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="状态" align="center" prop="gender" width="80">
            <template slot-scope="scope">
                <el-tag :type="scope.row.status==='0'?'success':'warning'">{{scope.row.status==='0'?'已发布':'草稿'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="审核状态" align="center" prop="gender" width="100">
            <template slot-scope="scope">
                <el-tag v-if="scope.row.articleExamine==='0'" type="warning">待审核</el-tag>
                <el-tag v-if="scope.row.articleExamine==='1'" type="success">通过</el-tag>
                <el-tag v-if="scope.row.articleExamine==='2'" type="danger">驳回</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" prop="createTime" width="180" />
        <el-table-column label="最后编辑时间" align="center" prop="updateTime" width="180" />
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width" width="160">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="Object.assign(form,scope.row); dialogFormVisible = true"
            >修改</el-button>
            <el-button
                size="mini"
                type="text"
                icon="el-icon-delete"
                @click="handleDelete(scope.row)"
            >删除</el-button>
            </template>
        </el-table-column>
        </el-table>

        <el-drawer
        size="100%"
        :visible.sync="drawer"
        direction="ltr">
        <mavon-editor v-model="content" @save="saveFile"></mavon-editor>
        </el-drawer>

        <el-dialog title="审核文章" :visible.sync="dialogFormVisible">
        <el-form :model="form">
            <el-form-item label="审核状态:">
            <el-select v-model="form.articleExamine" placeholder="请选择审核状态" :disabled="form.status==='1'">
                <el-option label="待审核" value="0" disabled></el-option>
                <el-option label="审核通过" value="1"></el-option>
                <el-option label="驳回" value="2"></el-option>
            </el-select>
            </el-form-item>
            <el-form-item label="驳回理由:" v-if="form.articleExamine==='2'">
            <el-input 
            v-model="form.notPassMessage"
            ></el-input>
            </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
            <el-button @click="dialogFormVisible = false">取 消</el-button>
            <el-button type="primary" @click="handUpdate">确 定</el-button>
        </div>
        </el-dialog>

        <pagination
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
import { selectPageArticle,editArticleExamine } from '../../api/article'

export default {
    data() {
        return {
            form: {
                articleExamine: undefined,
            },
            dialogFormVisible: false,
            drawer: false,
            content: '',
            title: '',
            loading: false,
            dialogVisible: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                title: undefined,
                categoryId: undefined,
                isTop: undefined,
                status: undefined,
                articleExamine: undefined,
                isComment: undefined,
                createBy: undefined,
                startTime: undefined,
                endTime: undefined
            },
            // 日期范围
            dateRange: [],
            dataList: [
                {
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                },{
                    "id": 1,
                    "title": "...",
                    "content": "...",
                    "summary": "",
                    "categoryId": 15,
                    "thumbnail": "",
                    "isTop": "0",
                    "status": "0",
                    "articleExamine": "0",
                    "viewCount": 1,
                    "isComment": "1",
                    "createBy": 1,
                    "createTime": "...... ...",
                    "updateBy": null,
                    "updateTime": "...... ...",
                    "delFlag": 0,
                    "categoryName": null,
                    "notPassMessage": null
                }
            ],
            statusOptions: [{
                value: '0',
                label: '已发布'
            }, {
                value: '1',
                label: '草稿'
            },],
            isTopOptions: [{
                value: '0',
                label: '否'
            }, {
                value: '1',
                label: '是'
            },],
            examineOptions: [{
                value: '0',
                label: '待审核'
            }, {
                value: '1',
                label: '审核通过'
            }, {
                value: '2',
                label: '驳回'
            },],
            isCommentOptions: [{
                value: '0',
                label: '否'
            }, {
                value: '1',
                label: '是'
            },],
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
        handUpdate() {
            if(this.form.articleExamine === '2' && 
            (this.form.notPassMessage === null || this.form.notPassMessage.length === 0))
            {
                this.$message.warning('请填写驳回理由');
                return;
            }
            editArticleExamine(this.form).then(res => {
                this.$message.success('修改成功！');
                this.getList();
                this.dialogFormVisible = false;
            })
        },
        saveFile(text) {    // 将文章保存到本地
            const eleLink = document.createElement('a');
            eleLink.download = this.title + '.md';
            eleLink.style.display = 'none';
            // 将内容转为 blob
            const blob = new Blob([text], {type: 'text/markdown;charset=utf-8'});
            eleLink.href = URL.createObjectURL(blob);
            document.body.appendChild(eleLink);
            eleLink.click();
            document.body.removeChild(eleLink);
        },
        formatter(content){
            if (content.length > 25) {   // 超过contentLength长度的内容隐藏
                return content.slice(0, 25) + '...';
            }
            return content;
        },
        showArticle(content,title) {
            this.content = content;
            this.title = title;
            this.drawer = true;
        },
        getList(){
            this.loading = true;
            if(this.dateRange){
                this.queryParams.startTime = this.dateRange[0];
                this.queryParams.endTime = this.dateRange[1];
            }else {
                this.queryParams.startTime = undefined;
                this.queryParams.endTime = undefined;
            }
            selectPageArticle(this.queryParams).then(res => {
                this.loading = false;
                this.total = res.total;
                this.dataList = res.rows;
                this.$nextTick(() => {
                    this.$refs.userTable.doLayout();
                })
            })
        },
        handleDelete(row){
            this.$confirm('确定要删除吗？', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                /* deleteUserById(row.id).then((res) => {
                    this.$message({
                        type:'success',
                        message:'删除成功'
                    })
                    this.getList();
                }) */
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
                title: undefined,
                categoryId: undefined,
                isTop: undefined,
                status: undefined,
                articleExamine: undefined,
                isComment: undefined,
                createBy: undefined,
                startTime: undefined,
                endTime: undefined
            };
            this.handleQuery();
        },
        copyMail(msg){
            navigator.clipboard.writeText(msg).then(() => {
            this.$message({
                type:'success',
                message:'已复制到剪贴板',
                duration: 1000
            })
          });
        }
    },
    components: {
        'sg-navbar':header,
    }
}
</script>

<style lang="less">
.thumbnail-img {
    width: 60px;
    height: 50px;
    /* border-radius: 50%; */
    transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    object-fit: cover;
}
.detailBox .article-content{
    font-size: 15px;
    white-space: normal;
    word-wrap: break-word;
    word-break: break-all;
    overflow-x: hidden;
}
.detailBox .article-content p{
    margin:10px 0;
    line-height:24px;
    word-wrap: break-word;
    word-break: break-all;
    overflow-x: hidden;
}
.detailBox .article-content pre{
    position: relative;
    background-color: #1a1818;
    border: 1px solid #ccc;
    border-radius: 4px;
    word-wrap: break-word;
    word-break: break-all;
    overflow-x: auto;
    border: 0;
    box-shadow: 4px 10px 3px rgba(0, 0, 0, 0.5);
}
/* 复制按钮样式 */
pre .btn-pre-copy{
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 0;
    line-height: 1;
    cursor: pointer;
    color: #1a1818;
}
pre:hover .btn-pre-copy{
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    -khtml-user-select: none;
    user-select: none;
    position: absolute;
    top: 10px;
    right: 12px;
    font-size: 20px;
    line-height: 1;
    cursor: pointer;
    color: rgba(184, 181, 181, 0.8);
    transition: color 1s;
    -webkit-transition: all 0.2s linear 0s;
}
pre:hover .btn-pre-copy:active{
  color:#22863a;
}
.detailBox .article-content img{
    max-width: 100%!important;
    height: auto!important;
    overflow-x: hidden;
    cursor: zoom-in;
    // transition: transform .3s cubic-bezier(.2,0,.2,1)!important;
}
.detailBox .article-content a{
    color:#3a8ee6!important;
}
.detailBox .article-content a:hover{
    text-decoration: underline;
    color: #3a8ee6!important;
}
.detailBox .article-content i{
    font-style: italic;
}
.detailBox .article-content strong{
    font-weight: bold;
}
.detailBox .article-content ul{
    list-style-type: disc!important;
    list-style: disc!important;
    padding-left: 40px!important;
    li{
        list-style-type: disc!important;
        list-style: disc!important;
    }
}
.detailBox .article-content h1, .detailBox .article-content h2, .detailBox .article-content h3{
    font-size: 200%;
    font-weight: bold;
}
 .detailBox .article-content h4, .detailBox .article-content h5, .detailBox .article-content h6{
    font-size: 150%;
    font-weight: bold;
}
.detailBox .viewdetail{
    margin:10px 0 ;
    line-height: 24px;
    text-align: center;
}
/*分享图标*/
.dshareBox {
    margin-top:40px;
    position: relative;
}
.dshareBox a{
    position: relative;
    display: inline-block;
    width: 32px;
    height: 32px;
    font-size: 18px;
    border-radius: 50%;
    line-height: 32px;
    text-align: center;
    vertical-align: middle;
    margin: 4px;
    background: #fff;
    transition: background 0.6s ease-out;
}
.dshareBox .ds-weibo{
    border: 1px solid #ff763b;
    color: #ff763b;
}
.dshareBox .ds-weibo:hover{
    color: #fff;
    background: #ff763b;
}
.dshareBox .ds-qq{
    color: #56b6e7;
    border: 1px solid #56b6e7;
}
.dshareBox .ds-qq:hover{
    color: #fff;
    background: #56b6e7;
}
.dshareBox .ds-wechat{
    color: #7bc549;
    border: 1px solid #7bc549;
}
.dshareBox .ds-wechat:hover{
    color: #fff;
    background: #7bc549;
}
.dshareBox .ds-wechat:hover .wechatShare{
    opacity: 1;
    visibility: visible;
}
.detailBox .bdshare-button-style0-32 a{
    float:none;
    background-image: none;
    text-indent: inherit;
}
/*点赞 收藏*/
.dlikeColBox{
    display: inline-block;
    float:right;
}
.dlikeBox,.dcollectBox{
    display: inline-block;
    padding:0 10px;
    height:35px;
    color: #e26d6d;
    line-height: 35px;
    border-radius: 35px;
    border: 1px solid #e26d6d;
    cursor: pointer;
}

/*赞赏*/
.donate-word{
    margin:40px 0;
    text-align: center;
}
.donate-word span{
    display: inline-block;
    width:80px;
    height:34px;
    line-height: 34px;
    color:#fff;
    background: #e26d6d;
    margin:0 auto;
    border-radius: 4px;
    cursor: pointer;
}
.donate-body{
    display: none;
}
.donate-body-show{
    display: block;
}
.donate-item{
    text-align: right;
}
.donate-item:last-child{
    text-align: left;
}
.donate-item img{
    width:100%;
    display: block;
    height:auto;
}
.donate-item div{
    display: inline-block;
    width: 150px;
    padding: 0 6px;
    box-sizing: border-box;
    text-align: center;
}
.donate-item div span{
    display: inline-block;
    width:100%;
    margin: 10px 0;
    text-align: center;
}
.donate-body .donate-item:first-of-type div{
    color:#44b549;
}
.donate-body .donate-item:nth-of-type(2) div{
    color:#00a0e9;
}

.bd_weixin_popup{
    position: fixed!important;
}



@font-face {
  font-family: octicons-link;
  src: url(data:font/woff;charset=utf-8;base64,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) format('woff');
}

.markdown-body {
  -ms-text-size-adjust: 100%;
  -webkit-text-size-adjust: 100%;
  line-height: 1.5;
  color: #24292e;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
  font-size: 16px;
  line-height: 1.5;
  word-wrap: break-word;
}

.markdown-body .pl-c {
  color: #6a737d;
}

.markdown-body .pl-c1,
.markdown-body .pl-s .pl-v {
  color: #005cc5;
}

.markdown-body .pl-e,
.markdown-body .pl-en {
  color: #6f42c1;
}

.markdown-body .pl-smi,
.markdown-body .pl-s .pl-s1 {
  color: #24292e;
}

.markdown-body .pl-ent {
  color: #22863a;
}

.markdown-body .pl-k {
  color: #d73a49;
}

.markdown-body .pl-s,
.markdown-body .pl-pds,
.markdown-body .pl-s .pl-pse .pl-s1,
.markdown-body .pl-sr,
.markdown-body .pl-sr .pl-cce,
.markdown-body .pl-sr .pl-sre,
.markdown-body .pl-sr .pl-sra {
  color: #032f62;
}

.markdown-body .pl-v,
.markdown-body .pl-smw {
  color: #e36209;
}

.markdown-body .pl-bu {
  color: #b31d28;
}

.markdown-body .pl-ii {
  color: #fafbfc;
  background-color: #b31d28;
}

.markdown-body .pl-c2 {
  color: #fafbfc;
  background-color: #d73a49;
}

.markdown-body .pl-c2::before {
  content: "^M";
}

.markdown-body .pl-sr .pl-cce {
  font-weight: bold;
  color: #22863a;
}

.markdown-body .pl-ml {
  color: #735c0f;
}

.markdown-body .pl-mh,
.markdown-body .pl-mh .pl-en,
.markdown-body .pl-ms {
  font-weight: bold;
  color: #005cc5;
}

.markdown-body .pl-mi {
  font-style: italic;
  color: #24292e;
}

.markdown-body .pl-mb {
  font-weight: bold;
  color: #24292e;
}

.markdown-body .pl-md {
  color: #b31d28;
  background-color: #ffeef0;
}

.markdown-body .pl-mi1 {
  color: #22863a;
  background-color: #f0fff4;
}

.markdown-body .pl-mc {
  color: #e36209;
  background-color: #ffebda;
}

.markdown-body .pl-mi2 {
  color: #f6f8fa;
  background-color: #005cc5;
}

.markdown-body .pl-mdr {
  font-weight: bold;
  color: #6f42c1;
}

.markdown-body .pl-ba {
  color: #586069;
}

.markdown-body .pl-sg {
  color: #959da5;
}

.markdown-body .pl-corl {
  text-decoration: underline;
  color: #032f62;
}

.markdown-body .octicon {
  display: inline-block;
  vertical-align: text-top;
  fill: currentColor;
}

.markdown-body a {
  background-color: transparent;
  -webkit-text-decoration-skip: objects;
}

.markdown-body a:active,
.markdown-body a:hover {
  outline-width: 0;
}

.markdown-body strong {
  font-weight: inherit;
}

.markdown-body strong {
  font-weight: bolder;
}

.markdown-body h1 {
  font-size: 2em;
  margin: 0.67em 0;
}

.markdown-body img {
  border-style: none;
    cursor: zoom-in;
    transition: transform .3s cubic-bezier(.2,0,.2,1)!important;
}

.markdown-body svg:not(:root) {
  overflow: hidden;
}

.markdown-body code,
.markdown-body kbd,
.markdown-body pre {
  font-family: monospace, monospace;
  font-size: 4em;
  font-family: Lucida Console;
}

.markdown-body hr {
  box-sizing: content-box;
  height: 0;
  overflow: visible;
}

.markdown-body input {
  font: inherit;
  margin: 0;
}

.markdown-body input {
  overflow: visible;
}

.markdown-body [type="checkbox"] {
  box-sizing: border-box;
  padding: 0;
}

.markdown-body * {
  box-sizing: border-box;
}

.markdown-body input {
  font-family: inherit;
  font-size: inherit;
  line-height: inherit;
}

.markdown-body a {
  color: #0366d6;
  text-decoration: none;
}

.markdown-body a:hover {
  text-decoration: underline;
}

.markdown-body strong {
  font-weight: 600;
}

.markdown-body hr {
  height: 0;
  margin: 15px 0;
  overflow: hidden;
  background: transparent;
  border: 0;
  border-bottom: 1px solid #dfe2e5;
}

.markdown-body hr::before {
  display: table;
  content: "";
}

.markdown-body hr::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body table {
  border-spacing: 0;
  border-collapse: collapse;
}

.markdown-body td,
.markdown-body th {
  padding: 0;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body h1 {
  font-size: 32px;
  font-weight: 600;
}

.markdown-body h2 {
  font-size: 24px;
  font-weight: 600;
}

.markdown-body h3 {
  font-size: 20px;
  font-weight: 600;
}

.markdown-body h4 {
  font-size: 16px;
  font-weight: 600;
}

.markdown-body h5 {
  font-size: 14px;
  font-weight: 600;
}

.markdown-body h6 {
  font-size: 12px;
  font-weight: 600;
}

.markdown-body p {
  margin-top: 0;
  margin-bottom: 10px;
}

.markdown-body blockquote {
  margin: 0;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 0;
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body ol ol,
.markdown-body ul ol {
  list-style-type: lower-roman;
}

.markdown-body ul ul ol,
.markdown-body ul ol ol,
.markdown-body ol ul ol,
.markdown-body ol ol ol {
  list-style-type: lower-alpha;
}

.markdown-body dd {
  margin-left: 0;
}

.markdown-body code {
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 12px;
}

.markdown-body pre {
  margin-top: 0;
  margin-bottom: 0;
  font-family: "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  font-size: 12px;
}

.markdown-body .octicon {
  vertical-align: text-bottom;
}

.markdown-body .pl-0 {
  padding-left: 0 !important;
}

.markdown-body .pl-1 {
  padding-left: 4px !important;
}

.markdown-body .pl-2 {
  padding-left: 8px !important;
}

.markdown-body .pl-3 {
  padding-left: 16px !important;
}

.markdown-body .pl-4 {
  padding-left: 24px !important;
}

.markdown-body .pl-5 {
  padding-left: 32px !important;
}

.markdown-body .pl-6 {
  padding-left: 40px !important;
}

.markdown-body::before {
  display: table;
  content: "";
}

.markdown-body::after {
  display: table;
  clear: both;
  content: "";
}

.markdown-body>*:first-child {
  margin-top: 0 !important;
}

.markdown-body>*:last-child {
  margin-bottom: 0 !important;
}

.markdown-body a:not([href]) {
  color: inherit;
  text-decoration: none;
}

.markdown-body .anchor {
  float: left;
  padding-right: 4px;
  margin-left: -20px;
  line-height: 1;
}

.markdown-body .anchor:focus {
  outline: none;
}

.markdown-body p,
.markdown-body blockquote,
.markdown-body ul,
.markdown-body ol,
.markdown-body dl,
.markdown-body table,
.markdown-body pre {
  margin-top: 0;
  margin-right: 9px;
  margin-bottom: 16px;
}

.markdown-body hr {
  height: 0.25em;
  padding: 0;
  margin: 24px 0;
  background-color: #e1e4e8;
  border: 0;
}

.markdown-body blockquote {
  padding: 0 1em;
  color: #6a737d;
  border-left: 0.25em solid #dfe2e5;
}

.markdown-body blockquote>:first-child {
  margin-top: 0;
}

.markdown-body blockquote>:last-child {
  margin-bottom: 0;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font-size: 11px;
  line-height: 10px;
  color: #444d56;
  vertical-align: middle;
  background-color: #fafbfc;
  border: solid 1px #c6cbd1;
  border-bottom-color: #959da5;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #959da5;
}

.markdown-body h1,
.markdown-body h2,
.markdown-body h3,
.markdown-body h4,
.markdown-body h5,
.markdown-body h6 {
  margin-top: 24px;
  margin-bottom: 16px;
  font-weight: 600;
  line-height: 1.25;
}

.markdown-body h1 .octicon-link,
.markdown-body h2 .octicon-link,
.markdown-body h3 .octicon-link,
.markdown-body h4 .octicon-link,
.markdown-body h5 .octicon-link,
.markdown-body h6 .octicon-link {
  color: #1b1f23;
  vertical-align: middle;
  visibility: hidden;
}

.markdown-body h1:hover .anchor,
.markdown-body h2:hover .anchor,
.markdown-body h3:hover .anchor,
.markdown-body h4:hover .anchor,
.markdown-body h5:hover .anchor,
.markdown-body h6:hover .anchor {
  text-decoration: none;
}

.markdown-body h1:hover .anchor .octicon-link,
.markdown-body h2:hover .anchor .octicon-link,
.markdown-body h3:hover .anchor .octicon-link,
.markdown-body h4:hover .anchor .octicon-link,
.markdown-body h5:hover .anchor .octicon-link,
.markdown-body h6:hover .anchor .octicon-link {
  visibility: visible;
}

.markdown-body h1 {
  padding-bottom: 0.3em;
  font-size: 2em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h2 {
  padding-bottom: 0.3em;
  font-size: 1.5em;
  border-bottom: 1px solid #eaecef;
}

.markdown-body h3 {
  font-size: 1.25em;
}

.markdown-body h4 {
  font-size: 1em;
}

.markdown-body h5 {
  font-size: 0.875em;
}

.markdown-body h6 {
  font-size: 0.85em;
  color: #6a737d;
}

.markdown-body ul,
.markdown-body ol {
  padding-left: 2em;
}

.markdown-body ul ul,
.markdown-body ul ol,
.markdown-body ol ol,
.markdown-body ol ul {
  margin-top: 0;
  margin-bottom: 0;
}

.markdown-body li>p {
  margin-top: 16px;
}

.markdown-body li+li {
  margin-top: 0.25em;
}

.markdown-body dl {
  padding: 0;
}

.markdown-body dl dt {
  padding: 0;
  margin-top: 16px;
  font-size: 1em;
  font-style: italic;
  font-weight: 600;
}

.markdown-body dl dd {
  padding: 0 16px;
  margin-bottom: 16px;
}

.markdown-body table {
  display: block;
  width: 100%;
  overflow: auto;
}

.markdown-body table th {
  font-weight: 600;
}

.markdown-body table th,
.markdown-body table td {
  padding: 6px 13px;
  border: 1px solid #dfe2e5;
}

.markdown-body table tr {
  background-color: #fff;
  border-top: 1px solid #c6cbd1;
}

.markdown-body table tr:nth-child(2n) {
  background-color: #f6f8fa;
}

.markdown-body img {
  max-width: 100%;
  box-sizing: content-box;
  background-color: #fff;
}

.markdown-body img[align=right] {
  padding-left: 20px;
}

.markdown-body img[align=left] {
  padding-right: 20px;
}

.markdown-body code {
  padding: 0;
  padding-top: 0.2em;
  padding-bottom: 0.2em;
  margin: 0;
  font-size: 85%;
  background-color: rgba(27,31,35,0.05);
  border-radius: 3px;
}

.markdown-body code::before,
.markdown-body code::after {
  letter-spacing: -0.2em;
  content: "\00a0";
}

.markdown-body pre {
  word-wrap: normal;
}

.markdown-body pre>code {
  padding: 0;
  margin: 0;
  font-size: 100%;
  word-break: normal;
  white-space: pre;
  background: transparent;
  border: 0;
}

.markdown-body .highlight {
  margin-bottom: 16px;
}

.markdown-body .highlight pre {
  margin-bottom: 0;
  word-break: normal;
}

.markdown-body .highlight pre,
.markdown-body pre {
  padding: 16px;
  overflow: auto;
  font-size: 0.9em;
  line-height: 1.45;
  // background-color: #f6f8fa;
  background-color: #1a1818;
  border-radius: 3px;
}

.markdown-body pre code {
  display: inline;
  max-width: auto;
  padding: 0;
  margin: 0;
  overflow: visible;
  line-height: inherit;
  word-wrap: normal;
  background-color: transparent;
  border: 0;
}

.markdown-body pre code::before,
.markdown-body pre code::after {
  content: normal;
}

.markdown-body .full-commit .btn-outline:not(:disabled):hover {
  color: #005cc5;
  border-color: #005cc5;
}

.markdown-body kbd {
  display: inline-block;
  padding: 3px 5px;
  font: 11px "SFMono-Regular", Consolas, "Liberation Mono", Menlo, Courier, monospace;
  line-height: 10px;
  color: #444d56;
  vertical-align: middle;
  background-color: #fafbfc;
  border: solid 1px #d1d5da;
  border-bottom-color: #c6cbd1;
  border-radius: 3px;
  box-shadow: inset 0 -1px 0 #c6cbd1;
}

.markdown-body :checked+.radio-label {
  position: relative;
  z-index: 1;
  border-color: #0366d6;
}

.markdown-body .task-list-item {
  list-style-type: none;
}

.markdown-body .task-list-item+.task-list-item {
  margin-top: 3px;
}

.markdown-body .task-list-item input {
  margin: 0 0.2em 0.25em -1.6em;
  vertical-align: middle;
}

.markdown-body hr {
  border-bottom-color: #eee;
}

</style>
