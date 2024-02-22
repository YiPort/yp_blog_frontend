<template>
    <div>
    <yp-navbar></yp-navbar>
    <div style="margin: 20px">
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="75px">
        <el-form-item label="状态:" prop="status">
            <el-select
            v-model="queryParams.status"
            placeholder="登录状态"
            clearable
            style="width: 110px"
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
        <el-form-item label="登录账号:">
            <el-input
            v-model="queryParams.userName"
            @keyup.enter.native="handleQuery"
            style="width: 190px"
            clearable/>
        </el-form-item>
        <el-form-item label="登录地址:">
            <el-input
            v-model="queryParams.loginLocation"
            @keyup.enter.native="handleQuery"
            style="width: 190px"
            clearable/>
        </el-form-item>
        <el-form-item label="提示消息:">
            <el-input
            v-model="queryParams.msg"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="infoTable" :data="dataList" stripe border>
        <el-table-column label="ID" align="center" prop="infoId" />
        <el-table-column label="用户账号" align="center" prop="userName" />
        <el-table-column label="登录地点" align="center" prop="loginLocation" :show-overflow-tooltip="true" />
        <el-table-column label="浏览器类型" align="center" prop="browser" :show-overflow-tooltip="true" />
        <el-table-column label="操作系统" align="center" prop="os" :show-overflow-tooltip="true" />
        <el-table-column label="状态" align="center" prop="status">
            <template slot-scope="scope">
                <el-tag :type="scope.row.status==='0'?'success':'danger'">{{scope.row.status==='0'?'成功':'失败'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="提示消息" align="center" prop="msg" :show-overflow-tooltip="true" />
        <el-table-column label="访问时间" align="center" prop="loginTime" width="180" />
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
import { selectPageLoginInfo,deleteLoginInfo } from '../../api/user'

export default {
    data() {
        return {
            loading: false,
            dialogVisible: false,
            // 总条数
            total: 0,
            // 查询参数
            queryParams: {
                pageNum: 1,
                pageSize: 10,
                userName: undefined,
                loginLocation: undefined,
                status: undefined,
                msg: undefined,
                startTime: undefined,
                endTime: undefined
            },
            // 日期范围
            dateRange: [],
            dataList: null,
            options: [{
                value: '0',
                label: '成功'
            }, {
                value: '1',
                label: '失败'
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
            selectPageLoginInfo(this.queryParams).then(res => {
                this.loading = false;
                this.total = res.total;
                this.dataList = res.rows;
                this.$nextTick(() => {
                    this.$refs.infoTable.doLayout()
                })
            })
        },
        formatter(cont){
            var str = cont;
            str = this.preText(str);
            if (str.length > 25) {   // 超过contentLength长度的内容隐藏
                return str.slice(0, 25) + '...';
            }
            return str;
        },
        handleDelete(row){
            this.$confirm('确定要删除吗？', '系统提示', {
                confirmButtonText: '删除',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                deleteLoginInfo(row.infoId).then((res) => {
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
                userName: undefined,
                loginLocation: undefined,
                status: undefined,
                msg: undefined,
                startTime: undefined,
                endTime: undefined
            },
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
