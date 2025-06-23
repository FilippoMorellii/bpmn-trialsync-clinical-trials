module.exports.funcanalysesanalysisId = function funcanalysesanalysisId(req, res) {
    const outcomes = ["SCIENTIFICALLY_RELEVANT", "INCONCLUSIVE_TRIAL"];
    const randomIndex = Math.random() < 0.5 ? 0 : 1;
    
    res.send({
        analysis_response: outcomes[randomIndex]
    });
};