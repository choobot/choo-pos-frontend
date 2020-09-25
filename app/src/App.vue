<template>
  <div id="app">
    <div
      id="login-box"
      v-if="state == STATE.LOGIN"
      class="panel panel-success text-center"
    >
      <div class="panel-heading">
        <h3 class="panel-title">Little Brown Book Shop</h3>
      </div>
      <div class="panel-body">
        <p>Please login to continue</p>
        <a id="login-button" @click="login" href="javascript:void(0)"
          ><img src="./assets/images/login-button.png"
        /></a>
      </div>
    </div>

    <nav
      id="nav-box"
      v-if="![STATE.NONE, STATE.LOGIN, STATE.PUBLIC_RECEIPT].includes(state)"
      class="navbar navbar-default"
    >
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
            <a
              id="checkout-nav"
              @click="nextOrder"
              @shortkey="nextOrder"
              v-shortkey="['ctrl', 'c']"
              href="javascript:void(0)"
              ><span class="text-underline">C</span>heckout</a
            >
          </li>
          <li v-bind:class="{ active: state == STATE.LOGS }">
            <a
              id="logs-nav"
              @click="logs"
              @shortkey="logs"
              v-shortkey="['ctrl', 'l']"
              href="javascript:void(0)"
              ><span class="text-underline">L</span>ogs</a
            >
          </li>
          <li v-bind:class="{ active: state == STATE.SALES_ORDER }">
            <a
              id="logs-nav"
              @click="getSalesOrders"
              @shortkey="getSalesOrders"
              v-shortkey="['ctrl', 's']"
              href="javascript:void(0)"
              ><span class="text-underline">S</span>ales Orders</a
            >
          </li>
        </ul>
        <form class="navbar-form navbar-right">
          <img v-bind:src="user.picture" class="avartar img-circle" />
          {{ user.name }}
          <button
            id="logout-button"
            @click="logout"
            @shortkey="logout"
            v-shortkey="['ctrl', 'o']"
            type="button"
            class="btn btn-default"
          >
            Log<span class="text-underline">o</span>ut
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
              <div class="text-center">
                Please select product or Scan barcode
              </div>
              <div id="scan-barcode-box">
                <form @submit.prevent="scanBarcode" autocomplete="off">
                  <div class="input-group input-group-md">
                    <span class="input-group-addon" id="basic-addon1"
                      ><label id="scan-barcode-label" for="scan-barcode-input"
                        >Scan</label
                      ></span
                    >
                    <input
                      id="scan-barcode-input"
                      ref="scan-barcode-input"
                      v-model="barcode"
                      type="text"
                      class="form-control"
                      placeholder="Barcode"
                      aria-describedby="basic-addon1"
                    />
                  </div>
                  <div
                    v-if="barcodeError"
                    class="alert alert-danger"
                    role="alert"
                  >
                    <span class="glyphicon glyphicon-exclamation-sign"></span>
                    Invalid Barcode
                  </div>
                </form>
              </div>
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
            </div>
            <div v-if="cart.items.length > 0" class="panel-footer text-center">
              <button
                id="cart-payment"
                @click="payment"
                @shortkey="payment"
                v-shortkey="['ctrl', 'p']"
                type="button"
                class="btn btn-lg btn-success"
              >
                <span class="text-underline">P</span>ayment
              </button>
              <button
                id="cart-reset"
                @click="nextOrder"
                @shortkey="nextOrder"
                v-shortkey="['ctrl', 'r']"
                type="button"
                class="btn btn-default"
              >
                <span class="text-underline">R</span>eset
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div
      id="receipt-box"
      v-if="[STATE.RECEIPT, STATE.PUBLIC_RECEIPT].includes(state)"
      class="panel panel-success"
    >
      <div class="panel-heading" v-if="state == STATE.RECEIPT">
        <h3 class="panel-title text-center">Order completed</h3>
      </div>
      <div class="panel-body">
        <h4>Little Brown Book Shop</h4>
        <div class="order-id">
          <span class="text-bold">Order/Receipt No:</span> {{ receipt.id }}
        </div>
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
              <td id="order-subtotal" class="text-bold text-right">
                {{ thb(receipt.subtotal) }}
              </td>
              <td id="order-discount" class="text-bold text-right text-red">
                {{ thb(receipt.total - receipt.subtotal) }}
              </td>
              <td id="order-total" class="text-bold text-right">
                {{ thb(receipt.total) }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3" class="text-bold">Cash</td>
              <td id="order-cash" class="text-bold text-right">
                {{ thb(receipt.cash) }}
              </td>
            </tr>
            <tr>
              <td></td>
              <td colspan="3" class="text-bold">Change</td>
              <td id="order-change" class="text-bold text-right">
                {{ thb(receipt.change) }}
              </td>
            </tr>
          </tfoot>
        </table>
        <div class="order-qrcode" v-if="state == STATE.RECEIPT">
          <div>Scan for E-Receipt</div>
          <qrcode-vue v-bind:value="receipt.url" size="120"></qrcode-vue>
        </div>
      </div>
      <div class="panel-footer text-center" v-if="state == STATE.RECEIPT">
        <button
          id="next-order"
          @click="nextOrder"
          @shortkey="nextOrder"
          v-shortkey="['ctrl', 'n']"
          type="button"
          class="btn btn-lg btn-success"
        >
          <span class="text-underline">N</span>ext order
        </button>
      </div>
    </div>

    <div id="logs-box" v-if="state == STATE.LOGS" class="panel panel-default">
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

    <div
      id="sales-order-box"
      v-if="state == STATE.SALES_ORDER"
      class="panel panel-default"
    >
      <div class="panel-heading">
        <h3 class="panel-title text-center">Sales Orders</h3>
      </div>
      <div class="panel-body">
        <table class="table table-striped">
          <thead class="line-bg">
            <tr>
              <th scope="col">Date/Time</th>
              <th scope="col">Order/Receipt Id</th>
              <th scope="col" class="text-right">Amount</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody>
            <tr
              is="sales-order-box"
              class="sales-order-box"
              v-for="sales_order in sales_orders"
              v-bind:key="sales_order.id"
              v-bind:sales_order="sales_order"
            ></tr>
          </tbody>
        </table>
      </div>
    </div>

    <span id="working" v-show="isWorking" class="line-bg">Working...</span>
    <span id="error" class="error-bg">{{ error }}</span>
  </div>
</template>

<script>
import axios from "axios";
import ProductBox from "./components/ProductBox";
import CartItemBox from "./components/CartItemBox";
import OrderItemBox from "./components/OrderItemBox";
import UserLogBox from "./components/UserLogBox";
import SalesOrderBox from "./components/SalesOrderBox";
import QrcodeVue from "qrcode.vue";

const STATE = {
  NONE: "none",
  LOGIN: "login",
  CHECKOUT: "checkout",
  RECEIPT: "receipt",
  LOGS: "logs",
  PUBLIC_RECEIPT: "public_receipt",
  SALES_ORDER: "sales_order",
};

const API_ENDPOINT = process.env.API_ENDPOINT;

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
      productsMap: null,
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
      barcode: "",
      barcodeError: false,
      sales_orders: [],
    };
  },
  components: {
    QrcodeVue,
    ProductBox,
    CartItemBox,
    OrderItemBox,
    UserLogBox,
    SalesOrderBox,
  },
  mounted: function () {
    this.state = this.STATE.NONE;
    this.checkState();
    setInterval(function () {
      const barcodeInput = document.getElementById("scan-barcode-input");
      if (barcodeInput) {
        barcodeInput.focus();
      }
    }, 100);
  },
  methods: {
    checkState: function () {
      let orderId = this.getOrderId();
      if (orderId != null) {
        this.getReceipt(orderId);
      } else if (localStorage.token) {
        this.token = localStorage.token;
        this.getUser();
        this.getProducts();
      } else {
        let visa = this.getVisa();
        if (visa != null) {
          this.getToken(visa);
        } else {
          this.state = this.STATE.LOGIN;
        }
      }
    },
    getOrderId: function () {
      let uri = this.getWindow().location.search.substring(1);
      let params = new URLSearchParams(uri);
      return params.get("order");
    },
    getVisa: function () {
      let uri = this.getWindow().location.search.substring(1);
      let params = new URLSearchParams(uri);
      return params.get("visa");
    },
    getToken: function (visa) {
      let vm = this;
      vm.isWorking = true;
      axios
        .get(API_ENDPOINT + "/user/token?visa=" + visa)
        .then(function (response) {
          vm.token = "Bearer " + response.data.token;
          localStorage.token = vm.token;
          vm.setLocation(vm.getWindow().origin);
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
      axios
        .get(API_ENDPOINT + "/user", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.user = response.data;
          vm.nextOrder();
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
      this.setLocation(
        API_ENDPOINT + "/user/login?callback=" + this.getWindow().origin
      );
    },
    logout: function (event) {
      let vm = this;
      vm.isWorking = true;
      axios
        .get(API_ENDPOINT + "/user/logout", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.state = vm.STATE.LOGIN;
          delete localStorage.token;
          vm.token = null;
        })
        .catch((error) => {
          if (error.response) {
            if (error.response.status == 401) {
              vm.state = vm.STATE.LOGIN;
              vm.token = null;
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
      axios
        .get(API_ENDPOINT + "/product", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.products = response.data.books;
          vm.productsMap = {};
          vm.products.forEach(function (item, index) {
            vm.productsMap[item.id] = item;
          });
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
      if (!this.isWorking) {
        this.cart.items.splice(itemIndex, 1);
        this.preCart.items.splice(itemIndex, 1);
        if (this.cart.items.length != 0) {
          this.updateCart();
        } else {
          this.cart.total = 0;
        }
      }
    },
    updateCart: function (itemIndex) {
      let vm = this;
      vm.isWorking = true;
      axios
        .put(API_ENDPOINT + "/cart", vm.preCart, {
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
    payment: function () {
      let cash = this.prompt(
        "Total: " + this.thb(this.cart.total) + ". Please enter cash:"
      );
      if (cash != null) {
        if (
          isNaN(cash) ||
          cash < this.cart.total ||
          cash > Number.MAX_SAFE_INTEGER
        ) {
          this.payment();
        } else {
          let vm = this;
          let req = vm.preCart;
          req.cash = Number(cash);
          vm.isWorking = true;
          axios
            .post(API_ENDPOINT + "/order", req, {
              headers: {
                Authorization: vm.token,
              },
            })
            .then(function (response) {
              vm.receipt = response.data;
              vm.receipt.change = vm.receipt.cash - vm.receipt.total;
              vm.receipt.url =
                vm.getWindow().origin + "/?order=" + vm.receipt.id;
              vm.state = vm.STATE.RECEIPT;
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
        }
      }
    },
    nextOrder: function () {
      this.state = this.STATE.CHECKOUT;
      this.preCart = {
        items: [],
      };
      this.cart = {
        items: [],
      };
      this.receipt = null;
    },
    logs: function () {
      this.state = this.STATE.LOGS;
      let vm = this;
      vm.isWorking = true;
      axios
        .get(API_ENDPOINT + "/user/log", {
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
    scanBarcode: function (e) {
      if (this.barcode != "") {
        if (this.productsMap[this.barcode] === undefined) {
          this.barcodeError = true;
        } else {
          this.barcodeError = false;
          this.addToCart(this.barcode);
        }
        this.barcode = "";
      }
    },
    getReceipt: function (orderId) {
      let vm = this;
      vm.isWorking = true;
      axios
        .get(API_ENDPOINT + "/order/" + orderId)
        .then(function (response) {
          vm.receipt = response.data;
          vm.receipt.change = vm.receipt.cash - vm.receipt.total;
          vm.state = vm.STATE.PUBLIC_RECEIPT;
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
    getSalesOrders: function (orderId) {
      let vm = this;
      vm.isWorking = true;
      axios
        .get(API_ENDPOINT + "/order", {
          headers: {
            Authorization: vm.token,
          },
        })
        .then(function (response) {
          vm.sales_orders = response.data;
          vm.state = vm.STATE.SALES_ORDER;
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
  position: relative;
}

.product-box .product-title {
  padding: 0 5px 0 5px;
}

.product-box .product-price {
  padding: 0 5px 0 5px;
}

.product-promotion {
  background: url("./assets/images/promotion.png") no-repeat left top;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 0;
  left: 0;
}

.product-cover img {
  width: 100%;
}

.product-title {
  font-weight: bold;
}

.cart-item-cover img {
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

.text-underline {
  text-decoration: underline;
}

#scan-barcode-box {
  padding: 10px 0 10px 0;
}

#scan-barcode-label {
  display: inline-block;
  max-width: 100%;
  margin: 0;
  font-weight: normal;
}

.order-id {
  margin-bottom: 10px;
}

.order-qrcode {
  width: 120px;
  margin: auto;
}
</style>
