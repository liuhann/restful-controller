/**
 * The client for rest controller
 */
export default class RestClient {
  constructor (ctx, path) {
    this.ctx = ctx
    this.path = path
  }

  /**
   * Serialize request param to querystring
   * @param {Object} obj
   */
  serialize (obj) {
    var str = []
    for (var p in obj) {
      if (obj.hasOwnProperty(p) && obj[p]) {
        str.push(encodeURIComponent(p) + '=' + encodeURIComponent(obj[p]))
      }
    }
    return str.join('&')
  }

  /**
   * Get one object by id
   * @param {String} id
   */
  async getOne (id) {
    const result = await this.ctx.get(`${this.path}/${id}`).json()
    return result
  }

  /**
   * list documents with a query filter
   * @param {Object} filter
   */
  async list (filter) {
    const result = await this.ctx.get(`${this.path}?${this.serialize(filter)}`).json()
    return result
  }

  /**
   * Create or patch an object
   * @param {Object} o
   */
  async createOrPatch (o) {
    if (o._id) {
      return this.patch(o._id, o)
    } else {
      // in case of o._id === ''
      delete o._id
      return this.create(o)
    }
  }

  /**
   * Create an object
   * @param {Object} o
   */
  async create (o) {
    return (await this.ctx.post(`${this.path}`, {
      json: o
    })).json()
  }

  /**
   * Query object with props with regex support
   * @param {*} prop
   * @param {*} value
   * @param {*} limit
   */
  async regex (prop, value, limit) {
    const result = await this.ctx.get(`${this.path}/regex/${prop}/${value}?limit=${limit || 1000}`, {}).json()
    return result
  }

  /**
   * Patch/Update object
   * @param {String} id
   * @param {Object} json
   */
  async patch (id, json) {
    await this.ctx.ky.patch(`${this.path}/${id}`, {
      json
    })
  }

  /**
   * delete object
   * @param {Object} o
   */
  async delete (o) {
    let result = null
    if (typeof o === 'string') {
      result = await this.ctx.delete(`${this.path}/${o}`).json()
    } else if (typeof o === 'object') {
      result = await this.ctx.delete(`${this.path}/${o._id}`).json()
    }
    return result
  }
  /**
   * get field disincts
   * @param {String} field
   */
  async distinct (field) {
    const result = await this.ctx.get(`${this.path}/distinct/${field}`).json()
    return result
  }
}
