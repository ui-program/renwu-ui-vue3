import { getToken, getUserInfo } from "@/utils/auth";
import { defineStore, acceptHMRUpdate } from "pinia";
import * as store from "store";
import * as UserAPI from "@/service/auto-service/账户模块";
import { sleep } from "@/utils/sleep";
import type { PwdLoginDto } from "@/service/auto-service/types";

export const useUserStore = defineStore("user", {
  state: () => ({
    token: getToken(),
    userInfo: getUserInfo(),
    isLogin: false,
    authFinished: false
  }),

  actions: {
    async logout() {
      store.remove('token');
      store.remove("userInfo");

      this.$patch({
        token: "",
        userInfo: null,
        isLogin: false,
        authFinished: false
      });
    },

    async login(params: PwdLoginDto) {
      try {
        const res = await UserAPI.pwdLogin(params);
        const data = res.data;
        this.$patch({
          token: data.token,
          userInfo: data,
        });
        store.set("token", data.token);
        store.set("userInfo", data);
        return true;
      } catch (e) {
        e;
        return false;
      }
    },

    async checkLogin () {
      try {
        const res = await UserAPI.checkLogin({});
        const data = res.data;
        await sleep();
        this.$patch({
          isLogin: data.status,
          authFinished: true
        });
        return data.status;
      } catch (e) {
        e;
        return false;
      }
    }
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useUserStore, import.meta.hot));
}
