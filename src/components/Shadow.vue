<template>
	<g>
		<linearGradient :id="'shadow-gradient-'+_uid" gradientUnits="userSpaceOnUse"
			:x1="(x1+x2)/2" :y1="(y1+y2)/2" :x2="(x1+x2)/2+shadowOffset.x" :y2="(y1+y2)/2+shadowOffset.y">
			<stop offset="0%" style="stop-color:#00000060"/>
			<stop offset="80%" style="stop-color:#00000010"/>
			<stop offset="100%" style="stop-color:#00000000"/>
<!-- 			<stop offset="0%" style="stop-color:red"/>
			<stop offset="90%" style="stop-color:blue"/>
			<stop offset="91%" style="stop-color:green"/> -->
		</linearGradient>
		<path :d="path"	:fill="'url(#shadow-gradient-'+_uid+')'"/>
	</g>
</template>

<script type="text/javascript">
module.exports = {
  props: {
    shadowAngleDegrees: {
      type: Number,
      required: true
    },
    shadowLength: {
      type: Number,
      required: true
    },
    x1: {
      type: Number,
      required: true
    },
    y1: {
      type: Number,
      required: true
    },
    x2: {
      type: Number,
      required: true
    },
    y2: {
      type: Number,
      required: true
    }
  },
  computed: {
    shadowAngle: function () {
      return (this.shadowAngleDegrees + 90) * (Math.PI / 180)
    },
    shadowOffset: function () {
      // Remove the part non-perpendicular to the edge
      let gradientDirection = {
        x: this.y1 - this.y2,
        y: this.x2 - this.x1
      }

      let dotProduct = this.shapeOffset.x * gradientDirection.x + this.shapeOffset.y * gradientDirection.y
      let gradientNorm = gradientDirection.x * gradientDirection.x + gradientDirection.y * gradientDirection.y

      let offset = gradientDirection
      offset.x *= dotProduct / gradientNorm
      offset.y *= dotProduct / gradientNorm

      return offset
    },
    shapeOffset: function () {
      return {
        x: this.shadowLength * Math.cos(this.shadowAngle),
        y: this.shadowLength * Math.sin(this.shadowAngle)
      }
    },
    path: function () {
      return `M${this.x1} ${this.y1} L${this.x2} ${this.y2} L${this.x2 + this.shapeOffset.x} ${this.y2 + this.shapeOffset.y} L${this.x1 + this.shapeOffset.x} ${this.y1 + this.shapeOffset.y} Z`
    }
  }
}
</script>
