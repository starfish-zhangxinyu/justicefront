<template>
  <div class="page-bar">
    <ul class="page-breadcrumb clearfix">
      <li>
        <i class="fa fa-home"></i>
        <a href="">首页</a>
        <i class="fa fa-angle-right"></i>
      </li>
      <li>
        <a href="#">{{title1}}</a>
        <i class="fa fa-angle-right"></i>
      </li>
      <li>
        <a href="#">{{title2}}</a>
      </li>
    </ul>
  </div>
</template>

<script>
    export default {
        name: "PageBar",
      props:['title1','title2']
    }
</script>

<style scoped lang="less">
  .page-bar{
    border: 0;
    padding: 0px;
    background-color: #eee;
    margin-bottom: 25px;
    margin-left: -10px;
    margin-right: -10px;
    padding-left: 10px;
    padding-right: 20px;
    height: 36px;
    font-size: 14px;
    ul{
      height: 36px;
      li{
        margin-top: 8px;
        list-style: none;
        float: left;
        color: #666666;
        i{
          margin: 0 5px 0 5px;
        }
        a{
          text-decoration: none;
          color: #666666;
        }
      }
    }
  }
  .clearfix{
    display: block;
    content: '';
    clear: both;
  }
</style>
