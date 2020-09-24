import { shallowMount } from "@vue/test-utils";
import CartItemBox from "@/components/CartItemBox";

describe("CartItemBox", () => {
  const thb = jest.fn((x) => x + "THB");
  
  it("render with no discount", () => {
    const wrapper = shallowMount(CartItemBox, {
      propsData: {
        index: 0,
        item: {
          product: {
            cover: "cover_value",
            title: "title_value",
            price: 100,
            id: "id_value",
          },
          price: 100,
        },
      },
      mocks: {
        thb: thb,
      },
    });
    expect(wrapper.find(".cart-item-index").text()).toBe(1 + "");
    expect(wrapper.find(".cart-item-cover img").attributes("src")).toBe(
      "cover_value"
    );
    expect(wrapper.find(".cart-item-title").text()).toBe("title_value");
    expect(wrapper.find(".cart-item-price").text()).toBe(100 + "THB");
    wrapper.find(".remove-from-cart button").trigger("click");
    expect(wrapper.emitted()["remove-from-cart"][0][0]).toBe(0);
  });

  it("render with discount", () => {
    const wrapper = shallowMount(CartItemBox, {
      propsData: {
        index: 0,
        item: {
          product: {
            cover: "cover_value",
            title: "title_value",
            price: 100,
            id: "id_value",
          },
          price: 90,
        },
      },
      mocks: {
        thb: thb,
      },
    });
    expect(wrapper.find(".cart-item-index").text()).toBe(1 + "");
    expect(wrapper.find(".cart-item-cover img").attributes("src")).toBe(
      "cover_value"
    );
    expect(wrapper.find(".cart-item-title").text()).toBe("title_value");
    expect(wrapper.find(".cart-item-normal-price").text()).toBe(100 + "THB");
    expect(wrapper.find(".cart-item-discount-price").text()).toBe(90 + "THB");
    expect(wrapper.find(".cart-item-percent-discount").text()).toBe("-10%");
    wrapper.find(".remove-from-cart button").trigger("click");
    expect(wrapper.emitted()["remove-from-cart"][0][0]).toBe(0);
  });
});
