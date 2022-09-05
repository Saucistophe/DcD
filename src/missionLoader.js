import gameData from './assets/missions/detective.yml'

// Processes the text definition of the mission map, into a 2D array of characters.
function mapTo2dArray (inputMap) {
  var currentMap = []
  if (!inputMap || inputMap === '') { return currentMap }

  var currentLines = inputMap.split('\n')
  currentLines = currentLines.reverse()
  var maxLine = 0

  // Get max width
  for (let line of currentLines) { maxLine = Math.max(maxLine, line.length) }

  // Retrieve all lines, filled with asterisks as a placeholders.
  for (let lineIndex in currentLines) {
    let line = currentLines[lineIndex]
    var currentLineChars = line.split('')

    for (let charIndex = 0; charIndex < maxLine; charIndex++) {
      if (!currentMap[charIndex]) { currentMap[charIndex] = [] }
      currentMap[charIndex][lineIndex] = charIndex < currentLineChars.length ? currentLineChars[charIndex] : '*'
    }
  }

  return currentMap
}

function getAllMissionsDescriptions () {
  // Retrieve the game data.
  var theme = 'detective'

  // Load the game's CSS theme.
  var link = document.createElement('link')
  link.setAttribute('rel', 'stylesheet')
  link.setAttribute('type', 'text/css')
  link.setAttribute('href', `css/${theme}.css`)
  document.getElementsByTagName('head')[0].appendChild(link)

  // Extract missions text data.
  for (let mission of gameData.missions) {
    let currentMap = mapTo2dArray(mission.map)

    for (let card of mission.cards) {
      // Handle scripts if the paragraphs contains <scriptName> tags.
      for (let paragraphIndex in card.paragraphs) {
        let paragraph = card.paragraphs[paragraphIndex]
        // Count the number of matches to ensure there are enough closing tags.
        let openingSpans = paragraph.match(/<(\w*)>/g)
        let closingSpans = paragraph.match(/<\/>/g)
        let numberOfOpeningSpans = openingSpans ? openingSpans.length : 0
        let numberOfClosingSpans = closingSpans ? closingSpans.length : 0
        if (numberOfClosingSpans > numberOfOpeningSpans) { alert(`Too many closing tabs for paragraph ${paragraphIndex} in card ${card.title}`) }

        // Put in opening and closing tags.
        paragraph = paragraph.replace(/<(\w*)>/g, '<span script="$1">')
        paragraph = paragraph.replace(/<\/>/g, '</span>')
        for (let i = numberOfOpeningSpans; i < numberOfClosingSpans; i++) { paragraph += '</span>' }

        card.paragraphs[paragraphIndex] = { text: paragraph }
      }

      // Look for adjacent cards in the map.
      if (currentMap) {
        var currentCardX = -1, currentCardY = -1
        for (var i = 0; i < currentMap.length; i++) {
          for (var j = 0; j < currentMap[i].length; j++) {
            if (currentMap[i][j] === card.index) {
              currentCardX = i
              currentCardY = j
            }
          }
        }

        var width = currentMap.length
        var height = width === 0 ? 0 : currentMap[0].length
        // Top
        if (currentCardY < height - 1 &&
				currentMap[currentCardX][currentCardY + 1].match(/[a-zA-Z]/i)) { card.top = currentMap[currentCardX][currentCardY + 1] }
        // Right
        if (currentCardX < width - 1 &&
				currentMap[currentCardX + 1][currentCardY].match(/[a-zA-Z]/i)) { card.right = currentMap[currentCardX + 1][currentCardY] }
        // Bottom
        if (currentCardY > 0 &&
				currentMap[currentCardX][currentCardY - 1].match(/[a-zA-Z]/i)) { card.bottom = currentMap[currentCardX][currentCardY - 1] }
        // Left
        if (currentCardX > 0 &&
				currentMap[currentCardX - 1][currentCardY].match(/[a-zA-Z]/i)) { card.left = currentMap[currentCardX - 1][currentCardY] }
      }

      // Process confidentiality thingies.
      if (card.confidential) {
        if (card.confidential.includes('♂')) { card.confidential = 'him' } else if (card.confidential.includes('♀')) { card.confidential = 'her' } else if (card.confidential.includes('⚤')) { card.confidential = 'both' }
      }
    }

    // Check from the local storage if the mission is active.
    mission.active = !!localStorage[mission.name]
  }

  return gameData.missions
}

export { mapTo2dArray, getAllMissionsDescriptions }
