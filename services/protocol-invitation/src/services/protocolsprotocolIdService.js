module.exports.funcprotocolsprotocolId = function funcprotocolsprotocolId(req, res) {
    res.send({
        id: "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        title: "Study on the efficacy of Drug X",
        objectives: "Evaluate the efficacy and safety of Drug X in patients with condition Y",
        methodology: "Randomized double-blind placebo-controlled clinical trial",
        minParticipants: 8,
        status: "DRAFT"
    });
}
