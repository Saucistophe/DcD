<template>
  <div id="app">
    <div id="missionsChooser">
      <h2>Missions</h2>
      <div v-for="(mission, index) in missions" :key="index">
        <input type="checkbox"
        :name="mission.name"
        :value="mission.name"
        :id="mission.name + '-checkbox'"
        :checked="mission.active"
        v-on:change="changeMissionVisibility(mission)"/>
        <label :for="mission.name + '-checkbox'">{{mission.name}}</label>
      </div>
      <button v-on:click="eventBus.$emit('computeFontSize')">Update font sizes</button>
    </div>
    <!-- Non-combat cards -->
    <template v-for="(chunk, pageIndex) in cardChunks">
      <!-- Recto -->
      <div class="page" :key="'recto-'+ pageIndex">
        <card v-for="(card, index) in chunk"
          :recto="true"
          :eventBus="eventBus"
          v-bind="card"
          :key="index"
          ></card>
      </div>
      <!-- Verso -->
      <div class="page" :key="'verso-'+ pageIndex">
        <card v-for="(card, index) in chunk"
          :recto="false"
          :eventBus="eventBus"
          v-bind="card"
          :key="index"
          ></card>
      </div>
    </template>
    <!-- Combat cards -->
    <template v-for="(chunk, pageIndex) in combatCardChunks">
      <!-- Recto -->
      <div class="page" :key="'combat-recto-'+ pageIndex">
        <combat-card v-for="(card, index) in chunk"
          :recto="true"
          v-bind="card"
          :key="index"
          ></combat-card>
      </div>
      <!-- Verso -->
      <div class="page" :key="'combat-verso-'+ pageIndex">
        <combat-card v-for="(card, index) in chunk"
          :recto="false"
          v-bind="card"
          :key="index"
          ></combat-card>
      </div>
    </template>
  </div>
</template>

<script>
import * as MissionLoader from '../missionLoader.js'
import Vue from 'vue'
import Card from './Card.vue'
import CombatCard from './CombatCard.vue'

export default {
  components: {
    'card': Card,
    'combat-card': CombatCard
  },
  data: function () {
    return {
      missions: MissionLoader.getAllMissionsDescriptions(),
      eventBus: new Vue()
    }
  },
  computed: {
    cardChunks: function () {
      var result = []
      var currentChunk = result[0]
      let insertedCards = 0
      for (let mission of this.missions) {
        if (!mission.active) { continue }

        for (let card of mission.cards) {
          if (card.type === 'combat' || mission.type === 'combat') { continue }

          // Start a new page if needed.
          if (insertedCards % 9 === 0) {
            result.push([])
            currentChunk = result[result.length - 1]
          }
          card.missionName = mission.name

          currentChunk.push(card)
          insertedCards++
        }
      }
      return result
    },
    combatCardChunks: function () {
      var result = []
      var currentChunk = result[0]
      let insertedCards = 0
      for (let mission of this.missions) {
        if (!mission.active || mission.type !== 'combat') { continue }

        for (let card of mission.cards) {
          // Start a new page if needed.
          if (insertedCards % (9 * 2) === 0) {
            result.push([])
            currentChunk = result[result.length - 1]
          }
          card.missionName = mission.name

          currentChunk.push(card)
          insertedCards++
        }
      }
      return result
    }
  },
  methods: {
    changeMissionVisibility (mission) {
      mission.active = !mission.active
      localStorage[mission.name] = mission.active
    }
  }
}
</script>

<style>
body
{
  background: #222222;
  font-size: 3.6mm;
  /* The body occupies all HMTL space. */
  margin: 0;
}

#app
{
  /* The app occupies all HMTL space. The rest flows in the scroll, and is snappable! */
  height: 100vh;
  overflow: auto;
  scroll-snap-type: y proximity;
}

.page
{
  width: 21cm;
  height: 29.7cm;

  margin: 0 auto;
  margin-bottom: 1cm;

  background: #444444;
  box-shadow: 0 0 1cm rgba(0,0,0,0.5);

  display: flex;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;

  page-break-after:always;
  scroll-snap-align: start;
}

.page *
{
  box-sizing: border-box;
}

/* Even pages are layed out backwards, for recto-verso printing.*/
.page:nth-of-type(even)
{
  flex-flow: row-reverse wrap;
}

.card
{
  width: 2.5in;
  height: 3.5in;

  background: white;
  overflow:hidden;

  border-radius: 2mm;
  border: 2px solid black;

  display: flex;
  flex-flow: column;
  justify-content: center;
  position: relative;
  /*align-items: center;*/
}

.card p
{
  margin : 0.5em;
  text-align: left;
}

/* Verso pages */
.card.verso
{
  position:relative;
  align-items: center;
  text-align: center;
  font-size: 8mm;
}

div[position]
{
  position:absolute;
  color: darkGray;
  font-size: 70%;
}

div[position]:after
{
  font-size: 70%;
}

div[position="top"   ]{top: 0.1em;    right:  30%; }
div[position="right" ]{right: 0.1em;  bottom: 30%; }
div[position="bottom"]{bottom: 0.1em; right:  30%; }
div[position="left"  ]{left: 0.1em;   top:    30%; }
div[position="top"   ]:after{content: "⇧"; vertical-align: top; }
div[position="right" ]:after{content: "⇨"; display: block; margin-top: -0.5em; }
div[position="bottom"]:after{content: "⇩"; }
div[position="left"  ]:after{content: "⇦"; display: block; margin-top: -0.5em; }

.cardMission
{
  position:absolute;
  top: 0;
  left: 0;
  margin: 0.3em;
  font-size: 70%;
  color: gray;
}

.cardIndex
{
  position:absolute;
  bottom: 0;
  right: 0;
  margin: 0.3em;
  padding: 0.2em 0.2em 0 0.2em; /*Compensate the bottom descent room*/
  font-size: 70%;
  color: #404040;
  border: 0.5mm solid darkGray;
  border-radius: 50%;
}

#missionsChooser
{
  position: fixed;
  background: rgba(255,255,255,0.4);
  padding: 1em;
  border-radius: 2em;

  overflow: hidden;
  width: 1em;
  opacity: 0.1;
  transition: all 0.6s ease-in-out;
}

#missionsChooser div
{
  width: 30vw;
}

#missionsChooser h2
{
  margin: 0.1em;
}

#missionsChooser:hover
{
  width: 30%;
  opacity: 1;
}

@media print
{
  body, .page
  {
    background: transparent;
    margin: 0 0 0 0;
    box-shadow: none;
  }

  #missionsChooser
  {
    display: none;
  }
}

/* Small screens */
@media screen and (max-width: 640px)
{
  .page
  {
    width: 100%;
    height: auto;
  }
}

</style>
