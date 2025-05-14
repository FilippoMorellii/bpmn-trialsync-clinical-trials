const service = require('../services/hospitalsService.js');

module.exports.funchospitals = function funchospitals(req, res) {
    service.funchospitals(req, res);
}

