<template>
  <div class="headerT">
    <div @click="toggle" class="sidebar-toggler" v-if="!isMobile">
      <icon name="caidan11" type="class" />
    </div>
    <div @click="isOpen = !isOpen" class="sidebar-toggler" v-if="isMobile">
      <icon name="caidan11" type="class" />
    </div>
    <div class="page-logo">
      <div v-show="!isMobile">
        <span class="header-title" >{{headerTitle}}</span>
      </div>
    </div>
    <div class="messageBlock" v-if="scrollList.length > 0 && !isMobile">
      <icon name="xiaoxi" type="class" class="messageIcon" />
      <div ref="scrollobj" class="scrollobj">
        <span>
          <span v-for="(item,index) in scrollList" :key="index">{{item.title }}&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span>
        </span>
      </div>
    </div>
    <div class="dropdown-right">
      <el-dropdown>
        <div class="el-dropdown-link">
          <img :src="headPortrait" class="head-portrait" />
          <span class="user-msg">{{user}}</span>
          <i class="el-icon-arrow-down"></i>
        </div>
        <el-dropdown-menu slot="dropdown" class="dropdown-menu">
          <router-link to="/myCenter/MyInfoForm">
            <el-dropdown-item class="dropdown-item">
              <i class="el-icon-user"></i>我的信息
            </el-dropdown-item>
          </router-link>
          <el-dropdown-item class="dropdown-item" @click.native="logout()">
            <icon name="dengchutuichuguanbi" type="class"></icon>退出
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>
    </div>
    <!--<el-divider direction="vertical" class="divider1"></el-divider>-->
    <div class="btn-left register" v-if="hasPermission('auth:register')">
      <router-link to="/case/register">
        <icon name="bianji" type="class"></icon>
      </router-link>
    </div>
    <!--<el-divider direction="vertical" class="divider2"></el-divider>-->
    <div class="btn-left accept" v-if="hasPermission('auth:acceptance')">
      <router-link to="/case/acceptcase">
        <icon name="accept" type="class"></icon>
      </router-link>
    </div>

    <!--<el-divider direction="vertical" class="divider2"></el-divider>-->
    <el-select size="small" v-if=" !myOrgId || myOrgId == ''" style="float:right;" v-model="orgsValue" placeholder="请选择机构" class="marginTop11">
      <el-option
          v-for="item in orgs"
          :key="item.id"
          :label="item.name"
          :value="item.id"
        />
    </el-select>
  </div>
</template>

<script>
  import api from "../../api/index.js";
  import {mapActions, mapState} from "vuex";
  import login from "../../api/modules/login";

  export default {
  name: "",
  data() {
    return {
      title: "司法鉴定中心司法鉴定管理系统",
      user: "admin",
      isCollapse: false,
      screenWidth: "",
      headPortrait: require("./../../assets/image/cegoMdQV8CJCY.jpg"),
      orgs:[],
      orgsValue:"",
      myOrgId:'',
      timer:null,
      scrollList:[],
      isMobile: false,
      isOpen: false

    };
  },
  inject: ['hasPermission'],
  methods: {
    ...mapActions("login",{orgIdChange:"orgIdChange"}),
    logout() {
      sessionStorage.setItem("userMenus", null);
      this.$post(api.logout)
        .then(res => {
          if (res.status == 200) {
            window.localStorage.removeItem("token");
            this.$message({
              message: "退出登录成功！",
              type: "success"
            });
            window.sessionStorage.setItem("exit", true);
            this.$store.dispatch("login/loginChange", false).then(() => {
              this.$router.push({ path: "/login" });
            });
          }
        })
        .catch(err => {
          console.log("err",err);
          this.$message.error(err.errMsg);
        });
    },
    boxCollapse(_this) {
      let oBoxR = document.querySelector(".container_right");
      let oBoxL = document.querySelector(".el-aside");
      if (_this.isCollapse) {
        oBoxL && oBoxL.classList.add("active");
        oBoxR && oBoxR.classList.add("active");
        oBoxL && (oBoxL.style.transition = "all ease .43s");
        oBoxL && (oBoxR.style.transition = "all ease .43s");
      } else {
        oBoxL && oBoxL.classList.remove("active");
        oBoxR && oBoxR.classList.remove("active");
      }
    },
    collapse(isCollapse) {
      this.isCollapse = isCollapse;
      //发送给Home.Vue
      this.$emit("collapse", this.isCollapse);
      this.boxCollapse(this);
    },
    toggle() {
      this.collapse(!this.isCollapse);
    },
    _scroll(obj) {
      if(obj) {
        let tmp = obj.scrollLeft++;
        //当滚动条到达右边顶端时
        if (obj.scrollLeft == tmp) {
          obj.innerHTML += obj.innerHTML;
        }
        //当滚动条滚动了初始内容的宽度时滚动条回到最左端
        if (obj.scrollLeft >= obj.firstChild.offsetWidth) {
          obj.scrollLeft = 0;
        }
      }
    },
    _start() {
     /* setTimeout( () => {
        this.timer = setInterval(() => {
        this._scroll(this.$refs.scrollobj)
      },20)
      },0)*/
      this.timer = setInterval(() => {
        this._scroll(this.$refs.scrollobj)
      },20)
    },
    _stop() {
      if (this.timer != null) {
        clearInterval(this.timer)
      }
    },
    setOrgIdSession(orgId) {

      if (orgId == undefined) {
        orgId = '';
      }
      this.$get(api.org + "/setOrgId?orgId=" + orgId).then(res => {
        // this.$get(api.poisonCategory)
        //         .then(res => {
        //           this.poisonCategoryOpt = res.data;
        //         })
        //         .catch(err => console.log(err));
        // //费用类型
        // this.$get(api.chargingType).then((res) => {
        //   this.chargeTypeData = JSON.parse(JSON.stringify(res.data));
        //   console.log(this.chargeTypeData, "收费类型数据");
        // })
        this.orgIdChange(orgId)
      }).catch(err => {
        console.log('err',err)
      })
    }
  },
  created() {
    this.$get(api.myInfo).then(res => {
      var data = JSON.parse(JSON.stringify(res.data));
      this.user = data.hrStaff == undefined ? "" : data.hrStaff.name;
      this.myOrgId = data.orgId;
      // console.log(this.myOrgId,'myOrgIdmyOrgId')
      data.userAvatar ? (this.headPortrait = data.userAvatar.url) : null;

      if(!this.myOrgId) {
        this.$get(api.org + "/list").then(res => {
          res.data ? (this.orgs = res.data) : null;
          this.orgsValue = this.myOrgId;

          if(this.orgs && this.orgs.length>0){
            this.orgsValue = this.orgs[0].id;
          }
        }).catch(err => console.log(err));
      }
    });


  },
  watch: {
    screenWidth: {
      handler(val) {
        this.screenWidth = val;
        var that = this;
        setTimeout(function() {
          if (that.screenWidth <= 1200) {
            that.collapse(true);
          } else {
            that.collapse(false);
          }
          if(that.screenWidth <= 768) {
            that.isMobile = true;
            that.$emit('mobile', true)
            that.$store.dispatch("login/handleChangeMobile", true)
          } else {
            that.isMobile = false;
            that.$emit('mobile', false)
            that.$store.dispatch("login/handleChangeMobile", false)
          }
        }, 400);
      },
      immediate: true
    },
    isOpen(newVal,oldVal) {
      this.$emit('openMenu', newVal)
    },
    orgsValue(newVal,oldVal){
      this.setOrgIdSession(newVal)

    }
  },
  mounted() {
    this.screenWidth = document.body.clientWidth;
    const that = this;
    window.onresize = () => {
      return (() => {
        window.screenWidth = document.body.clientWidth;
        that.screenWidth = window.screenWidth;
      })();
    };
    //消息滚动
    let msgTypes = 'INSTRUMENT_CALIBRATOR,CUSTOM'
      this.$get(api.scrollMessage+'/list/'+msgTypes).then(res => {
        this.scrollList = res.data.list;
        if(this.scrollList.length > 0) {
          this.$nextTick(() => {
            let scroll = this.$refs.scrollobj;
            this._start();
            scroll.addEventListener("mouseover",this._stop,false);
            scroll.addEventListener("mouseout",this._start,false);
          })
        }
      });
  },
  computed: {
    ...mapState("login", ["headerTitle","orgId"])
  }
};
</script>

<style lang="less" scoped>
.headerT {
  height: 53px;
  width: 100%;
  background-color: #fff;
  color: #000 !important;
  z-index: 99;
}

.sidebar-toggler {
  float: left;
  height: 53px;
  line-height: 53px;
  cursor: pointer;
}

.page-logo {
  /*width: 400px;*/
  margin-left: 10px;
  float: left;

  img {
    height: 45px;
    width: 45px;
    /*margin-top: 4px;*/
    vertical-align: middle;
    line-height: 53px;
  }

  div {
    padding: 0px;
    height: 53px;
    font-size: 18px;
    line-height: 53px;
  }
}

.header-title {
  margin-left: 10px;
  line-height: 53px;
}

.el-dropdown {
  .el-dropdown-link {
    height: 53px;
    display: flex;
    justify-content: center;
    align-items: center;

    .head-portrait {
      height: 35px;
      width: 35px;
      margin: 4px 0;
      border-radius: 50%;
      vertical-align: middle;
    }

    color: #000;

    .user-msg {
      padding-left: 10px;
      padding-right: 5px;
    }
  }
}

.dropdown-left {
  border-left: 1px solid #484a4f;
  border-right: 1px solid #484a4f;
  text-align: center;
  width: 60px;
  float: right;
  margin-right: 10px;
}

.dropdown-right {
  text-align: center;
  float: right;
  margin-right: 20px;
}

.dropdown-icon {
  font-size: 18px;
  line-height: 53px;
  color: #999ba2;
}

.router-link-active {
  text-decoration: none;
}

a {
  text-decoration: none;
}

.btn-left {
  text-align: center;
  float: right;
}
.accept .iconfont {
  /*color: #6499ff;*/
  font-size: 27px;
  vertical-align: middle;
  line-height: 53px;
  position: relative;
  top: 1px;
  margin-right:20px;
  color:#324A90;
}
.register .iconfont {
  font-size: 35px;
  vertical-align: middle;
  line-height: 53px;
  /*fill: currentColor;*/
  position: relative;
  top: 1px;
  margin-right:10px;
  color:#324A90;
}
.el-divider--vertical {
  float: right;
  height: 49px;
  position: relative;
  top: 2px;
}
.divider1 {
  margin-right: 26px;
  margin-left: 26px;
}
.divider2 {
  margin-right: 26px;
  margin-left: 26px;
}
.marginTop11{
  margin-top: 11px;
}
.messageBlock {
  position:absolute;
  top: 0;
  display: flex;
  height:53px;
  line-height:53px;
  left: 50%;
  transform: translate(-50%,0);

}
.messageBlock .messageIcon {
  margin-right:5px;
  color:#324A90;

}
.messageBlock .scrollobj {
  font-size:16px;
  display:inline-block;
  white-space: nowrap;
  overflow: hidden;
  width: 500px;
  color:#324A90;

}
</style>