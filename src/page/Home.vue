<template>
  <el-container style="height: auto">
    <el-aside width="200px" v-if="!isMobile">
      <el-menu
        :collapse="isCollapse"
        :unique-opened="true"
        class="el-menu-vertical-demo"
      >
        <div class="menu-header">
          <el-menu-item>
            <img
              style="width: 20px; height: 20px; margin-top: 18px"
              src="../assets/image/img_page@2x.png"
              v-show="isCollapse"
            />
            <span class="sample-name" v-show="!isCollapse">{{
              sampleName
            }}</span>
            <!--<p class="system-name" v-show="!isCollapse">司法鉴定管理系统</p>-->
          </el-menu-item>
        </div>
        <navMenu :menu.sync="data"></navMenu>
      </el-menu>
    </el-aside>

    <el-container class="container_right">
      <!-- 音频 -->
      <audio style="display: none" id="chatAudio" :src="mp3Url" />
      <el-header height="54px">
        <Header
          @collapse="collapse"
          @openMenu="openMenu"
          @mobile="mobile"
        ></Header>
      </el-header>

      <el-main>
        <!--水平方向的菜单-->
        <el-menu
          v-if="isOpen && isCollapse"
          :collapse="false"
          :unique-opened="true"
          style="z-index: 99999999999"
        >
          <navMenu :menu.sync="data"></navMenu>
        </el-menu>
        <router-view
          name="childRoute"
          class="main_box"
          :key="$route.fullPath"
        />
      </el-main>
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
      screenHeight: "",
      isCollapse: false,
      data: [],
      socketData: null,
      mp3Url: require("./../assets/demo1.mp3"),
      sampleName: "",
      isOpen: false,
      isMobile: false,
    };
  },
  provide() {
    return {
      hasPermission: this.hasPermission,
    };
  },
  beforeDestroy: function () {
    // 页面离开时断开连接,清除定时器
    this.disconnect();
    clearInterval(this.timer);
  },
  methods: {
    collapse: function (isCollapse) {
      this.isCollapse = isCollapse;
    },
    openMenu(isOpen) {
      this.isOpen = isOpen;
    },
    mobile(isMobile) {
      this.isMobile = isMobile;
    },
    hasPermission: function (permission) {
      if (permission == "auth:case:recover") {
        // return false;
      }
      if (
        this.$store.state.login.userObj.permissions &&
        this.$store.state.login.userObj.permissions.length > 0
      ) {
        var arr = this.$store.state.login.userObj.permissions;
        // console.log("arr", arr);
        if (arr.indexOf(permission) != -1) {
          return true;
        }
      }
      return false;
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
      // 建立连接对象
      if (!this.socketData) {
        this.socketData = new SockJS(`/socket?userId=${this.userObj.id}`);
      }
      // 获取STOMP子协议的客户端对象
      this.stompClient = Stomp.over(this.socketData);
      // 定义客户端的认证信息,按需求配置
      let headers = {
        Authorization: "",
      };
      // 向服务器发起websocket连接
      this.stompClient.connect(
        {},
        (frame) => {
          this.stompClient.subscribe(
            "/topic/public",
            (msg) => {
              // 订阅服务端提供的某个topic
              let { title = "弹出的消息", link } = msg.body;
              window.localStorage.getItem("isSound") == "true"
                ? document.querySelector("#chatAudio").play()
                : null;
              //message可以写html
              this.$notify({
                title: "消息",
                message: link
                  ? `<a href="${link}" class="normalA" target="_blank">${title}</a>`
                  : title,
                dangerouslyUseHTMLString: true,
                position: "bottom-right",
              });
            },
            headers
          );

          this.stompClient.subscribe("/user/queue/notify", (response) => {
            var msg = JSON.parse(response.body);
            var title = msg.title;
            var link = msg.link;
            this.$notify.info({
              title: "最新消息",
              message: link
                ? `<a href="${link}" class="normalA" target="_blank">${title}</a>`
                : title,
              dangerouslyUseHTMLString: true,
              position: "bottom-right",
            });
          });
        },
        (err) => {
          // 连接发生错误时的处理函数
          console.log("失败");
          console.log(err);
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
    //获取机构简称
    this.$get(api.org + "/" + this.userObj.orgId).then((res) => {
      this.sampleName = res.data.sampleName;
    });

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
    this.screenHeight = document.documentElement.clientHeight;
    var headerH = document.querySelector(".el-header").offsetHeight;
    document.querySelector(".el-aside").style.height = this.screenHeight + "px";
    document.querySelector(".el-main").style.height =
      this.screenHeight - headerH + "px";
    this.initWebSocket();
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
.menu-header /deep/ .el-menu-item {
  line-height: normal;
  text-align: center;
}
.sample-name {
  display: inline-block;
  font-size: 18px;
  font-weight: 400;
  line-height: 56px;
  text-align: center;
  /*margin: 8px 2px 5px 5px;*/
  color: #324a90;
}
.system-name {
  font-size: 14px;
  font-weight: 400;
  height: 15px;
  text-align: center;
  /*margin: 10px 2px 10px 5px;*/
  color: #333;
}

.el-aside {
  border-right: solid 1px #e6e6e6;
  overflow-x: hidden;
  background-color: #fff;

  ul {
    margin-bottom: 20px;
    background-color: #fff;
  }
}

.container_right {
  background-color: #f1f1f1;
  width: calc(100% - 200px);
}

.el-aside.active {
  width: 64px !important;
}

.container_right.active {
  width: calc(100% - 64px);
}

main {
  // margin: 10px !important;
  padding: 10px;
  box-sizing: border-box;
}

//白色背景
main .noneBG {
  border: none;
  background: none;
  padding: 0;
}

main > div {
  border: 1px solid #e5e5e5;
  background: #fff;
  padding: 10px;
}

.el-header {
  background-color: #fff;
  border-bottom: #eee;
  height: 53px;
  border-bottom: 1px solid #eee;
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
