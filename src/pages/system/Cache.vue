<template>
    <div>
        <yp-navbar></yp-navbar>
        <div class="app-container">
            <el-row :gutter="10">
                <el-col :span="24">
                    <el-card
                    v-loading.fullscreen.lock="fullscreenLoading"
                    v-loading="mapLoading"
                    element-loading-text="数据加载中...">
                    <div slot="header"><span>Redis基本信息</span></div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <table cellspacing="0" style="width: 100%">
                        <tbody>
                            <tr>
                            <td class="el-table__cell is-leaf"><div class="cell">Redis版本</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.redis_version }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">运行模式</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.redis_mode == "standalone" ? "单机" : "集群" }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">端口</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.tcp_port }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">客户端数</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.connected_clients }}</div></td>
                            </tr>
                            <tr>
                            <td class="el-table__cell is-leaf"><div class="cell">运行时间(天)</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.uptime_in_days }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">使用内存</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.used_memory_human }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">使用CPU</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ parseFloat(cache.info.used_cpu_user_children).toFixed(2) }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">内存配置</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.maxmemory_human }}</div></td>
                            </tr>
                            <tr>
                            <td class="el-table__cell is-leaf"><div class="cell">AOF是否开启</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.aof_enabled == "0" ? "否" : "是" }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">RDB是否成功</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.rdb_last_bgsave_status }}</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">Key数量</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.dbSize">{{ cache.dbSize }} </div></td>
                            <td class="el-table__cell is-leaf"><div class="cell">网络入口/出口</div></td>
                            <td class="el-table__cell is-leaf"><div class="cell" v-if="cache.info">{{ cache.info.instantaneous_input_kbps }}kps/{{cache.info.instantaneous_output_kbps}}kps</div></td>
                            </tr>
                        </tbody>
                        </table>
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="margin: 10px 0 20px 0; cursor: pointer;" shadow="hover">
                    <div slot="header"><span>命令统计</span></div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div ref="commandstats" style="height: 400px" />
                    </div>
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card style="margin: 10px 0 20px 0; cursor: pointer;" shadow="hover">
                    <div slot="header">
                        <span>内存信息</span>
                    </div>
                    <div class="el-table el-table--enable-row-hover el-table--medium">
                        <div ref="usedmemory" style="height: 400px" />
                    </div>
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<script>
import header from '../../components/header.vue'
import { getCache } from '../../api/system';
import * as echarts from 'echarts';

export default {
    name: "Cache",
    data() {
        return {
            // 统计命令信息
            commandstats: null,
            // 使用内存
            usedmemory: null,
            // cache信息
            cache: [],
            fullscreenLoading: false
        };
    },
    created() {
        this.$nextTick(() => {
            if(this.$store.state.isAdmin){
                this.fullscreenLoading = true;
                this.getList();
                this.openLoading();
            }else{
                Message({
                    type: 'error',
                    message: '无访问权限！'
                })
                this.$router.push({path: '/'})
            }
        })
    },
    methods: {
        /** 查缓存询信息 */
        getList() {
            getCache().then((response) => {
                this.cache = response;

                this.commandstats = echarts.init(this.$refs.commandstats, "macarons");
                this.commandstats.setOption({
                    tooltip: {
                        trigger: "item",
                        formatter: "{a} <br/>{b} : {c} ({d}%)",
                    },
                    series: [
                        {
                        name: "命令",
                        type: "pie",
                        roseType: "radius",
                        radius: [15, 95],
                        center: ["50%", "38%"],
                        data: response.commandStats,
                        animationEasing: "cubicInOut",
                        animationDuration: 1000,
                        },
                    ],
                });
                this.usedmemory = echarts.init(this.$refs.usedmemory, "macarons");
                this.usedmemory.setOption({
                    tooltip: {
                        formatter: "{b} <br/>{a} : " + this.cache.info.used_memory_human,
                    },
                    series: [
                        {
                        name: "峰值",
                        type: "gauge",
                        min: 0,
                        max: this.cache.info.used_memory_human.substr(-1)==='M'?Number(this.cache.info.used_memory_human.split('.')[0])+1:1000,
                        detail: {
                            formatter: this.cache.info.used_memory_human,
                        },
                        data: [
                            {
                                value: parseFloat(this.cache.info.used_memory_human),
                                name: "内存消耗",
                            },
                        ],
                        },
                    ],
                });
            });
            setTimeout(() => {
                this.fullscreenLoading = false;
            }, 500);
        },
    },
    components: {
        'yp-navbar':header,
    }
};
</script>

<style>
.app-container{
    margin: 0 30px 20px 30px;
}
</style>
