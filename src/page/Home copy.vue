<template>
  <el-container>
    <header style="height: 53px" class="header">
      <Header></Header>
    </header>
    <el-container id="container">
      <div id="container_left">
        <el-menu
          :collapse="isCollapse"
          :unique-opened="true"
          class="el-menu-vertical-demo"
        >
          <el-menu-item class="tab">
            <div class="sidebar-toggler" @click="collapse">
              <i
                :class="[
                  isCollapse ? 'el-icon-arrow-right' : 'el-icon-arrow-left',
                ]"
              ></i>
            </div>
          </el-menu-item>
          <navMenu :menu.sync="data"></navMenu>
        </el-menu>
      </div>
      <div class="main" id="container_right">
        <router-view
          name="childRoute"
          class="main_box"
          :key="$route.fullPath"
        />
        <div style="color: #999ba2" class="footer">
          <span>2016-2018 © 成都骊彰科技有限公司</span>
        </div>
      </div>
    </el-container>
  </el-container>
</template>

<script>
import api from "../api/index.js";
import SockJS from "sockjs-client";
import Stomp from "stompjs";
import navMenu from "./layout/Menu";
import Header from "./layout/Header";
import { mapState } from "vuex";

export default {
  name: "Home",
  components: { navMenu, Header },
  data() {
    return {
      screenWidth: "",
      screenHeight: "",
      isCollapse: false,
      data: [],
    };
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    boxCollapse(_this) {
      let oBoxR = document.querySelector("#container_right");
      let oBoxL = document.querySelector("#container_left");
      if (_this.isCollapse) {
        oBoxL.classList.add("active");
        oBoxR.classList.add("active");
        oBoxL.style.transition = "all ease .43s";
        oBoxR.style.transition = "all ease .43s";
      } else {
        oBoxL.classList.remove("active");
        oBoxR.classList.remove("active");
      }
    },
    collapse() {
      this.isCollapse = !this.isCollapse;
      this.boxCollapse(this);
    },
    toggle() {
      this.isCollapse = !this.isCollapse;
    },
    findSame: function (arr, value) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i] == value) {
          return true;
        }
      }
      return false;
    },
    hasPermission: function (arr) {
      for (let i = 0; i < arr.length; i++) {
        if (!this.findSame(this.$store.state.moduleLogin.role, arr[i])) {
          return false;
        }
      }
      return true;
    },
    initWebSocket() {
      this.connection();
      let that = this;
      // 断开重连机制,尝试发送消息,捕获异常发生时重连
      this.timer = setInterval(() => {
        try {
          that.stompClient.send("test");
        } catch (err) {
          console.log("断线了: " + err);
          that.connection();
        }
      }, 5000);
    },
    connection() {
      //
      // 建立连接对象
      let socket = new SockJS(`/socket?userId=${this.userObj.id}`);
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(socket);
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: "",
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(
        headers,
        () => {
          this.stompClient.subscribe(
            "/topic/public",
            (msg) => {
              // 订阅服务端提供的某个topic

              console.log(msg); // msg.body存放的是服务端发送给我们的信息
            },
            headers
          );

          this.stompClient.subscribe("/user/queue/notify", (response) => {
            console.log(JSON.parse(response.body));
          });
        },
        (err) => {
          // 连接发生错误时的处理函数
          console.log("失败",err);
        }
      );
    }, //连接 后台
    disconnect() {
      if (this.stompClient) {
        this.stompClient.disconnect();
      }
    },
  },
  mounted() {
    let _that = this;
    let arr = [];
    let storageMenus = JSON.parse(sessionStorage.getItem("userMenus"));
    if (storageMenus) {
      for (let each of storageMenus) {
        _that.data.push(each);
      }
    } else {
      this.$get(api.menu + "/tree")
        .then((res) => {
          arr = res.data[0].children.sort((n, m) => n.sort - m.sort);
          for (let e of arr) {
            _that.data.push(e);
          }
          sessionStorage.setItem("userMenus", JSON.stringify(_that.data));
        })
        .catch((err) => {
          console.log(err);
        });
    }

    console.log(this.$store.state);
    //documentElement
    this.screenHeight = document.documentElement.clientHeight;
    var headerH = document.querySelector(".header").offsetHeight;
    document.querySelector("#container").style.height =
      this.screenHeight - headerH + "px";
    document.querySelector(".main_box").style.minHeight =
      this.screenHeight - headerH - 40 + "px";
    this.screenWidth = document.body.clientWidth;
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    this.initWebSocket();
  },
  watch: {
    screenWidth: {
      handler(val) {
        this.screenWidth = val;
        var that = this;
        setTimeout(function () {
          if (that.screenWidth <= 1200) {
            that.isCollapse = true;
          } else {
            that.isCollapse = false;
          }
          that.boxCollapse(that);
        }, 400);
      },
      immediate: true,
    },
    $route(to, from) {
      this.$nextTick(() => {
        this.screenHeight = document.documentElement.clientHeight;
        var headerH = document.querySelector(".header").offsetHeight;
        document.querySelector(".main_box").style.minHeight =
          this.screenHeight - headerH - 40 + "px";
      });
    },
    msg: function (newVal, oldVal) {
      alert(this.msg);
    },
  },
  computed: {
    ...mapState("login", {
      userObj: "userObj",
    }),
  },
};
</script>

<style scoped lang="less">
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  min-height: 400px;
}

.sidebar-toggler {
  border-radius: 4px;
  cursor: pointer;
  display: block;
  float: right;
  margin: 0;
  border: 0;
  margin: 8px 0;
  width: 24px;
  height: 24px;
  margin-right: -1px;
  /*background-color: #409eff;*/
  background-color: #428bca;
  line-height: 24px;
}

.sidebar-toggler i {
  color: #fff !important;
}

/* 选中状态 */
.is-active > a {
  color: #409eff !important;
}

a {
  text-decoration: none;
  color: #333;
}

.tab {
  height: 40px !important;
  color: #242527 !important;
}

/* 8-19 新加 */
/* 缩放 */
.main {
  overflow-x: hidden;
  position: relative;
  padding: 10px 10px 0;
  box-sizing: border-box;
  background: #fafafa;
}

#container {
  margin-top: 53px;
  width: 100%;
  overflow: hidden;
}

#container_right {
  overflow: hidden;
  float: left;
  box-sizing: border-box;
}

#container_left {
  /*float: left; !*10.11修改*!*/

  width: 200px;
  border-right: solid 1px #e6e6e6;
  /*overflow-y: scroll;*/
  overflow-x: hidden;
}

#container_right {
  width: calc(100% - 200px);
  overflow-y: scroll;
}

#container_left.active {
  width: 64px;
}

#container_right.active {
  width: calc(100% - 64px);
}

.main_box {
  background: #fff;
  padding: 10px;
  border: solid 1px #e6e6e6;
  box-sizing: border-box;
}

.footer {
  width: 100%;
  height: 30px !important;
  line-height: 30px;
  text-align: center;
  background-color: rgb(51, 51, 51);
}

.clearfix::after {
  content: "";
  display: block;
  clear: both;
}
</style>
