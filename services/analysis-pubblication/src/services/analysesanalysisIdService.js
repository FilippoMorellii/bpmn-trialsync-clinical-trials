module.exports.funcanalysesanalysisId = function funcanalysesanalysisId(req, res) {
    const outcomes = ["SCIENTIFICALLY_RELEVANT", "INCONCLUSIVE"];
    const randomIndex = Math.random() < 0.5 ? 0 : 1;
    
    res.send({
        analysis_result: outcomes[randomIndex]
    });
};