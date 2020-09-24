import { shallowMount } from "@vue/test-utils";
import ProductBox from "@/components/ProductBox";

describe("ProductBox", () => {
  const thb = jest.fn((x) => x + "THB");

  it("render", () => {
    const wrapper = shallowMount(ProductBox, {
      propsData: {
        product: {
          cover: "cover_value",
          title: "title_value",
          price: "price_value",
          id: "id_value",
        },
      },
      mocks: {
        thb: thb,
      },
    });
    expect(wrapper.find(".product-cover img").attributes("src")).toBe(
      "cover_value"
    );
    expect(wrapper.find(".product-title").text()).toBe("title_value");
    expect(wrapper.find(".product-price").text()).toBe("price_value" + "THB");
    wrapper.find(".product-add-cart button").trigger("click");
    expect(wrapper.emitted()["add-to-cart"][0][0]).toBe("id_value");
  });
});
