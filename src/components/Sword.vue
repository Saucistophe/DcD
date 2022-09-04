<template>
	<svg viewBox="0 0 100 100" class="sword">

		<!-- <circle cx="50" cy="50" r="50" :fill="color.lightColor"/> -->
		<g :transform="'rotate(' + rotation + ' 50 50) translate(0 -10)'">
			<!-- Blade+hilt shadow -->
			<longShadow :shadowAngleDegrees="30 - rotation" :shadowLength="30" :x1="50" :y1="0" :x2="50" :y2="121"/>
			<longShadow :shadowAngleDegrees="30 - rotation" :shadowLength="30" :x1="30" :y1="80" :x2="30" :y2="88"/>
			<longShadow :shadowAngleDegrees="30 - rotation" :shadowLength="30" :x1="30" :y1="88" :x2="70" :y2="88"/>

			<!-- Sword blade -->
			<path d="M50 0 L50 80 L42 80 L42 8 Z" fill="#AAA"/>
			<path d="M50 0 L50 80 L58 80 L58 8 Z" fill="#D5D5D5"/>

			<!-- Sword guard -->
			<rect x="30" y="80" width="40" height="8" fill="#776"/>

			<!-- Pommel -->
			<line x1="50" y1="88" x2="50" y2="115" stroke-width="8" stroke="#655"/>
			<circle cx="50" cy="115" r="6" fill="#998" />

			<!-- <text x="50" y="50">{{type}}</text> -->
		</g>
	</svg>
</template>

<script type="text/javascript">
import Shadow from './Shadow.vue'
import Utils from '../utils.js'

export default {
  data: function () {
    return {
      rotation: -40
    }
  },
  props: {
    type: Number
  },
  components: {
    longShadow: Shadow
  },
  computed: {
    color () {
      return Utils.colorFromType(this.type)
    }
  }
}
</script>

<style>
.sword
{
	width: 50%;
	height: 100%;
	margin: 1%;
	z-index: 10;
}
</style>
