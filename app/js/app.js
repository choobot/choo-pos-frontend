let apiEndpoint = 'https://8d52312e1a23.ngrok.io'
Vue.prototype.$http = axios
thb = function(n){
    return numeral(n).format('0,0.00')+'฿'
}
let app = new Vue({
    el: '#app',
    data: {
        isLogin: false,
        isCheckout: false,
        token: null,
        error: null,
        isWorking: false,
        user: null,
        products: null,
        preCart: {
           items:[]
        },
        cart: {
            items:[]
        },
        receipt: null
    },
    mounted: function() {
        this.checkLogin()
    },
    methods: {
        checkLogin: function() {
            if(localStorage.token) {
                this.token = localStorage.token
                this.getUser()
                this.getProducts()
            } else {
                let visa = this.getVisa()
                if(visa != null) {
                    this.getToken(visa)
                }
            }
        },
        getVisa: function() {
            let uri = window.location.search.substring(1)
            let params = new URLSearchParams(uri)
            return params.get('visa')
        },
        getToken: function(visa) {
            let vm = this
            vm.isWorking = true
            this.$http
                .get(apiEndpoint+'/user/token?visa='+visa)
                .then(function(response) {
                    vm.token = 'Bearer '+response.data.token
                    localStorage.token = vm.token
                    window.location.href = window.origin
                }).catch(error => {
                    if (error.response) {
                        vm.error = error.response.data.error.code+' '+error.response.data.error.error
                    } else if (error.request) {
                        vm.error = error.request
                    } else {
                        vm.error = error.message
                    }
                }).finally(function(response) {
                    vm.isWorking = false
                })
        },
        getUser: function() {
            let vm = this
            vm.isWorking = true
            this.$http
                .get(apiEndpoint+'/user', {
                    headers: {
                        'Authorization': vm.token
                    }
                })
                .then(function(response) {
                    vm.user = response.data
                    vm.isLogin = true
                }).catch(error => {
                    vm.isLogin = false
                    delete localStorage.token
                    if (error.response) {
                        if(error.response.status == 401) {
                            vm.isLogin = false
                            delete localStorage.token
                        }
                        vm.error = error.response.data.error.code+' '+error.response.data.error.error
                    } else if (error.request) {
                        vm.error = error.request
                    } else {
                        vm.error = error.message
                    }
                }).finally(function(response) {
                    vm.isWorking = false
                })
        },
        login: function(event) {
            window.location.href = apiEndpoint+'/user/login?callback='+window.origin
        },
        logout: function(event) {
            let vm = this
            vm.isWorking = true
            this.$http
                .get(apiEndpoint+'/user/logout', {
                    headers: {
                        'Authorization': vm.token
                    }
                })
                .then(function(response) {
                    vm.isLogin = false
                    delete localStorage.token
                }).catch(error => {
                    if (error.response) {
                        if(error.response.status == 401) {
                            vm.isLogin = false
                            delete localStorage.token
                        }
                        vm.error = error.response.data.error.code+' '+error.response.data.error.error
                    } else if (error.request) {
                        vm.error = error.request
                    } else {
                        vm.error = error.message
                    }
                }).finally(function(response) {
                    vm.isWorking = false
                })
        },
        getProducts: function(visa) {
            let vm = this
            vm.isWorking = true
            this.$http
                .get(apiEndpoint+'/product', {
                    headers: {
                        'Authorization': vm.token
                    }
                })
                .then(function(response) {
                    vm.products = response.data.books
                }).catch(error => {
                    if (error.response) {
                        if(error.response.status == 401) {
                            vm.isLogin = false
                            delete localStorage.token
                        }
                        vm.error = error.response.data.error.code+' '+error.response.data.error.error
                    } else if (error.request) {
                        vm.error = error.request
                    } else {
                        vm.error = error.message
                    }
                }).finally(function(response) {
                    vm.isWorking = false
                })
        },
        addToCart: function(productId) {
            let item = {
                product: {
                    id: productId
                }
            }
            this.preCart.items.push(item)
            this.updateCart()
        },
        removeFromCart: function(itemIndex) {
            this.cart.items.splice(itemIndex, 1)
            this.preCart.items.splice(itemIndex, 1)
            if(this.cart.items.length != 0) {
                this.updateCart()
            } else {
                this.cart.total = 0
            }
        },
        updateCart: function(itemIndex) {
            let vm = this
            vm.isWorking = true
            this.$http
                .put(apiEndpoint+'/cart', vm.preCart, {
                    headers: {
                        "Authorization": vm.token
                    }
                })
                .then(function(response) {
                    vm.cart = response.data
                }).catch(error => {
                    if (error.response) {
                        if(error.response.status == 401) {
                            vm.isLogin = false
                            delete localStorage.token
                        }
                        vm.error = error.response.data.error.code+' '+error.response.data.error.error
                    } else if (error.request) {
                        vm.error = error.request
                    } else {
                        vm.error = error.message
                    }
                }).finally(function(response) {
                    vm.isWorking = false
                })
        },
        checkout: function() {
            let cash = prompt('Total: '+this.thb(this.cart.total)+'. Please enter cash:')
            if(cash != null) {
                if(isNaN(cash) || cash < this.cart.total || cash > Number.MAX_SAFE_INTEGER) {
                    this.checkout()
                } else {
                    this.receipt = this.cart
                    this.receipt.cash = Number(cash)
                    this.receipt.change = (this.receipt.cash-this.receipt.total)
                    this.isCheckout = true
                }
            }
        },
        nextOrder: function() {
            this.isCheckout = false
            this.preCart = {
                "items": []
            }
            this.cart =  {
                "items":[]
            },
            this.receipt = null
        },
        thb: thb
    }
})

Vue.component('product-box', {
    props: ['product'],
    methods: {
        thb: thb
    },
    template: `
        <div class="product-box panel panel-default"">
            <div class="panel-body">
                <div class="product-cover"><img v-bind:src="product.cover"></div>
                <div class="product-title text-left">{{ product.title }}</div>
                <div class="product-price text-left">{{ thb(product.price) }}</div>
            </div>
            <div class="product-add-cart panel-footer text-center">
                <button @click="$emit('add-to-cart', product.id)" class="btn btn-success">Add to Cart</button>
            </div>
        </div>
    `
  })

  Vue.component('cart-item-box', {
    props: ['item', 'index'],
    methods: {
        thb: thb
    },
    template: `
        <tr>
            <td class="text-left">{{ index+1 }}</td>
            <td class="product-cover text-center"><img v-bind:src="item.product.cover"></td>
            <td class="text-left">{{ item.product.title }}</td>
            <td class="text-right">
                <span v-if="item.price != item.product.price">
                    <span class="text-strikethrough">{{ thb(item.product.price) }}</span>
                    <span class="text-red">{{ thb(item.price) }}</span>
                </span>
                <span v-else>
                    {{ thb(item.price) }}
                </span>
            </td>
            <td class="text-right"><button @click="$emit('remove-from-cart', index)" class="btn btn-sm btn-danger">X</button></td>
        </tr>
    `
  })

  Vue.component('order-item-box', {
    props: ['item', 'index'],
    methods: {
        thb: thb
    },
    template: `
        <tr>
            <td class="text-left">{{ index+1 }}</td>
            <td class="text-left">{{ item.product.title }}</td>
            <td class="text-right">{{ thb(item.product.price) }}</td>
            <td class="text-right text-red">{{ thb((item.price-item.product.price)) }}</td>
            <td class="text-right">{{ thb(item.price) }}</td>
        </tr>
    `
  })