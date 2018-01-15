const db = require('../database/db.service');

module.exports = (router) => {

  /**
   * GET all employers from the database
   */
  router.get('/employer', (req, res) => {
    db.getAllPersons((err, response, fields) => {
      if (err) res.status(400).send(err);
      else res.send(response);
    });
  });

};
