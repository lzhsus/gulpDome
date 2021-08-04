<template>
    <div>
        <canvas></canvas>
    </div>
</template>

<script>
import { getHaibao } from '../../servers/haibao'
	import flash from "../../flash/config";
export default {
    data(){
        return{
            a:11111
        }
    },
    methods:{
        getHaibaoFunc(){
            var data={
				nickname:"2018",
				main_url:"http://190202fg0371demo.jdytoy.com/html/campaign/newYear/static/images/haibao/haibao-img-1.png",
				head:"http://190202fg0371demo.jdytoy.com/html/campaign/newYear/static/images/haibao/creat_haibao-bg-2.png?v=100",
				qr_code:"http://190202fg0371demo.jdytoy.com/html/campaign/newYear/static/images/haibao/creat_haibao-bg-2.png?v=100",
				haibao_bg:"http://190202fg0371demo.jdytoy.com/html/campaign/newYear/static/images/haibao/creat_haibao-bg-2.png?v=100"
			}
			var element = $('#haibaoCanvas')[0];
			console.log('--------',element)
			data.element =  $('#haibaoCanvas')[0];
			
			var img = getHaibao(data,res=>{
                console.log(res)
            })
        }
    },
    mounted(){
        // this.getHaibaoFunc()
        flash()
    }
} 
</script>

<style lang="less" scoped>

    
</style>

