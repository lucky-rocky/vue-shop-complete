<template>
  <div>
    <!-- 头部导航 -->
    <el-header class="goods_header">
      <el-breadcrumb separator="/">
        <el-breadcrumb-item :to="{ path: '/home' }" class="el-breadcrumb-item">首页</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">数据统计</el-breadcrumb-item>
        <el-breadcrumb-item class="el-breadcrumb-item">数据报表</el-breadcrumb-item>
      </el-breadcrumb>
    </el-header>
    <el-card>
      <div id="charts" style="width:750px;height:400px">图标</div>
    </el-card>
  </div>
</template>

<script>
import echarts from 'echarts'
export default {
  data() {
    return {
      // 官方实例配置
      // 需要合并的数据
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  methods: {
    async getData() {
      const res = await this.$axios.get('reports/type/1')
      console.log(res)
      if (res.meta.status !== 200) {
        return this.$message.error(res.meta.msg)
      }
      this.$message.success(res.meta.msg)
      // 合并对象,得到大量配置
      const option = Object.assign(this.options, res.data)
      // 实例化对象
      const myEcharts = echarts.init(document.getElementById('charts'))
      // 设置
      myEcharts.setOption(option)
    }
  },
  created() {
    this.getData()
  }
}
</script>

<style>
</style>
