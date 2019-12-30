//单个商品组件，仅供参考

(function () {
    tpl = '<div class="product-item">'+
    '                            <a href="javascript:void(0)" class="product-item-hover" @click="goDetail">'+
    '                            </a>'+
    '                            <div class="img-wrapper ">'+
    '                                <img class="lazy" src="//static2.51fanli.net/common/images/loading/spacer.png" :data-original="item.pic_url" alt="" data-expo="">'+
    '                            </div>'+
    '                            <div class="info">'+
    '                                <h3 class="title">{{item.title}}</h3>'+
    '                                <p class="clear-price">清仓价'+
    '                                    <span class="i-money bold">￥</span>'+
    '                                    <span class="price-num bold">{{priceArr[0]}}</span><i v-if="priceArr[1]">.</i><span v-if="priceArr[1]" class="decimal bold">{{priceArr[1] || ""}}</span>'+
    '                                </p>'+
    '                                <div class="price-original">'+
    '                                    <span class="price-info">参考价 <del>¥{{item.price}}</del></span>'+
    '                                    <p class="item-discount">{{discount}}折</p>'+
    '                                </div>'+
    '                            </div>'+
    '                       </div>';
    


    Vue.component('product-item', {
        props: ['item'],
        template: tpl,
        data: function() {
            return {
            }
        },
        computed: {
            priceArr: function(){
                var arr = this.item.seckill_price.split('.');
                return arr;
            },

            discount: function(){
                var discount = (Number(this.item.seckill_price) * 10/Number(this.item.price)).toFixed(1);
                discount = discount < 0.1 ? '0.1' : discount;
                return discount;
            }
        },
        methods: {
            goDetail: function(){
                if(wagv.isFromFanli){
                    Fanli.Utility.bridgeApp('ifanli://m.51fanli.com/app/show/web?nonav=1&noback=0&url='+encodeURIComponent(this.item.item_url));
                }else{
                    window.location.href = this.item.item_url;
                }
            },

            expo: function() {
                UBT.PlugIns.Exposure.init();
            },

            lazy: function() {
                $(this.$el).find(".lazy").lazyload({ effect: "fadeIn" });
            },

        },
        mounted: function(){
            var that = this;
            Vue.nextTick(function () {
                that.lazy();
                // that.expo();//需要曝光时打开
             })
        }
    })


})()
