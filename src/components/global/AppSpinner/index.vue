<template>
  <div class="app-spinner">
    <div></div>
    <div></div>
    <div></div>
    <div></div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'AppSpinner',

  setup() {
    return {}
  },
})
</script>

<style lang="less" scoped>
@keyframes rotate_pacman_half_up {
  0% {
    transform: rotate(270deg);
  }
  50% {
    transform: rotate(1turn);
  }
  to {
    transform: rotate(270deg);
  }
}
@keyframes rotate_pacman_half_down {
  0% {
    transform: rotate(90deg);
  }
  50% {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(90deg);
  }
}
@keyframes pacman-balls {
  75% {
    opacity: 0.7;
  }
  to {
    transform: translate(-100px, -6.25px);
  }
}
.app-spinner {
  position: fixed;
  width: 120px;
  height: 50px;
  top: 45%;
  left: 50%;
  z-index: 555;
  transform: translate(-50%);
  div {
    &:nth-child(1) {
      width: 0;
      height: 0;
      border: 25px solid @primary-color;
      border-right-color: transparent;
      border-radius: 25px;
      animation: rotate_pacman_half_up 0.5s 0s infinite;
    }
    &:nth-child(2) {
      width: 0;
      height: 0;
      border: 25px solid @primary-color;
      border-right-color: transparent;
      border-radius: 25px;
      animation: rotate_pacman_half_down 0.5s 0s infinite;
      margin-top: -50px;
    }
    &:nth-child(3),
    &:nth-child(4) {
      background-color: @primary-color;
      width: 15px;
      height: 15px;
      border-radius: 100%;
      margin: 2px;
      width: 10px;
      height: 10px;
      position: absolute;
      transform: translateY(-6.25px);
      top: 25px;
      left: 100px;
    }
    &:nth-child(3) {
      animation: pacman-balls 1s linear 0.33s infinite;
    }
    &:nth-child(4) {
      animation: pacman-balls 1s linear 0.66s infinite;
    }
  }
}
</style>
