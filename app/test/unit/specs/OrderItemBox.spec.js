import { shallowMount } from "@vue/test-utils";
import OrderItemBox from "@/components/OrderItemBox";

describe("OrderItemBox", () => {
  const thb = jest.fn((x) => x + "THB");
  it("render with no discount", () => {
    const wrapper = shallowMount(OrderItemBox, {
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
    expect(wrapper.find(".order-item-index").text()).toBe(1 + "");
    expect(wrapper.find(".order-item-title").text()).toBe("title_value");
    expect(wrapper.find(".order-item-price").text()).toBe(100 + "THB");
    // expect(wrapper.find(".order-item-discount").text()).toBe(100 + "THB");
    expect(wrapper.find(".order-item-discount-price").text()).toBe(100 + "THB");
  });

  it("render with discount", () => {
    const wrapper = shallowMount(OrderItemBox, {
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
    expect(wrapper.find(".order-item-index").text()).toBe(1 + "");
    expect(wrapper.find(".order-item-title").text()).toBe("title_value");
    expect(wrapper.find(".order-item-price").text()).toBe(100 + "THB");
    expect(wrapper.find(".order-item-discount").text()).toBe("-" + 10 + "THB");
    expect(wrapper.find(".order-item-discount-price").text()).toBe(90 + "THB");
  });
});
