<template>
	<div v-if="recto" class="card small-card combat recto" :style="style()">
		<p :script="paragraph.script" :key="paragraph.id" v-for="paragraph in paragraphs">{{ paragraph.text }}</p>
	</div>

	<div v-else class="card small-card combat verso" :style="versoStyle()">
		<sword :type="attack"></sword>
		<shield :type="defense"></shield>
	</div>
</template>

<script type="text/javascript">
import Sword from './Sword.vue';
import Shield from './Shield.vue';
import Card from './Card.vue';
import Trianglify from 'trianglify';

export default {
  mixins: [Card],
  components: {
    'sword': Sword,
    'shield': Shield,
  },
  props: {
    attack: Number,
    defense: Number,
    xColors: {
      type: Array,
    }
  },
  methods: {
    versoStyle() {

      let hues = [0,45,160,100];
      let attackColor = 'hsl(' + hues[this.attack] + ', 100%, 40%)';
      let defenseColor = 'hsl(' + hues[this.defense] + ', 100%, 40%)';
		
      // In development mode, a plain gradient is enough.
      if(process.env.NODE_ENV === 'development') {
        return `background: linear-gradient(to right, ${attackColor}, ${attackColor}, ${defenseColor}, ${defenseColor})`;
      }

      let pattern = Trianglify({
        width: 250,
        height: 165,
        cell_size: 20,
        variance: 0.75,
        seed: null,
        x_colors: [attackColor,attackColor,defenseColor,defenseColor],
        y_colors: ['white','black'],
        color_space: 'rgb',// rgb, hsv, hsl, hsi, lab and hcl
        stroke_width: 0.6
      });
      var svg = pattern.svg();
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');

      var svgHtml = svg.outerHTML;
      var encoded = window.btoa(svgHtml);
      return 'background:url(data:image/svg+xml;base64,'+encoded+')';
    }
  },
};
</script>

<style>
.combat.verso
{
	display: flex;
	position: relative;
	flex-direction: row;
}

.card.small-card
{
	width: 2.5in;
	height: 1.65in;
	position: relative;
}

</style>