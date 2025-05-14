const service = require('../services/analysesService.js');

module.exports.funcanalyses = function funcanalyses(req, res) {
    service.funcanalyses(req, res);
}

