<!--
 * @Description: index页布局
 * @Author: 毛瑞
 * @Date: 2019-06-18 15:58:46
 -->
<template>
  <body>
    <Transition
      appear
      name="fade"
    >
      <KeepAlive>
        <RouterView />
      </KeepAlive>
    </Transition>
    <!-- 导航 -->
    <div :class="$style.array">
      <i @mouseenter="showNav = true" />
    </div>
    <Transition
      appear
      name="flip"
    >
      <div
        v-show="showNav"
        :class="$style.nav"
        @mouseleave="showNav = false"
      >
        <routerLink
          v-for="item in LINK"
          :key="item.name"
          :to="item.to"
        >
          <img :src="item.src">
          <h4>{{ item.name }}</h4>
        </routerLink>
      </div>
    </Transition>
  </body>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator'

import ROUTER from '@/config/router/index'

// 选项顺序: https://cn.vuejs.org/v2/style-guide/#组件-实例的选项的顺序-推荐
@Component
export default class extends Vue {
  // data()
  private showNav: boolean = false

  // computed
  get LINK() {
    return [
      {
        name: ROUTER.home.title,
        src: require('@index/assets/home.png'),
        to: '/' + ROUTER.home.name,
      },
      {
        name: ROUTER.about.title,
        src: require('@index/assets/about.png'),
        to: '/' + ROUTER.about.name,
      },
    ]
  }
}
</script>

<style lang="scss" module>
.nav {
  width: 100%;
  bottom: 5px;
  position: absolute;
  text-align: center;
  box-sizing: border-box;
  background-color: $colorBackGround;
  border: 1px solid $colorHighlight;

  > a {
    margin: 25px;
    color: $colorLightGrey;
    display: inline-block;

    &:hover {
      color: $colorText;
      text-decoration: none;
    }

    > img {
      height: 150px;
    }
  }
}

.array {
  bottom: 10px;
  width: 100%;
  position: absolute;
  text-align: center;

  > i {
    padding: 6px;
    display: inline-block;
    border: solid $colorHighlight;
    border-width: 0 2px 2px 0;
    animation: float 1s infinite ease-out;

    @keyframes float {
      0% {
        transform: rotate(-135deg) translate3d(-5px, -5px, 0);
      }

      100% {
        transform: rotate(-135deg) translate3d(5px, 5px, 0);
      }
    }
  }
}
</style>

<style lang="scss">
/// 全局样式 ///
@import '~@/scss/reset.scss';
@import '~@/scss/icons.scss';
@import '~@/scss/transitions.scss';
</style>
