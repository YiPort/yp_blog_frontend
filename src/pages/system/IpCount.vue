<template>
    <div>
        <yp-navbar></yp-navbar>
    <el-row :gutter="10">
        <el-col :sm="24" :md="14">
            <el-card style="margin: 10px;"
            v-loading="mapLoading"
            element-loading-text="数据加载中...">
                <div id="myChartChina" style="width: 820px; height: 650px" />
            </el-card>
        </el-col>
        <!-- <el-col :span="10">
            <el-card style="margin: 10px;">
                <div id="myChartChina" style="width: 800px; height: 650px" />
            </el-card>
        </el-col> -->
    </el-row>
    </div>
</template>
<script>
import header from '../../components/header.vue'
import * as echarts from 'echarts';
require('echarts/map/js/china')
require("echarts/map/json/china.json");
import { getIpAdress } from '../../api/system';
import { Message } from 'element-ui'
export default {
    data() {
        return {
            chinachart: null,
            data: null,
            mapLoading: true
        };
    },
    created() {
        this.$nextTick(() => {
            if(this.$store.state.isAdmin){
                this.mapLoading = true;
                this.getIpAdress();
            }else{
                Message({
                    type: 'error',
                    message: '无访问权限！'
                })
                this.$router.push({path: '/'})
            }
        })
    },
    mounted() {
    },
    methods: {
        drawLine() {
            this.chinachart = echarts.init(document.getElementById('myChartChina'));
            // 绘制图表
            let optionMap = {
                title: {
                    text: '本站IP访问来源',
                    subtext: '',
                    sublink:
                    ''
                },
                tooltip: {
                    trigger: 'item',
                },
                toolbox: {
                    show: true,
                    orient: 'horizontal',
                    left: 'center',
                    top: 'bottom',
                    feature: {
                        dataView: { readOnly: true, title: '数据视图' },
                        restore: {title: '还原'},
                        saveAsImage: {title: '保存图片'}
                    }
                },
                //左侧小导航图标
                visualMap: {
                    min: 0,
                    max: 2000,
                    text: ['高', '低'],
                    realtime: false,
                    calculable: true,
                    inRange: {
                    color: ['lightskyblue', 'yellow', 'orangered']
                    // color: ['#aed7ff', '#0483ff', '#0070dd']
                    }
                },
                //配置属性
                series: [
                    {
                        name: "数据",
                        type: "map",
                        mapType: "china",
                        data: this.data,
                        label: {
                            normal: {
                                show: true, //省份名称
                            },
                            emphasis: {
                                show: true,
                            },
                        }
                    },
                ],
            };
            this.chinachart.setOption(optionMap);
            setTimeout(() => {
                this.mapLoading = false;
            }, 500);
        },
        randomData() {
            return Math.round(Math.random() * 1000);
        },
        getIpAdress() {
            getIpAdress().then(res => {
                this.data = res;
                this.drawLine();
            })
        }
    },
    components: {
        'yp-navbar':header,
    }
}
</script>
