<template>
    <div>
        index+{{a}}asdfasdffasdasdf
        <div class="img-box">

        </div>
        <div class="box-box">
            222229999999555555asdfsadfasdfadsf
            <div class="box-2">11asdfsadf11</div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return{
            a:11111
        }
    }
}
</script>

<style lang="less" scoped>

    .img-box{
        width: 500px;height: 400px;
        background: url("~@/static/images/index/index-bg.jpg") center center no-repeat;
        background-size: cover;
    }
    .box-box{
        width: 500px;height: 300px;
        border:1px solid red;
        font-size: 20px;color: #000;
        .box-2{
            width: 100%;
            text-align: center;
            font-size:12px;color: red;
        }
    }
</style>

