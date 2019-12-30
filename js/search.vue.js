(function () {
   var Tost = Fanli.Utility.Toast;
   var ckSearch = "SEARCH_HISTORY";
   var sepChar = encodeURIComponent(",");
   var splice = Array.prototype.splice;

    tpl='<div class="search-wrap">'+
    '            <div class="search-header">'+
    '                <i class="back-icon" @click="pageBack"></i>'+
    '                <div class="search-box">'+
    '                   <form class="search-box-bg" action="javascript:void(0);" @submit.prevent="submitSearch">'+
    '                       <i class="search-icon"></i>'+
    '                       <input type="search" class="search-input" v-model.trim="keyWord" @focus="focusHandler" autofocus placeholder="搜索商品/品牌" @input="inputHandler">'+
    '                       <i class="clear-icon" @click="clearkeyWord"></i>'+
    '                   </form>'+
    '                </div>'+
    '                <a href="javascript:void(0);" class="search-btn" @click="submitSearch" :data-spm="searchSpm.search_btn || \'\'">搜索</a>'+
    '            </div>'+
    '            <div v-if="!resultshow" class="search-source">'+
    '                <div v-if="historyList.length > 0" class="source-item history-box">'+
    '                    <p class="item-title"><span class="title-text">历史搜索</span><i class="clear-icon" @click="clearHistory"></i></p>'+
    '                    <div class="history-list">'+
    '                        <a href="javascript:void(0);" v-for="item in historyList" class="history-item" @click="historySearch(item)" :data-spm="searchSpm.history_btn || \'\'">{{item}}</a>'+
    '                    </div>'+
    '                </div>'+
    '                <div v-if="hotList.length > 0" class="source-item history-box">'+
    '                    <p class="item-title"><span class="title-text">热门搜索</span></p>'+
    '                    <div class="history-list">'+
    '                        <a href="javascript:void(0);" v-for="item in hotList" class="history-item hot"  @click="historySearch(item.word)" :data-spm="searchSpm.hot_btn || \'\'">{{item.word}}</a>'+
    '                    </div>'+
    '                </div>'+
    '            </div>'+
    '            <slot :resultshow="resultshow"></slot>'+
    '        </div>';


    Vue.component('search-page', {
        props: ["hotList", "searchSpm"],//hotList为热搜词列表，需要就在父组件传列表(hotList)过来，不需要传一个空数组。
        template: tpl,
        data: function() {
            return {
                keyWord: "",
                resultshow: false,
                historyList: []
            }
        },
        methods: {
            submitSearch: function(){   //搜索逻辑
                var keyWord = this.keyWord;
                if(!keyWord){
                    Tost.open("请输入搜索内容");
                    return;
                }
                UBT.track(this.searchSpm.search_all);
                this.setSearchHistory(keyWord);
                this.resultshow = true;
                this.$emit("search", keyWord)
            },

            inputHandler: function(){  //监听input输入
                if(!this.keyWord){
                    this.resultshow = false;
                }
            },

            setSearchHistory: function(kw){ //将历史搜索放入缓存
                var searchListData = localStorage.getItem(ckSearch);
                var searchListArray = searchListData ? searchListData.split(sepChar) : []; //缓存用逗号隔开转为字符串
                var indx;
                if(!kw){return;}
                if (searchListArray.length == 0) {
                    searchListArray.push(kw);
                } else {
                    indx = $.inArray(kw, searchListArray);
                    if (indx > -1) {
                        splice.call(searchListArray, indx, 1);
                    }
                    searchListArray.unshift(kw);
                }
                splice.call(searchListArray, 30, searchListArray.length - 30);//取前30个历史记录
                localStorage.setItem(ckSearch, searchListArray.join(sepChar), 365);
                this.getSearchHistory();
            },

            getSearchHistory: function(){ //获取历史搜索内容
                var searchHistory = localStorage.getItem(ckSearch);
                this.historyList = searchHistory ? searchHistory.split(sepChar) : [];
            },

            clearHistory: function(){//清空历史搜索内容
                localStorage.removeItem(ckSearch);
                this.getSearchHistory();
            },

            historySearch: function(word){ //历史搜索词、热搜词点击
                this.keyWord = word;
                this.submitSearch();
            },

            clearkeyWord: function(){//清空关键词
                this.keyWord = "";
                this.resultshow = false;
                this.searchSpm.del_history && UBT.track(this.searchSpm.del_history);
            },

            focusHandler: function(){
                if(!wagv.isFromFanli && Fanli.Utility.isIos){
                    window.scrollTo(0,0);
                }
            },

            pageBack: function(){
                if(wagv.isFromFanli){
                    Fanli.Utility.bridgeApp("ifanli://m.51fanli.com/app/action/closewv");
                }else{
                    window.history.back(-1);
                }
            }
        },
        mounted: function(){
            this.getSearchHistory();
        }
    })

})()
