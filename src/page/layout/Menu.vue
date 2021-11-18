<template>
    <fragment class="navMenu">
        <template v-for="(navMenu,index) in navMenus">
            
            <el-submenu :index="navMenu.sort+navMenu.label" :key="index" v-if="navMenu.children && navMenu.children.length>0 && navMenu.isShow=='1'">
                <template slot="title">
                    <icon :name="navMenu.icon || 'null'" type="class"/>
                    <span slot="title">{{navMenu.name}}</span>
                </template>
                <el-menu-item-group>
                    <navMenu :menu.sync="navMenu.children"></navMenu>
                </el-menu-item-group>
            </el-submenu>

            <router-link :to="{path:navMenu.href}" v-if="(!navMenu.children || (navMenu.children && navMenu.children.length==0)) && navMenu.isShow=='1'" :key="index">
                <el-menu-item :index="navMenu.sort+navMenu.label" :key="index" style="height: 30px ;line-height: 30px" v-if="navMenu.name !== 'CNAS列表'|| hasPermission('auth:cnas')">
                   <icon :name="navMenu.icon || 'null'" type="class"/>
                    <span slot="title"> {{navMenu.name}}</span>

                </el-menu-item>
            </router-link>
        </template>
    </fragment>
</template>

<script>
    export default {
        name: "navMenu",
        props: ['menu'],
        data() {
            return {
                isCollapse: false,
                defaultActive: '',
                navMenus: this.menu
            };
        },
        methods: {},
        inject:['hasPermission'],
        created() {
        }
    };
</script>

<style  lang="less">
    a {
        text-decoration: none;
        color: #333;
    }

    /*body /deep/*/ .el-aside {
         background:#324A90 !important;
        /*height: auto !important;*/
     }


    /*body /deep/*/ .el-aside .el-menu{
         background:#324A90 !important;
     }
    /*body /deep/*/ .el-aside  .el-menu  .menu-header {
        background:#fff !important;
    }

    /*body /deep/*/ a  .el-menu-item {
         background:#324A90 !important;
         color:#fff;
     }
    /*body /deep/ */a  .el-menu-item i{
        color:#fff;
    }

    /*我的面板激活状态时*/
    /*body /deep/*/ a  .el-menu-item.is-active {
        background:#fff !important;
        color:#324A90;
    }
    /*body /deep/ a  .el-menu-item:hover {
        background:#fff !important;
        color:#324A90;
    }*/


     .el-submenu__title {
        height: 40px !important;
        line-height: 40px !important;
        background:#324A90;
        color:#fff !important;
        /*border-bottom: 1px solid #414247*/
    }
    /*.el-submenu /deep/*/ .el-submenu__title:hover {
        background:#fff;
        color:#324A90 !important;
    }
    /*.el-submenu /deep/*/ .el-submenu__title:hover .iconfont {
        background:#fff;
        color:#324A90 !important;
    }
    /*.el-submenu:hover {
        color:#324A90 !important;
        background:#fff !important;
    }*/
    /*外层子菜单激活时样式*/
    /*.el-submenu.is-active {
        background:#fff !important;
        color:#324A90;

    }
    .el-submenu.is-active i {
        color:#324A90;
    }*/


    /*内层子菜单未激活样式*/
    /*.el-submenu /deep/ */ .el-menu-item-group ul  {
        background:#324A90 !important;
        color:#fff;
    }
    /*.el-submenu /deep/*/ .el-menu-item-group ul  i {
        color:#fff;
    }
    /*内层子菜单激活时样式*/
    /*.el-submenu /deep/*/  .el-menu-item-group ul .is-active {
         background:#fff !important;
         color:#324A90;
     }
    /*.el-submenu /deep/*/ .el-menu-item-group ul .is-active i {
        color:#324A90;
    }
    .el-submenu__title .iconfont{
        margin-right: 6px;
        color:#fff;
    }

    .el-menu-item .iconfont{
        margin-right: 2px;
    }
</style>