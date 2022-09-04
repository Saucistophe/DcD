<template>
	<svg viewBox="0 0 100 100" class="shield">

		<!-- <circle cx="50" cy="50" r="50" :fill="color.lightColor"/> -->

		<longShadow :shadowAngleDegrees="30" :shadowLength="30" :x1="10" :y1="10" :x2="10" :y2="70"/>
		<longShadow :shadowAngleDegrees="30" :shadowLength="30" :x1="10" :y1="70" :x2="50" :y2="100"/>
		<longShadow :shadowAngleDegrees="30" :shadowLength="30" :x1="50" :y1="100" :x2="90" :y2="70"/>

		<path d="M10 10 L10 70 L50 100 V10 Z" fill="#333B"/>
		<path d="M50 10 L50 100 L90 70 V10 Z" fill="#DDDC"/>

		<!-- <text x="50" y="50">{{type}}</text> -->
	</svg>
</template>

<script type="text/javascript">
import Shadow from './Shadow.vue'
import Utils from '../utils.js'

export default {
  data: function () {
    return {}
  },
  components: {
    longShadow: Shadow
  },
  props: {
    type: Number
  },
  computed: {
    color () {
      return Utils.colorFromType(this.type)
    }
  }
}
</script>

<style>
.shield
{
	z-index: 10;
	width: 50%;
	height: 100%;
	margin: 1%;
}
</style>
