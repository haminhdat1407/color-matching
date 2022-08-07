import { GAME_STATUS, GAME_TIME, PAIRS_COUNT } from './constants.js'
import {
  getColorElementList,
  getColorListElement,
  getInActiveColorList,
  getPlayAgainButton,
} from './selectors.js'
import {
  createTimer,
  getRandomColorPairs,
  hinePlayAgainButton,
  setTimerText,
  showPlayAgainButton,
  setBackgroundColor,
} from './utils.js'

// Global variables
let selections = []
let gameStatus = GAME_STATUS.PLAYING
let timer = createTimer({
  seconds: GAME_TIME,
  onChange: handleTimeChange,
  onFinish: handleTimerFinish,
})

function handleTimeChange(second) {
  const fullSecond = `0${second}`.slice(-2)
  setTimerText(fullSecond)
}
function handleTimerFinish() {
  //end game
  gameStatus = GAME_STATUS.FINISHED
  setTimerText('Game Over')
  showPlayAgainButton()
}
// TODOs
// 1. Generating colors using https://github.com/davidmerfield/randomColor
// 2. Attach item click for all li elements
// 3. Check win logic
// 4. Add timer
// 5. Handle replay click

function handleColorClick(liElement) {
  const shouldBloclClick = [GAME_STATUS.BLOCKING, GAME_STATUS.FINISHED].includes(gameStatus)
  const isClicked = liElement.classList.contains('active')
  if (!liElement || shouldBloclClick || isClicked) return

  //show clicked cell to selections
  liElement.classList.add('active')

  //save clicked cell to selections
  selections.push(liElement)
  if (selections.length < 2) return

  //check match
  const firstColor = selections[0].dataset.color
  const secondColor = selections[1].dataset.color
  const isMatch = firstColor === secondColor

  if (isMatch) {
    // can use either first or second color (as they are the same)
    setBackgroundColor(firstColor)
    //check win
    const isWin = getInActiveColorList().length === 0
    if (isWin) {
      showPlayAgainButton()
      setTimerText('YOU WIN!!')
      timer.clear()
      gameStatus = GAME_STATUS.FINISHED
      //show you win
      console.log('you win')
    }

    selections = []

    return
  }
  //in case of not match
  //remove active class for 2 li element
  gameStatus = GAME_STATUS.BLOCKING

  setTimeout(() => {
    selections[0].classList.remove('active')
    selections[1].classList.remove('active')
    selections = []
    if (gameStatus !== GAME_STATUS.FINISHED) {
      gameStatus = GAME_STATUS.PLAYING
    }
  }, 500)

  //reset selections for the next turn
}
function initColors() {
  //random 8 pairs of colors
  const colorList = getRandomColorPairs(PAIRS_COUNT)
  //bind to li >div.overlay
  const liList = getColorElementList()
  liList.forEach((liElement, index) => {
    liElement.dataset.color = colorList[index]
    const overlayElement = liElement.querySelector('.overlay')
    if (overlayElement) overlayElement.style.backgroundColor = colorList[index]
  })
}
function attachEventForColorList() {
  const ulElement = getColorListElement()
  if (!ulElement) return
  ulElement.addEventListener('click', (e) => {
    if (e.target.tagName !== 'LI') return
    handleColorClick(e.target)
  })
}
function resetGame() {
  //reset global vars
  gameStatus = GAME_STATUS.PLAYING
  gameStatus = []
  //reset DOM elements
  //remove active class from li
  //hide replay button
  //clear you window/timeout text
  const colorElementList = getColorElementList()
  for (const colorElement of colorElementList) {
    colorElement.classList.remove('active')
  }
  hinePlayAgainButton()
  setTimerText('')

  //re-generate new colors
  initColors()

  //start a new game
  startTimer()
}
function attachEventForPlayAgainButton() {
  const playAgainButton = getPlayAgainButton()
  if (!playAgainButton) return
  playAgainButton.addEventListener('click', resetGame)
}
function startTimer() {
  timer.start()
}
//MAIN
;(() => {
  initColors()
  // reset background color
  setBackgroundColor('goldenrod')
  attachEventForColorList()
  attachEventForPlayAgainButton()
  startTimer()
})()
