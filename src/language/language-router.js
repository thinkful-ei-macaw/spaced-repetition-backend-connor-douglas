const express = require('express')
const LanguageService = require('./language-service')
const { requireAuth } = require('../middleware/jwt-auth')
const jsonBodyParser = express.json();

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
    


    if(!req.body.guess) {
      res.status(400).json({error: `Missing 'guess' in request body`})
    }

    if(req.body.guess !== translation){
      res.json({
        nextWord,
        totalScore,
        wordCorrectCount,
        wordIncorrectCount,
        "answer": translation,
        isCorrect: req.body.guess === translation
    })}

  })

module.exports = languageRouter
