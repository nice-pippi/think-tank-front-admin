<template>
  <div class="dashboard-container">
    <div class="main_div">
      <div style="width: 68%;">
        <el-card class="statistic_card">
          <h3 style="display: flex;align-items: center;justify-content: center;">
            <span>用户概况 </span>
            <img src="../../assets/statistic.png" style="width: 25px;">
          </h3>
          <el-row :gutter="20">
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="userStatistic.userCount" title="用户总数 👨‍💼"></el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="userStatistic.newUserCount"
                  :title="userStatistic.newUserCount > 0 ? '新用户数 ➕' : '新用户数 ➖'">
                </el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <div>
                <el-statistic group-separator="," :value="userStatistic.onlineCount" title="在线人数 ✨"></el-statistic>
              </div>
            </el-col>
            <el-col :span="6">
              <el-statistic title="男女比例 👫">
                <template slot="formatter">
                  {{ userStatistic.sexRatio }}
                </template>
              </el-statistic>
            </el-col>
          </el-row>
        </el-card>
        <h3>待处理记录</h3>
        <div class="todo_flex">

          <el-card shadow="hover">
            <div class="todo_item" @click="$router.push('/application/block')">
              <img src="../../assets/todo_block.png" class="todo_icon">
              <div>
                <div style="font-size: small;">板块申请</div>
                <div class="todo_number">{{ todoStatistic.blockApplyCount }}</div>
              </div>
            </div>
          </el-card>

          <span @click="$router.push('/application/master')">
            <el-card shadow="hover">
              <div class="todo_item">
                <img src="../../assets/todo_master.png" class="todo_icon">
                <div>
                  <div style="font-size: small;">板主申请</div>
                  <div class="todo_number">{{ todoStatistic.masterApplyCount }}</div>
                </div>
              </div>
            </el-card>
          </span>
          <span @click="$router.push('/report/post')">
            <el-card shadow="hover">
              <div class="todo_item">
                <img src="../../assets/todo_post.png" class="todo_icon">
                <div>
                  <div style="font-size: small;">帖子举报</div>
                  <div class="todo_number">{{ todoStatistic.reportPostCount }}</div>
                </div>
              </div>
            </el-card>
          </span>
          <span @click="$router.push('/report/comment')">
            <el-card shadow="hover">
              <div class="todo_item">
                <img src="../../assets/todo_comment.png" class="todo_icon">
                <div>
                  <div style="font-size: small;">评论举报</div>
                  <div class="todo_number">{{ todoStatistic.reportCommentCount }}</div>
                </div>
              </div>
            </el-card>
          </span>
        </div>
        <div id="login_count_chart"></div>
      </div>
      <el-card class="menu_card">
        <h3>常用功能</h3>
        <div class="card_flex">
          <span @click="$router.push('/manage/blockclassify')">
            <el-card shadow="hover" class="menu_item">
              <img src="../../assets/block_classify.png" class="icon_diy">
              <div class="menu_name">板块分类</div>
            </el-card>
          </span>
          <span @click="$router.push('/manage/block')">
            <el-card shadow="hover" class="menu_item">
              <img src="../../assets/block_manage.png" class="icon_diy">
              <div class="menu_name">板块管理</div>
            </el-card>
          </span>
          <span @click="$router.push('/manage/post')">
            <el-card shadow="hover" class="menu_item">
              <img src="../../assets/post_manage.png" class="icon_diy">
              <div class="menu_name">帖子管理</div>
            </el-card>
          </span>
          <span @click="$router.push('/manage/master')">
            <el-card shadow="hover" class="menu_item">
              <img src="../../assets/master_manage.png" class="icon_diy">
              <div class="menu_name">板主管理</div>
            </el-card>
          </span>
          <span @click="$router.push('/manage/user')">
            <el-card shadow="hover" class="menu_item">
              <img src="../../assets/report_manage.png" class="icon_diy">
              <div class="menu_name">举报管理</div>
            </el-card>
          </span>
        </div>
      </el-card>
    </div>

  </div>
</template>

<script>
// import * as echarts from 'echarts';
import {
  getUserStatistic,
  getUserLoginCountBySevenDay,
  getTodoBlockApplyCount,
  getTodoMasterApplyCount,
  getTodoReportPostCount,
  getTodoReportCommentCount
} from "@/api/analysis";
var echarts = require('echarts')

export default {
  data() {
    return {
      userStatistic: {
        userCount: 0,
        newUserCount: '0',
        onlineCount: 0,
        sexRatio: '0/0'
      },
      todoStatistic: {
        blockApplyCount: 0,
        masterApplyCount: 0,
        reportPostCount: 0,
        reportCommentCount: 0,
      }

    };
  },
  methods: {
    getUserStatisticByIndex() {
      getUserStatistic().then(response => {
        this.userStatistic.userCount = response.data.userCount
        this.userStatistic.newUserCount = response.data.newUserCount
        this.userStatistic.onlineCount = response.data.onlineCount
        this.userStatistic.sexRatio = response.data.sexRatio
      })
    },
    async getUserLoginCountBySevenDayByIndex() {
      try {
        const response = await getUserLoginCountBySevenDay()
        const data = response.data
        this.chart = echarts.init(document.getElementById('login_count_chart'));
        this.chart.setOption({
          title: {
            text: '近7天内每日用户登录情况',
            left: 'center'
          },
          tooltip: {},
          xAxis: {
            type: 'category',
            data: data.map(item => item.loginDate),
          },
          yAxis: {},
          series: [{
            name: '登录人次',
            type: 'line',
            smooth: true,
            data: data.map(item => item.userCount),
          }]
        })
      } catch (error) {
        console.log(error);
      }
    },
    getTodoBlockApplyCountByIndex() {
      getTodoBlockApplyCount().then(response => {
        this.todoStatistic.blockApplyCount = response.data
      })
    },
    getTodoMasterApplyCountByIndex() {
      getTodoMasterApplyCount().then(response => {
        this.todoStatistic.masterApplyCount = response.data
      })
    },
    getTodoReportPostCountByIndex() {
      getTodoReportPostCount().then(response => {
        this.todoStatistic.reportPostCount = response.data
      })
    },
    getTodoReportCommentCountByIndex() {
      getTodoReportCommentCount().then(response => {
        this.todoStatistic.reportCommentCount = response.data
      })
    }

  },
  mounted() {
    this.getUserStatisticByIndex()
    this.getUserLoginCountBySevenDayByIndex();
    this.getTodoBlockApplyCountByIndex()
    this.getTodoMasterApplyCountByIndex()
    this.getTodoReportPostCountByIndex()
    this.getTodoReportCommentCountByIndex()
  }
}
</script>

<style lang="scss" scoped>
h3 {
  margin-top: 0;
}

.like {
  cursor: pointer;
  font-size: 25px;
  display: inline-block;
}

.main_div {
  display: flex;
  justify-content: space-between;
  margin: 20px;

  .statistic_card {
    width: 100%;
    padding: 5px 10px 20px 10px;
    margin-bottom: 20px;
    text-align: center;
  }

  .todo_flex {
    width: 100%;
    display: flex;
    justify-content: space-between;

    .todo_item {
      width: 160px;
      display: flex;
      align-items: center;
      justify-content: space-between;

      .todo_icon {
        width: 40px;
        height: 40px;
      }

      .todo_number {
        margin-top: 15px;
        font-weight: bold;
        font-size: larger;
      }
    }
  }

  #login_count_chart {
    width: 100%;
    height: 310px;
    margin-top: 40px;
  }

  .menu_card {
    width: 30%;
    height: 80vh;

    .card_flex {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;

      &::after {
        content: '';
        width: 105px;
      }

      .menu_item {
        width: 105px;
        height: 105px;
        text-align: center;
        margin-bottom: 10px;

        .menu_name {
          font-size: smaller;
          margin-top: 10px;
        }

        .icon_diy {
          width: 40px;
        }
      }
    }

  }
}
</style>
