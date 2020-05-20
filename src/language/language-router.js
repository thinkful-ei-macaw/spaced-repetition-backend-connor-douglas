const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();
const LinkedList = require('./list-algorithm')
const languageRouter = express.Router()

languageRouter
  .use(requireAuth)
  .use(async (req, res, next) => {
    try {
      const language = await LanguageService.getUsersLanguage(
        req.app.get('db'),
        req.user.id,
      )

      if (!language)
        return res.status(404).json({
          error: `You don't have any languages`,
        })

      req.language = language
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/', async (req, res, next) => {
    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id,
      )

      res.json({
        language: req.language,
        words,
      })
      next()
    } catch (error) {
      next(error)
    }
  })

languageRouter
  .get('/head', async (req, res, next) => {

    try {
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )
      const language = await LanguageService.getUsersLanguage(
          req.app.get('db'),
          req.user.id,
        )
      res.json({
        nextWord: words[0].original,
        totalScore: language.total_score,
        wordCorrectCount: words[0].correct_count,
        wordIncorrectCount: words[0].incorrect_count
      })
      next()
    } catch (error) {
      next(error)
    }

  })

languageRouter
  .post('/guess',jsonBodyParser, async (req, res, next) => {
    
      const words = await LanguageService.getLanguageWords(
        req.app.get('db'),
        req.language.id
      )

      const wordsList = new LinkedList();

      words.forEach(element => {
        wordsList.insertLast(element)
      });

      const language = await LanguageService.getUsersLanguage(
          req.app.get('db'),
          req.user.id,)

    
    async function comparingAndMoving(item, guess, m) {
      if(item.value.translation !== guess) {
        item.value.memory_value = 1;
        
      } else {
        item.value.memory_value = (m * 2);
        LanguageService.incrementTotalScore(req.app.get('db'), language.total_score, item.value.language_id)
      }
      wordsList.remove(item.value);

      wordsList.insertAt(item.value, item.value.memory_value)

    }

    let resObject;

    if(!req.body.guess) {
      res.status(400).json({error: `Missing 'guess' in request body`})
    }

    else if(req.body.guess !== words[0].translation){

    resObject = {
      nextWord: wordsList.head.next.value.original,
      totalScore: language.total_score,
      wordCorrectCount: wordsList.head.value.correct_count,
      wordIncorrectCount: ++wordsList.head.value.incorrect_count,
      answer: wordsList.head.value.translation,
      isCorrect: false
    }

    await comparingAndMoving(wordsList.head, req.body.guess, wordsList.head.value.memory_value)
    await LanguageService.updateWordsList(req.app.get('db'), wordsList)

    res.status(200).json({
      nextWord: resObject.nextWord,
      totalScore: resObject.totalScore,
      wordCorrectCount: resObject.wordCorrectCount,
      wordIncorrectCount: resObject.wordIncorrectCount,
      answer: resObject.answer,
      isCorrect: resObject.isCorrect
    })
  } else {
    res.send('i want to kill something')
  }
  })

module.exports = languageRouter