import { shallowMount } from "@vue/test-utils";
import UserLogBox from "@/components/UserLogBox";

describe("UserLogBox", () => {
  it("render", () => {
    const wrapper = shallowMount(UserLogBox, {
      propsData: {
        user_log: {
          time: "time_value",
          user: {
            name: "name_value",
            picture: "picture_value",
          },
        },
      },
      mocks: {
        dateFormat: jest.fn((x) => "dateFormat:" + x),
      },
    });
    expect(wrapper.find(".user-log-time").text()).toBe("dateFormat:time_value");
    expect(wrapper.find(".user-log-picture img").attributes("src")).toBe(
      "picture_value"
    );
    expect(wrapper.find(".user-log-name").text()).toBe("name_value");
  });
});
