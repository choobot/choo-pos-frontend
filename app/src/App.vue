<template>
  <div id="app">
    <div
      id="login-box"
      v-if="state == STATE.LOGIN && !isWorking"
      class="panel panel-success text-center"
    >
      <div class="panel-heading">
        <h3 class="panel-title">Little Brown Book Shop</h3>
      </div>
      <div class="panel-body">
        <p>Please login to continue</p>
        <a href="javascript:void(0)" @click="login"
          ><img src="./assets/images/btn_login_base.png"
        /></a>
      </div>
    </div>

    <nav id="nav-box" v-if="state != STATE.LOGIN" class="navbar navbar-default">
      <div class="container-fluid">
        <div class="navbar-header">
          <div class="navbar-brand text-bold">
            Little Brown Book Shop
          </div>
        </div>
        <ul class="nav navbar-nav">
          <li
            v-bind:class="{
              active: state == STATE.CHECKOUT || state == STATE.RECEIPT,
            }"
          >
            <a href="javascript:void(0)" @click="nextOrder">Checkout</a>
          </li>
          <li v-bind:class="{ active: state == STATE.LOGS }">
            <a href="javascript:void(0)" @click="logs">Logs</a>
          </li>
        </ul>
        <form class="navbar-form navbar-right">
          <img v-bind:src="user.picture" class="avartar img-circle" />
          {{ user.name }}
          <button @click="logout" type="button" class="btn btn-default">
            Logout
          </button>
        </form>
      </div>
    </nav>

    <div
      id="checkout-box"
      v-if="state == STATE.CHECKOUT"
      class="container-fluid"
    >
      <div class="row">
        <div class="col-md-8">
          <div id="products-box" class="panel panel-default">
            <div class="panel-heading">
              <h3 class="panel-title text-center">Please select product</h3>
            </div>
            <div class="panel-body">
              <product-box
                v-for="product in products"
                v-bind:key="product.id"
                v-bind:product="product"
                v-on:add-to-cart="addToCart"
              ></product-box>
            </div>
          </div>
        </div>

        <div class="col-md-4">
          <div id="cart-box" class="panel panel-success">
            <div class="panel-heading">
              <h3 class="panel-title text-center">Cart</h3>
            </div>
            <div class="panel-body">
              <table
                id="cart-items-box"
                v-if="cart.items.length > 0"
                class="table table-striped"
              >
                <thead class="line-bg">
                  <tr>
                    <th scope="col">No.</th>
                    <th></th>
                    <th scope="col">Description</th>
                    <th scope="col" class="text-right">Amount</th>
                    <th scope="col"></th>
                  </tr>
                </thead>
                <tbody>
                  <tr
                    is="cart-item-box"
                    class="cart-item-box"
                    v-for="(item, index) in cart.items"
                    v-bind:key="index"
                    v-bind:index="index"
                    v-bind:item="item"
                    v-on:remove-from-cart="removeFromCart"
                  ></tr>
                </tbody>
                <tfoot>
                  <tr>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Subtotal</td>
                    <td class="text-bold text-right">
                      {{ thb(cart.subtotal) }}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Discount</td>
                    <td class="text-bold text-right text-red">
                      {{ thb(cart.total - cart.subtotal) }}
                    </td>
                    <td></td>
                  </tr>
                  <tr>
                    <td></td>
                    <td></td>
                    <td class="text-bold">Total</td>
                    <td class="text-bold text-right">{{ thb(cart.total) }}</td>
                    <td></td>
                  </tr>
                </tfoot>
              </table>
              <div v-if="cart.items.length == 0" class="text-center">
                Please select product
              </div>
            </div>
            <div v-if="cart.items.length > 0" class="panel-footer text-center">
              <button
                @click="checkout"
                type="button"
                class="btn btn-lg btn-success"
              >
                Checkout
              </button>
              <button @click="nextOrder" type="button" class="btn btn-default">
                Reset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="receipt-box"
      v-if="state == STATE.RECEIPT"
      class="panel panel-success"
    >
      <div class="panel-heading">
        <h3 class="panel-title text-center">Order completed</h3>
      </div>
      <div class="panel-body">
        <!-- <div>Receipt No: </div> -->
        <table class="table table-striped">
          <thead class="line-bg">
            <tr>
              <th scope="col">No.</th>
              <th scope="col">Description</th>
              <th scope="col" class="text-right">Price</th>
              <th scope="col" class="text-right">Discount</th>
              <th scope="col" class="text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            <tr
              is="order-item-box"
              class="order-item-box"
              v-for="(item, index) in receipt.items"
              v-bind:key="index"
              v-bind:index="index"
              v-bind:item="item"
            ></tr>
          </tbody>
          <tfoot>
            <tr>
              <td></td>
              <td class="text-bold">Total</td>
              <td class="text-bold text-right">{{ thb(receipt.subtotal) }}</td>
              <td class="text-bold text-right text-red">
                {{ thb(receipt.total - receipt.subtotal) }}
              </td>
              <td class="text-bold text-right">{{ thb(receipt.total) }}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3" class="text-bold">Cash</td>
              <td class="text-bold text-right">{{ thb(receipt.cash) }}</td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3" class="text-bold">Change</td>
              <td class="text-bold text-right">{{ thb(receipt.change) }}</td>
            </tr>
          </tfoot>
        </table>
      </div>
      <div class="panel-footer text-center">
        <button @click="nextOrder" type="button" class="btn btn-lg btn-success">
          Proceed next order
        </button>
      </div>
    </div>

    <div id="checkout-box" v-if="state == STATE.LOGS" class="container-fluid">
      <div id="logs-box" class="panel panel-default">
        <div class="panel-heading">
          <h3 class="panel-title text-center">User Logs</h3>
        </div>
        <div class="panel-body">
          <table class="table table-striped">
            <thead class="line-bg">
              <tr>
                <th scope="col">Date/Time</th>
                <th scope="col">User</th>
              </tr>
            </thead>
            <tbody>
              <tr
                is="user-log-box"
                class="user-log-box"
                v-for="(user_log, index) in log.user_logs"
                v-bind:key="index"
                v-bind:user_log="user_log"
              ></tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <span id="working" v-show="isWorking" class="line-bg">Working...</span>
    <span id="error" class="error-bg">{{ error }}</span>
  </div>
</template>

<script>
import ProductBox from "./components/ProductBox";
import CartItemBox from "./components/CartItemBox";
import OrderItemBox from "./components/OrderItemBox";
import UserLogBox from "./components/UserLogBox";

const STATE = {
  LOGIN: "login",
  CHECKOUT: "checkout",
  RECEIPT: "receipt",
  LOGS: "logs",
};

let apiEndpoint = "https://1807a7aa24e4.ngrok.io";

export default {
  name: "App",
  data() {
    return {
      STATE: STATE,
      state: null,
      token: null,
      error: null,
      isWorking: false,
      user: {},
      products: null,
      preCart: {
        items: [],
      },
      cart: {
        items: [],
      },
      receipt: null,
      log: {
        user_logs: [],
      },
    };
  },
  components: {
    ProductBox,
    CartItemBox,
    OrderItemBox,
    UserLogBox,
  },
  mounted: function () {
    this.state = this.STATE.LOGIN;
    this.checkLogin();
  },
  methods: {
    checkLogin: function () {
      if (localStorage.token) {
        this.token = localStorage.token;
        this.getUser();
        this.getProducts();
      } else {
        let visa = this.getVisa();
        if (visa != null) {
          this.getToken(visa);
        }
      }
    },
    getVisa: function () {
      let uri = window.location.search.substring(1);
      let params = new URLSearchParams(uri);
      return params.get("visa");
    },
    getToken: function (visa) {
      let vm = this;
      vm.isWorking = true;
      this.$http
        .get(apiEndpoint + "/user/token?visa=" + visa)
        .then(function (response) {
          vm.token = "Bearer " + response.data.token;
          localStorage.token = vm.token;
          window.location.href = window.origin;
        })
        .catch((error) => {
          if (error.response) {
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
    getUser: function () {
      let vm = this;
      vm.isWorking = true;
      this.$http
        .get(apiEndpoint + "/user", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.user = response.data;
          vm.state = vm.STATE.CHECKOUT;
        })
        .catch((error) => {
          vm.state = vm.STATE.LOGIN;
          delete localStorage.token;
          if (error.response) {
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
    login: function (event) {
      window.location.href =
        apiEndpoint + "/user/login?callback=" + window.origin;
    },
    logout: function (event) {
      let vm = this;
      vm.isWorking = true;
      this.$http
        .get(apiEndpoint + "/user/logout", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.state = vm.STATE.LOGIN;
          delete localStorage.token;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              vm.state = vm.STATE.LOGIN;
              delete localStorage.token;
            }
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
    getProducts: function (visa) {
      let vm = this;
      vm.isWorking = true;
      this.$http
        .get(apiEndpoint + "/product", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.products = response.data.books;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              vm.state = vm.STATE.LOGIN;
              delete localStorage.token;
            }
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
    addToCart: function (productId) {
      let item = {
        product: {
          id: productId,
        },
      };
      this.preCart.items.push(item);
      this.updateCart();
    },
    removeFromCart: function (itemIndex) {
      this.cart.items.splice(itemIndex, 1);
      this.preCart.items.splice(itemIndex, 1);
      if (this.cart.items.length != 0) {
        this.updateCart();
      } else {
        this.cart.total = 0;
      }
    },
    updateCart: function (itemIndex) {
      let vm = this;
      vm.isWorking = true;
      this.$http
        .put(apiEndpoint + "/cart", vm.preCart, {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.cart = response.data;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              vm.state = vm.STATE.LOGIN;
              delete localStorage.token;
            }
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
    checkout: function () {
      let cash = prompt(
        "Total: " + this.thb(this.cart.total) + ". Please enter cash:"
      );
      if (cash != null) {
        if (
          isNaN(cash) ||
          cash < this.cart.total ||
          cash > Number.MAX_SAFE_INTEGER
        ) {
          this.checkout();
        } else {
          this.receipt = this.cart;
          this.receipt.cash = Number(cash);
          this.receipt.change = this.receipt.cash - this.receipt.total;
          this.state = this.STATE.RECEIPT;
        }
      }
    },
    nextOrder: function () {
      this.state = this.STATE.CHECKOUT;
      this.preCart = {
        items: [],
      };
      (this.cart = {
        items: [],
      }),
        (this.receipt = null);
    },
    logs: function () {
      this.state = this.STATE.LOGS;
      let vm = this;
      vm.isWorking = true;
      this.$http
        .get(apiEndpoint + "/user/log", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.log = response.data;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              vm.state = vm.STATE.LOGIN;
              delete localStorage.token;
            }
            vm.error =
              error.response.data.error.code +
              " " +
              error.response.data.error.error;
          } else if (error.request) {
            vm.error = error.request;
          } else {
            vm.error = error.message;
          }
        })
        .finally(function (response) {
          vm.isWorking = false;
        });
    },
  },
};
</script>

<style>
.header {
  text-align: right;
  margin-bottom: 5px;
}

#working,
#error {
  position: fixed;
  top: 0;
  left: 0;
}

.line-bg {
  background-color: #00be00;
  color: #fff;
  border-color: #00be00;
}

.error-bg {
  background-color: #ff0000;
  color: #fff;
  border-color: #ff0000;
}

.avartar {
  width: 32px;
}

.product-box {
  float: left;
  position: relative;
  width: 150px;
  height: 400px;
  margin: 5px;
}

.product-box .panel-body {
  padding: 0;
}

.product-box .product-title {
  padding: 0 5px 0 5px;
}

.product-box .product-price {
  padding: 0 5px 0 5px;
}

.product-cover img {
  width: 100%;
}

.product-title {
  font-weight: bold;
}

.cart-item-box .product-cover img {
  width: 32px;
}

.product-add-cart {
  position: absolute;
  bottom: 0;
  width: 100%;
}

.text-bold {
  font-weight: bold;
}

.text-strikethrough {
  text-decoration: line-through;
}

.text-red {
  color: red;
}
</style>
