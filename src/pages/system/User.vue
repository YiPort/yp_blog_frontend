<template>
    <div>
    <yp-navbar></yp-navbar>
    <div style="margin: 20px" v-viewer>
        <el-form :model="queryParams" ref="queryForm" size="small" :inline="true" label-width="68px">
        <el-form-item label="性别:" prop="sex">
            <el-select
            v-model="queryParams.sex"
            placeholder="性别"
            clearable
            style="width: 100px"
            >
            <el-option
                v-for="item in sexOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="状态:" prop="status">
            <el-select
            v-model="queryParams.status"
            placeholder="用户状态"
            clearable
            style="width: 110px"
            >
            <el-option
                v-for="item in statusOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value"
            />
            </el-select>
        </el-form-item>
        <el-form-item label="角色:" prop="userRole">
            <el-select
            v-model="queryParams.userRole"
            placeholder="用户角色"
            clearable
            style="width: 110px"
            >
            <el-option
                v-for="item in roleOptions"
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
        <el-form-item label="昵称:">
            <el-input
            v-model="queryParams.username"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>
        <el-form-item label="账号:">
            <el-input
            v-model="queryParams.nickName"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>
        <el-form-item label="UID:">
            <el-input
            v-model="queryParams.uid"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>
        <el-form-item label="邮箱:">
            <el-input
            v-model="queryParams.email"
            @keyup.enter.native="handleQuery"
            style="width: 200px"
            clearable/>
        </el-form-item>

        <el-form-item>
            <el-button type="primary" icon="el-icon-search" size="mini" @click="handleQuery">搜索</el-button>
            <el-button icon="el-icon-refresh" size="mini" @click="resetQuery">重置</el-button>
        </el-form-item>
        </el-form>

        <el-table v-loading="loading" ref="userTable" :data="dataList" stripe border>
        <el-table-column label="ID" align="center" prop="id"  width="80"/>
        <el-table-column label="UID" align="center" prop="uid"  width="100" />
        <el-table-column label="用户账号" align="center" prop="nickName" />
        <el-table-column label="用户昵称" align="center" prop="nickName" />
        <el-table-column label="用户头像" align="center" width="100">
            <template slot-scope="scope" style="text-align: center;">
                <img class="user-avatar" :src="scope.row.avatar||$store.state.errorImg" >
            </template>
        </el-table-column>
        <el-table-column label="性别" align="center" prop="sex" >
            <template slot-scope="scope">
                <i v-show="scope.row.sex!=null"
                :class="scope.row.sex==='0'?'el-icon-male':'el-icon-female'"
                :style="scope.row.sex==='0'?'color:#409eff':'color:#fb7299'" />
            </template>
        </el-table-column>
        <el-table-column label="邮箱" align="center" prop="email" >
            <template slot-scope="scope">
                {{scope.row.email}}
                <i v-show="scope.row.email" style="cursor: pointer;" @click="copyMail(scope.row.email)" class="el-icon-copy-document"/>
            </template>
        </el-table-column>
        <el-table-column label="用户状态" align="center" prop="status">
            <template slot-scope="scope">
                <el-tag :type="scope.row.status==='0'?'success':'danger'">{{scope.row.status==='0'?'正常':'封禁'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="注册时间" align="center" prop="createTime" width="180" />
        <el-table-column label="用户角色" align="center" prop="userRole">
            <template slot-scope="scope">
                <el-tag :type="scope.row.userRole==='0'?'':'danger'">{{scope.row.userRole==='0'?'普通用户':'管理员'}}</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" align="center" class-name="small-padding fixed-width">
            <template slot-scope="scope">
            <el-button
                size="mini"
                type="text"
                icon="el-icon-edit"
                @click="handleUpdate(scope.row)"
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
import { selectPageUser,deleteUserById } from '../../api/user'

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
                nickName: undefined,
                userName: undefined,
                uid: undefined,
                sex: undefined,
                status: undefined,
                userRole: undefined,
                email: undefined,
                startTime: undefined,
                endTime: undefined
            },
            // 日期范围
            dateRange: [],
            dataList: null,
            sexOptions: [{
                value: 0,
                label: '男'
            }, {
                value: 1,
                label: '女'
            },],
            statusOptions: [{
                value: 0,
                label: '正常'
            }, {
                value: 1,
                label: '封禁'
            },],
            roleOptions: [{
                value: 0,
                label: '普通用户'
            }, {
                value: 1,
                label: '管理员'
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
            selectPageUser(this.queryParams).then(res => {
                this.loading = false;
                this.total = res.total;
                this.dataList = res.rows;
                this.$nextTick(() => {
                    this.$refs.userTable.doLayout()
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
                deleteUserById(row.id).then((res) => {
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
                nickName: undefined,
                userName: undefined,
                uid: undefined,
                sex: undefined,
                status: undefined,
                userRole: undefined,
                email: undefined,
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
        'yp-navbar':header,
    }
}
</script>
<style>
.user-avatar {
    width: 45px;
    height: 45px;
    border-radius: 50%;
    transition: all .4s ease-in-out;
    -webkit-transition: all .4s ease-in-out;
    object-fit: cover;
}
</style>
