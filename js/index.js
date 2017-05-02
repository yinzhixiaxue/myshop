$(function(){
    var Product = function(id,name,price,img,quantity){
        this.id = id;
        this.name = name;
        this.price = price;
        this.img = img;
        this.quantity = 1;
    };
    var cart = {
        totalQuantity: 0,
        totalAmount: 0,
        productList: [],
        addCart: function(product){
           this.productList.push(product);
           this.totalQuantity += product.quantity;
           this.totalAmount += product.quantity * product.price; 
           // $('#quantity').html(this.totalQuantity);
           // $('#money').html(this.totalAmount);
            productComp.render();
        },
        removeCart: function(){

        }
    };
    // var $productList = $('#product-list');
    var productComp = {
        $productList : $('#product-list'),
        $loading: $('#loading'),
        $loadMore: $('#load-more'),
        isLoaded: true,
        pageNo: 1,
        isEnd: false,
        init: function(){ 
            var _this = this;
            this.loadData();
            this.$productList.on("click",'.btn-add-cart',function(){
                var product = $(this).parents('.product-item').data('item-data');
                product.quantity = parseInt($(this).prev().val());
                cart.addCart(product);
            });   
            this.$loadMore.on("click",function(){
                _this.loadMore();
            })
        },
        render: function(){
            $('#quantity').html(cart.totalQuantity);
            $('#money').html(cart.totalAmount);
        },
        loadData: function(){
            this.$loading.show();

            $.get('product/get_products',{page: this.pageNo},function(data){
                for(var i=0;i<data.products.length;i++){
                       var products = data.products;
                       var product = new Product(products[i].prod_id,products[i].prod_name,products[i].prod_price,products[i].img_src);
                       var productHtml = template("product-tpl",product);
                       var $product = $(productHtml);
                        $product.data('item-data',product);               
                        this.$productList.append($product); 
                        this.isEnd = data.isEnd;  
                } 
                 this.$loading.hide();
                 this.$loadMore.show();
                 this.isLoaded = true;
            }.bind(this),'json');
        },
        loadMore: function(){
            if(this.isLoaded){//如果isLoaded为true代表已经加载完，可以再次进行加载
                // console.log(Math.random());
                this.pageNo++;
                this.isLoaded = false;
                if(this.isEnd){
                    alert("已经没有数据了");
                    this.isLoaded = true;
                }
                else this.loadData();
            }
        }

    };
    productComp.init();
});
