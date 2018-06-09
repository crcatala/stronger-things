<template functional>
  <div :class="$style.spinner">
    <div :class="[$style.element, $style.element1]"></div>
    <div :class="[$style.element, $style.element2]"></div>
    <div :class="[$style.element, $style.element3]"></div>
  </div>
</template>

<script>
export default {
  name: "Spinner"
};
</script>

<style lang="scss" module>
@import "@/styles/variables.scss";
$spinner-size: 12px;
$spinner-speed-factor: 0.75;

.spinner {
  display: inline-block;
  width: $spinner-size * 3 + $spinner-size / 2 * 3;
  text-align: center;
}

.element {
  width: $spinner-size;
  height: $spinner-size;
  background-color: lighten($color-blue, 10%);
  margin-right: $spinner-size / 2;

  border-radius: 100%;
  display: inline-block;
  animation: spinner-animation $spinner-speed-factor * 1.4s infinite ease-in-out
    both;

  &:last-child {
    margin-right: 0;
  }
}

.element1 {
  animation-delay: $spinner-speed-factor * -0.32s;
}

.element2 {
  animation-delay: $spinner-speed-factor * -0.16s;
}

@-webkit-keyframes spinner-animation {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
  }
}

@keyframes spinner-animation {
  0%,
  80%,
  100% {
    -webkit-transform: scale(0);
    transform: scale(0);
  }
  40% {
    -webkit-transform: scale(1);
    transform: scale(1);
  }
}
</style>
