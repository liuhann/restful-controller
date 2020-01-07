const debug = require('debug')('wind:mongo')
const MongoClient = require('mongodb').MongoClient

/**
 * Mongodb service which hold one mongo client instance
 */
class MongodbService {
  constructor ({url, dbName}) {
    this.url = url
    this.dbName = dbName
  }

  async connect () {
    try {
      debug('mongodb connecting ', this.url)
      // Use connect method to connect to the Server
      this.client = await MongoClient.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      })
      debug('mongodb connected')
    } catch (err) {
      debug('mongo db connect failed')
      // console.log(err.stack);
      if (this.client) {
        this.client.close()
      }
    }
  }

  async getDb (dbName) {
    return this.client.db(dbName || this.dbName)
  }

  async ensureSequence (name, start) {
    const db = await this.getDb()
    const one = await db.collection('counter').findOne({
      _id: name
    })
    if (!one) {
      await db.collection('counter').insertOne({
        _id: name,
        seq: start
      })
    }
  }

  async getNextSequence (name) {
    var ret = await this.getDb().collection('counter').findOneAndUpdate({
      _id: name
    }, {
      $inc: { seq: 1 }
    })
    return ret.seq
  }
}

module.exports = MongodbService
