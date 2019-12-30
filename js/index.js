//index.html的js，根据情况不同里边逻辑不同，这里仅供参考

(function () {
    var Tost = Fanli.Utility.Toast;
    var getProAjax = "";//搜索商品的接口
    var $win = $(window);
    var $document = $(document);

    var app = new Vue({
        el: "#J_app",
        data: {
            productList: [//搜索结果列表商品的接口实例
                {
                    title:"jkfnsjafls山东济南罚款就是纽芬兰省",
                    pic_url: "//l2.51fanli.net/ocp/?u=http%3A%2F%2Fakmer.aikucun.com%2Fmerchant-platform%2F8d38bc041e69425893040ed6c808e61c8d1b3788_1575014226071_41.jpg&s=350x350",
                    item_url: "",
                    price: "334",
                    seckill_price: "33.5",
                }
            ],
            tabType: "zhonghe",
            loaddingShow: false,
            hotList: [],
            keyWord: "",
            pageNum: 1,
            proSort: "",
            isGet: false,
            searchSpm: {
                "history_btn": "page_name.h5.pty-lsword~std-66570",
                "search_btn": "page_name.h5.pty-searchdj~std-66570",
                "del_history": "page_name.h5.pty-delandj~std-66570",
                "search_all": "page_name.h5.pty-searchall~std-66570",
            }
        },
        computed: {

        },
        methods: {
            getProduct: function () {
                var that = this;
                if (this.isGet == true) {
                    return;
                }
                this.isGet = false;
                $.getJSON(getProAjax, {keywords:that.keyWord ,p:that.pageNum, sort:that.proSort}, function(res){
                    if(res.status == 1){
                        that.productList = this.pageNum > 1 ? that.productList.concat(res.data) : res.data;
                        that.loaddingShow = false;
                        that.pageNum++
                    }else{
                        Tost.open(res.info);
                    }
                    that.isGet = false;
                })
            },

            search: function (kw) {
                this.loaddingShow = true;
                this.pageNum = 1;
                this.keyWord = kw;
                this.getProduct();
            },

            tabClick: function (type) {
                if (type == "zhonghe") {
                    this.proSort = "";
                    if (this.tabType == "zhonghe") { return };
                }
                if (type == "jiage") {
                    this.proSort = (this.tabType == "zhonghe" || (this.tabType == "jiage" && this.proSort == "as_price")) ? "ds_price" : "as_price";
                }
                this.pageNum = 1;
                this.tabType = type;

                this.getProduct();
            },

            pageScroll: function () {
                var that = this;
                $win.on("scroll.PAGE", function () {
                    var scrollTop = $win.scrollTop();
                    if (scrollTop + $win.height() >= $document.height() - $win.height() * 2) {
                        that.getProduct();
                    }
                })
            }
        },

        mounted: function () {
            this.pageScroll();
        }

    })


})()
