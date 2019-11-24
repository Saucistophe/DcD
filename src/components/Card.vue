<template>
  <div ref='divToResize' v-if="recto" class="card recto" :style="'font-size:'+fontAdjustmentPercentage+'%;'+style()">
    <p ref='paragraphs' :script="paragraph.script" :key="paragraph.id" v-for="paragraph in paragraphs" v-html="paragraph.text"></p>
  </div>

  <div v-else class="card verso" :locked="locked" :style="style()">

    <!-- Card info -->
    <div class="cardTitle">{{title}}</div>
    <div class="cardIndex">{{letterToInteger(index)}}</div>
    <div class="cardMission">{{missionName !== 'Root' ? missionName : ''}}</div>

    <!-- Confidential marker -->
    <div v-if="confidential" :confidential="confidential">CONFIDENTIEL</div>
    <div v-if="confidential === 'both'" confidential="both2">CONFIDENTIEL</div>

    <!-- Position markers -->
    <div v-if="top && letterToInteger(top) > letterToInteger(index)" position="top">{{letterToInteger(top)}}</div>
    <div v-if="right && letterToInteger(right) > letterToInteger(index)" position="right">{{letterToInteger(right)}}</div>
    <div v-if="bottom && letterToInteger(bottom) > letterToInteger(index)" position="bottom">{{letterToInteger(bottom)}}</div>
    <div v-if="left && letterToInteger(left) > letterToInteger(index)" position="left">{{letterToInteger(left)}}</div>
  </div>
</template>

<script type="text/javascript">
import Trianglify from 'trianglify';
import Simplex from 'perlin-simplex';

export default {
  data: function() {
    return {
      simplexNoise: new Simplex()
    };
  },
  props: {
    recto: Boolean,
    title: String,
    top: String,
    bottom: String,
    left: String,
    right: String,
    locked: {
      type: Boolean,
      default: false
    },
    paragraphs: Array,
    index: String,
    missionName: String,
    confidential: String,
    eventBus: Object
  },
  computed: {
    // Computes a unique hash, depending on the texxt content.
    hashCode() {
      let allParagraphsString = this.paragraphs.map(p=>(p.script||'')+p.text).join();
      return allParagraphsString.hashCode();
    },
    fontAdjustmentPercentage() {
      return localStorage[this.hashCode] || 100;
    }
  },
  methods: {
    letterToInteger: function(letter) {
      if(!letter)
        return 0;

      console.assert(letter.length === 1);

      // Compare to A to get a zero for A, 1 for B...
      var code = letter.charCodeAt(0) - 'A'.charCodeAt(0);
      if(code <= 25)
        return code;
      // Boom, room for 26 more by using lowercase. Makes up a nice round total of 52, just like a regular cards deck.
      else
        return 26 + letter.charCodeAt(0) - 'a'.charCodeAt(0);
    },
    colorFromPerlinValue(v) {
      let currentColor = 'hsl(';
      // Hue 20-40
      currentColor += Math.floor(20 + v * 20);
      currentColor += ',';
      // Saturation 20-50
      let saturation = Math.floor(20 + v * 30);
      currentColor += saturation;
      currentColor += '%,';
      currentColor += Math.floor(90 - 0.6 * saturation - 20 * v);
      currentColor += '%);';

      return currentColor;
    },
    colorFunction(x,y) {
      let randomValue = (3 * this.simplexNoise.noise(x,y) + this.simplexNoise.noise(x*2,y*2) + 4) / 8;
      return this.colorFromPerlinValue(randomValue,x,y);
    },
    style() {
      // In development mode, a plain color is enough - except for one card to check that it's working.
      if(process.env.NODE_ENV === 'development' && this.index !== 'A') {
        return 'background:' + this.colorFromPerlinValue(0.35);
      }
      
      // Generate a svg from trianglify and the perlin colors.
      let pattern = Trianglify({
        width: 250,
        height: 350,
        cell_size: 30,
        variance: 0.75,
        seed: null,
        color_function: this.colorFunction,
        stroke_width: 0.6
      });
      var svg = pattern.svg();
      svg.setAttribute('xmlns','http://www.w3.org/2000/svg');

      // Set it as style background.
      var svgHtml = svg.outerHTML;
      var encoded = window.btoa(svgHtml);
      return 'background:url(data:image/svg+xml;base64,'+encoded+')';
    },
    // Re-computes the font size adjustment depending on the text content, to fit the text inside all cards.
    computeFontSize() {
      let paragraphElements = this.$refs.paragraphs;
      if(!paragraphElements || !paragraphElements.length)
        return;

      let divToResize = this.$refs.divToResize;
      let firstParagraph = paragraphElements[0];

      // Usse dichotomy
      let dichotomyMinBound = 10;
      let dichotomyMaxBound = 1000;
      let percentage = 100;
      let iteration = 0;

      while( iteration++ < 20
        && (firstParagraph.offsetTop < 0
        || firstParagraph.offsetTop > divToResize.clientHeight /10))
      {
        // Font too big
        if(firstParagraph.offsetTop < 0)
          dichotomyMaxBound = percentage;
        // Font too small
        else
          dichotomyMinBound = percentage;
        
        percentage = (dichotomyMinBound + dichotomyMaxBound) / 2;

        divToResize.style.fontSize=''+percentage+'%';
      }
      // Store for efficient use
      localStorage[this.hashCode] = percentage;
      // Force update of computed values
      this.$forceUpdate();
    },
  },
  mounted() {
    if(this.eventBus)
      this.eventBus.$on('computeFontSize', this.computeFontSize);
  }
};
</script>

<style>
.card.verso[locked]
{
  background: white url(../assets/lock.svg) no-repeat center;
}
</style>