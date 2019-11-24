<template>
	<svg v-html="backgroundSvg()" class="backgroundSvg" :viewBox="'5 5 ' + actualWidth*0.95 + ' ' + actualHeight*0.95"></svg>
</template>

<script type="text/javascript">
import Trianglify from 'trianglify';

export default {
  props: {
    'backgroundWidth': Number,
    'backgroundHeight' : Number,
    'cellSize' : {
      type: Number,
      default: 30
    },
    'variance' : {
      type: Number,
      default: 0.75
    },
    'seed': {
      type: Number,
      default: null
    },
    'xColors': {
      type: [Array,Boolean,String],
      default: 'random'
    },
    'yColors': {
      type: [Array,Boolean,String],
      default: 'match_x'
    },
    'colorFunction' : Function,
    'strokeWidth': {
      type: Number,
      default: 0.6
    }
  },
  computed: {
    actualWidth() {
      return this.backgroundWidth || 100;
    },
    actualHeight() {
      return this.backgroundHeight || 100;
    }
  },
  methods: {
    backgroundSvg: function() {
      let pattern = Trianglify({
        width: this.actualWidth,
        height: this.actualHeight,
        cell_size: this.cellSize,
        variance: this.variance,
        seed: this.seed,
        x_colors: this.xColors,
        y_colors: this.yColors,
        stroke_width: this.strokeWidth
      });
      return pattern.svg().innerHTML;
    }
  }
};
</script>

<style>
.backgroundSvg
{
	position: absolute;
	/*opacity: 0.65;*/
	top: 0;
	left: 0;
	height: 100%;
	width: 100%;
}
</style>