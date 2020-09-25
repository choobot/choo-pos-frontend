import { shallowMount } from "@vue/test-utils";
import App from "@/App";
import axios from "axios";
import Vue from "vue";

jest.mock("axios");

Vue.use(require("vue-shortkey"));

describe("App", () => {
  const thb = jest.fn((x) => x + "THB");
  const prompt = jest.fn((x) => "100");
  const getWindowWithVisa = jest.fn(function () {
    return {
      location: {
        href: "href_value",
        search: "?visa=visa_value",
      },
      origin: "origin_value",
    };
  });
  const getWindow = jest.fn(function () {
    return {
      location: {
        href: "href_value",
        search: "",
      },
      origin: "origin_value",
    };
  });
  const setLocation = jest.fn((x) => {});
  const STATE = {
    LOGIN: "login",
    CHECKOUT: "checkout",
    RECEIPT: "receipt",
    LOGS: "logs",
  };

  it("click #login-button then redirect", async () => {
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.LOGIN,
        };
      },
      mocks: {
        getWindow,
        setLocation,
      },
    });
    const button = wrapper.find("#login-button");
    await button.trigger("click");
    expect(setLocation).toHaveBeenCalledWith(
      "undefined/user/login?callback=origin_value"
    );
  });

  it("call getVisa()", () => {
    const resp = {
      data: {
        token: "token_value",
      },
    };
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      mocks: {
        getWindow: getWindowWithVisa,
        setLocation,
      },
    });
    expect(wrapper.vm.getVisa()).toBe("visa_value");
  });

  it("call getToken()", async () => {
    const resp = {
      data: {
        token: "token_value",
      },
    };
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      mocks: {
        getWindow: getWindowWithVisa,
        setLocation,
      },
    });
    await wrapper.vm.getToken("visa_value");
    expect(wrapper.vm.token).toBe("Bearer token_value");
    expect(setLocation).toHaveBeenCalledWith("origin_value");
  });

  it("call getUser()", async () => {
    const resp = {
      data: {
        sub: "U5fa9b1534778c27d104143614d17fadd",
        name: "Choopong",
        picture:
          "https://profile.line-scdn.net/0hxCXbPtOHJ2xlGwwRSlJYO1leKQESNSEkHS88AxUTcQlJKTQyX3o6XRASewlMe2RoDns6DkEfeghP",
      },
    };
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      mocks: {
        getWindow: getWindowWithVisa,
        setLocation,
      },
    });
    await wrapper.vm.getUser();
    expect(wrapper.vm.user).toBe(resp.data);
  });

  it("call getProducts()", async () => {
    const resp = {
      data: {
        books: [
          {
            id: "9781473667815",
            cover:
              "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
            price: 290,
            title: "A Shout in the Ruins",
            status: 1,
            created_at: "2020-09-20T22:04:56Z",
            updated_at: "2020-09-20T22:04:56Z",
          },
        ],
      },
    };
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      mocks: {
        getWindow: getWindowWithVisa,
        setLocation,
      },
    });
    await wrapper.vm.getProducts();
    expect(wrapper.vm.user).toBe(resp.data);
  });

  it("click #logs-nav then render LOGS state", async () => {
    const resp = {
      data: {
        user_logs: [
          {
            time: "2020-09-24T17:39:44Z",
            user: {
              sub: "U5fa9b1534778c27d104143614d17fadd",
              name: "Choopong",
              picture:
                "https://profile.line-scdn.net/0hxCXbPtOHJ2xlGwwRSlJYO1leKQESNSEkHS88AxUTcQlJKTQyX3o6XRASewlMe2RoDns6DkEfeghP",
            },
          },
        ],
      },
    };
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App);
    const button = wrapper.find("#logs-nav");
    await button.trigger("click");
    expect(wrapper.find("#login-box").exists()).toBe(false);
    expect(wrapper.find("#nav-box").exists()).toBe(true);
    expect(wrapper.find("#checkout-box").exists()).toBe(false);
    expect(wrapper.find("#receipt-box").exists()).toBe(false);
    expect(wrapper.find("#logs-box").exists()).toBe(true);
  });

  it("call addToCart()", async () => {
    const resp = {
      data: {
        total: 290,
        items: [
          {
            price: 290,
            product: {
              id: "9781473667815",
              cover:
                "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
              price: 290,
              title: "A Shout in the Ruins",
              status: 1,
              created_at: "2020-09-20T22:04:56Z",
              updated_at: "2020-09-20T22:04:56Z",
            },
          },
        ],
      },
    };
    axios.put.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.CHECKOUT,
          products: [
            {
              id: "9781473667815",
              cover:
                "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
              price: 290,
              title: "A Shout in the Ruins",
              status: 1,
              created_at: "2020-09-20T22:04:56Z",
              updated_at: "2020-09-20T22:04:56Z",
            },
          ],
        };
      },
      mocks: {
        thb,
      },
    });
    await wrapper.vm.addToCart("9781473667815");
    expect(wrapper.vm.cart.items.length).toBe(1);
  });

  it("call removeFromCart()", async () => {
    const resp = {
      data: {
        total: 0,
        items: [],
      },
    };
    axios.put.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.CHECKOUT,
          products: [
            {
              id: "9781473667815",
              cover:
                "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
              price: 290,
              title: "A Shout in the Ruins",
              status: 1,
              created_at: "2020-09-20T22:04:56Z",
              updated_at: "2020-09-20T22:04:56Z",
            },
          ],
          preCart: {
            items: [
              {
                product: {
                  id: "9781473667815",
                },
              },
            ],
          },
          cart: {
            total: 290,
            items: [
              {
                price: 290,
                product: {
                  id: "9781473667815",
                  cover:
                    "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
                  price: 290,
                  title: "A Shout in the Ruins",
                  status: 1,
                  created_at: "2020-09-20T22:04:56Z",
                  updated_at: "2020-09-20T22:04:56Z",
                },
              },
            ],
          },
        };
      },
      mocks: {
        thb,
      },
    });
    await wrapper.vm.removeFromCart(0);
    expect(wrapper.vm.cart.items.length).toBe(0);
  });

  it("call removeFromCart() and empty", async () => {
    const resp = {
      data: {
        total: 0,
        items: [],
      },
    };
    axios.put.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.CHECKOUT,
          preCart: {
            items: [
              {
                product: {
                  id: "9781473667815",
                },
              },
            ],
          },
          cart: {
            total: 290,
            items: [
              {
                price: 290,
                product: {
                  id: "9781473667815",
                  cover:
                    "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
                  price: 290,
                  title: "A Shout in the Ruins",
                  status: 1,
                  created_at: "2020-09-20T22:04:56Z",
                  updated_at: "2020-09-20T22:04:56Z",
                },
              },
            ],
          },
        };
      },
      mocks: {
        thb,
      },
    });
    await wrapper.vm.removeFromCart(0);
    expect(wrapper.vm.cart.items.length).toBe(0);
  });

  it("click #cart-payment then RECEIPT state", async () => {
    const resp = {
      data: {
        cash: 500,
        total: 290,
        items: [
          {
            price: 290,
            product: {
              id: "9781473667815",
              cover:
                "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
              price: 290,
              title: "A Shout in the Ruins",
              status: 1,
              created_at: "2020-09-20T22:04:56Z",
              updated_at: "2020-09-20T22:04:56Z",
            },
          },
        ],
      },
    };
    axios.post.mockResolvedValue(resp);
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.CHECKOUT,
          preCart: {
            items: [
              {
                product: {
                  id: "9781473667815",
                },
              },
            ],
          },
          cart: {
            total: 90,
            items: [
              {
                price: 90,
                product: {
                  id: "9781473667815",
                  cover:
                    "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
                  price: 100,
                  title: "A Shout in the Ruins",
                  status: 1,
                  created_at: "2020-09-20T22:04:56Z",
                  updated_at: "2020-09-20T22:04:56Z",
                },
              },
            ],
          },
        };
      },
      mocks: {
        thb,
        prompt,
      },
    });
    const button = wrapper.find("#cart-payment");
    await button.trigger("click");
    expect(prompt).toHaveBeenCalledWith("Total: 90THB. Please enter cash:");
  });

  it("click #next-order then render CHECKOUT state", async () => {
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.RECEIPT,
          receipt: {
            cash: 100,
            total: 90,
            change: 10,
            items: [
              {
                price: 90,
                product: {
                  id: "9781473667815",
                  cover:
                    "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
                  price: 100,
                  title: "A Shout in the Ruins",
                  status: 1,
                  created_at: "2020-09-20T22:04:56Z",
                  updated_at: "2020-09-20T22:04:56Z",
                },
              },
            ],
          },
        };
      },
      mocks: {
        thb,
      },
    });
    const button = wrapper.find("#next-order");
    await button.trigger("click");
    expect(wrapper.find("#login-box").exists()).toBe(false);
    expect(wrapper.find("#nav-box").exists()).toBe(true);
    expect(wrapper.find("#checkout-box").exists()).toBe(true);
    expect(wrapper.find("#receipt-box").exists()).toBe(false);
    expect(wrapper.find("#logs-box").exists()).toBe(false);
    expect(wrapper.vm.cart.items.length).toBe(0);
  });

  it("click #cart-reset then render CHECKOUT state", async () => {
    const wrapper = shallowMount(App, {
      data() {
        return {
          state: STATE.CHECKOUT,
          preCart: {
            items: [
              {
                product: {
                  id: "9781473667815",
                },
              },
            ],
          },
          cart: {
            total: 90,
            items: [
              {
                price: 90,
                product: {
                  id: "9781473667815",
                  cover:
                    "https://d1w7fb2mkkr3kw.cloudfront.net/assets/images/book/mid/9781/4736/9781473667815.jpg",
                  price: 100,
                  title: "A Shout in the Ruins",
                  status: 1,
                  created_at: "2020-09-20T22:04:56Z",
                  updated_at: "2020-09-20T22:04:56Z",
                },
              },
            ],
          },
        };
      },
      mocks: {
        thb,
      },
    });
    const button = wrapper.find("#cart-reset");
    await button.trigger("click");
    expect(wrapper.find("#login-box").exists()).toBe(false);
    expect(wrapper.find("#nav-box").exists()).toBe(true);
    expect(wrapper.find("#checkout-box").exists()).toBe(true);
    expect(wrapper.find("#receipt-box").exists()).toBe(false);
    expect(wrapper.find("#logs-box").exists()).toBe(false);
    expect(wrapper.vm.cart.items.length).toBe(0);
  });

  it("click #logout-button then render LOGIN state", async () => {
    const resp = {};
    axios.get.mockResolvedValue(resp);
    const wrapper = shallowMount(App);
    const button = wrapper.find("#logout-button");
    await button.trigger("click");
    expect(wrapper.vm.token).toBeNull();
    expect(wrapper.find("#login-box").exists()).toBe(true);
    expect(wrapper.find("#nav-box").exists()).toBe(false);
    expect(wrapper.find("#checkout-box").exists()).toBe(false);
    expect(wrapper.find("#receipt-box").exists()).toBe(false);
    expect(wrapper.find("#logs-box").exists()).toBe(false);
  });
});
