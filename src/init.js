const RestFulController = require('./restful-controller.js')

/**
 * init rest service with-in koa context and mongodb connection
 * @param {Application} app koa instance
 * @param {String} db Mongodb db name 
 * @param {String} coll collection name of mongodb 
 * @param {String} path rest url 
 * @param {*} noLogin 
 */
function initRestService (app, db, coll, path, noLogin) {
  const router = app.context.router
  app.context.services[coll + '.rest'] = new RestFulController({
    router,
    mongodb: app.context.services.mongodb,
    dbName: db,
    coll: coll,
    path: path,
    filter: noLogin === true ? null : app.middlewares.loginRequired
  })
}

module.exports = initRestService
