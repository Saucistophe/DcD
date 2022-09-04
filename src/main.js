import Vue from 'vue'
import App from './components/App.vue'
import TriangleBackground from './components/TriangleBackground.vue'

// Add a fast hashcode method for strings
String.prototype.hashCode = function () {
  var hash = 0, i, chr
  if (this.length === 0) return hash
  for (i = 0; i < this.length; i++) {
    chr = this.charCodeAt(i)
    hash = ((hash << 5) - hash) + chr
    hash |= 0 // Convert to 32bit integer
  }
  return hash
}

window.onload = function () {
  // Register the triangle background component globally, as it is used in several components.
  Vue.component('triangleBackground', TriangleBackground)

  // Start the vue app.
  new Vue({
    updated: function () {
      this.$nextTick(function () {
        /*
				var currentUrl = new URL(window.location.href);
				for(let mission of this.missions) {
					if(mission.active)
						currentUrl.searchParams.set(mission.name,'');
					else
						currentUrl.searchParams.delete(mission.name);
				}

				window.history.pushState('dummy content', window.title, currentUrl); */
      })
    },
    render: h => h(App)
  }).$mount('#app')
}
