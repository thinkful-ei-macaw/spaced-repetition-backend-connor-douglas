const LinkedList = require('./list-algorithm')

const LanguageService = {
  getUsersLanguage(db, user_id) {
    return db
      .from('language')
      .select(
        'language.id',
        'language.name',
        'language.user_id',
        'language.head',
        'language.total_score'
      )
      .where('language.user_id', user_id)
      .first();
  },
  getLanguageWords(db, language_id) {
    return db
      .from('word')
      .select(
        'id',
        'language_id',
        'original',
        'translation',
        'next',
        'memory_value',
        'correct_count',
        'incorrect_count'
      )
      .where({ language_id });
  },

  updateWordsList: async function (db, wordsList) {
    let walk = wordsList.head;
    let trx = await db.transaction();
    try {
      while (walk.next) {
        await db('word').transacting(trx)
          .where('id', walk.value.id)
          .update({
            next: walk.next.value.id,
            memory_value: walk.value.memory_value,
            correct_count: walk.value.correct_count,
            incorrect_count: walk.value.incorrect_count
          });
        walk = walk.next;
      }
      await db('word').transacting(trx)
        .where('id', walk.value.id)
        .update({
          next: null,
          memory_value: walk.value.memory_value,
          correct_count: walk.value.correct_count,
          incorrect_count: walk.value.incorrect_count
        });
      trx.commit()
    } catch (e) {
      console.log(e)
      await trx.rollback()
    }
  },
  incrementTotalScore: async function (db, total_score, language_id) {
    let newScore = total_score + 1;
    let trx = await db.transaction()
    try {
      await db('language').transacting(trx)
        .where('id', language_id)
        .update({
          total_score: newScore
        });
      trx.commit()
    }
    catch(e) {
      console.log(e)
      await trx.rollback()
    }
  },
  getWordsList(db, language_id) {
    const words = await this.getLanguageWords(db, language_id);
    const wordsList = new LinkedList
    
  },
};

module.exports = LanguageService;
