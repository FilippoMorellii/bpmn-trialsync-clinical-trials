//TODO AGGIUNGERE DEI CONSOLE LOG PER STAMPARE I RISULTATI MOCK
// Importa classe di Zeebe
const { ZBClient } = require("zeebe-node");

// Configurazione client Zeebe, nuovo oggetto
const zbc = new ZBClient({
  gatewayAddress: process.env.ZEEBE_ADDRESS || "localhost:26500", // Usa ZEEB_ADDRESS oppure l'altro indirizzo
  useTLS: false,
});

//! SIMULAZIONE SERVIZI*****************************************************************************************/

// Servizio di invio email/messaggi
class NotificationService {
  static async sendInvitation(hospitalId, protocolData, phase) {
    console.log(`Sending ${phase} invitation to hospital ${hospitalId}`);

    // Simulazione invio - in un caso reale si userebbe un servizio email/SMS
    const invitation = {
      hospitalId,
      protocol_id: protocolData.protocol_id,
      phase,
      sentAt: new Date().toISOString(),
      deadline: protocolData.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 giorni
    };

    console.log(`Invitation sent successfully to ${hospitalId}`);
    return invitation;
  }

  static async sendCancellation(hospitalId, protocol_id) {
    console.log(`Sending trial cancellation notice to hospital ${hospitalId}`);

    console.log(`Cancellation notice sent to ${hospitalId}`);
    return {
      hospitalId,
      protocol_id,
      cancelledAt: new Date().toISOString(),
    };
  }
}

// Simulazione di un servizio di raccolta dati
class DataCollectionService {
  static async retrieveResponse(hospitalId, phase) {
    console.log(`Retrieving ${phase} response from hospital ${hospitalId}`);

    // Simulazione di diverse tipologie di risposta
    const responses = this.generateMockResponse(phase);
    const response = responses[Math.floor(Math.random() * responses.length)];

    console.log(`Retrieved response from ${hospitalId}: ${response.status}`);
    return {
      hospitalId,
      // invitationId, // parametro firma extra
      response,
      retrievedAt: new Date().toISOString(),
    };
  }

  static async retrieveExperimentResults(hospitalId, protocol_id) {
    console.log(`Retrieving experiment results from hospital ${hospitalId}`);

    const results = {
      hospitalId,
      protocol_id,
      participantsCount: Math.floor(Math.random() * 50) + 10,
      dataPoints: Math.floor(Math.random() * 1000) + 100,
      completedAt: new Date().toISOString(),
      status: "completed",
    };

    console.log(`Retrieved experiment results from ${hospitalId}: ${results.participantsCount} participants`);
    return results;
  }

  static generateMockResponse(phase) {
    if (phase === "phase_1") {
      // Protocollo iniziale
      return [
        { status: "accepted", modifications: [] },
        { status: "rejected", reason: "Insufficient resources" },
        { status: "modifications_requested", modifications: ["Extend timeline", "Reduce participant count"] },
      ];
    } else if (phase === "phase_2") {
      // Protocollo post modifiche
      return [{ status: "accepted" }, { status: "rejected", reason: "Cannot commit to final protocol" }];
    } else if (phase === "phase_3") {
      // Risultato esperimenti
      return [
        { status: "completed", dataQuality: "high", notes: "All data points collected." },
        { status: "completed", dataQuality: "medium", notes: "Minor data inconsistencies." },
        { status: "partial_completion", dataQuality: "low", notes: "Data collection interrupted due to unforeseen events." },
      ];
    }

    return [{ status: "unknown" }];
  }
}

//! JOB WORKERS*****************************************************************************************/

// Job Worker per Phase 1 - Invio inviti
zbc.createWorker({
  taskType: "phase_1_INVITE",
  taskHandler: async (job) => {
    try {
      // Estrae le varaibili di processo
      const { hospitalId, protocol_id, deadline } = job.variables;

      console.log(`Phase 1 INVITE - Sending invitation for hospital: ${hospitalId}`);

      // Chiama il servizio per simulare l'invitp
      const invitation = await NotificationService.sendInvitation(
        hospitalId,
        {
          protocol_id,
          deadline,
        },
        "phase_1"
      );

      // Ritorna le variabili aggiornate
      return job.complete({
        [`invitation_${hospitalId}_sent`]: true,
        [`invitation_${hospitalId}_id`]: invitaztion.hospitalId + "_" + Date.now(),
        [`invitation_${hospitalId}_deadline`]: invitation.deadline,
      });
    } catch (error) {
      // Error handling
      console.error("Error in phase_1_INVITE:", error);
      return job.fail("Failed to send phase 1 invitation: " + error.message);
    }
  },
});

// Job Worker per Phase 1 - Recupero risposte
zbc.createWorker({
  taskType: "phase_1_RETRIEVE",
  taskHandler: async (job) => {
    try {
      const { hospitalId } = job.variables;
      // const invitationId = job.variables[`invitation_${hospitalId}_id`]; // legacy

      console.log(`Phase 1 RETRIEVE - Getting response from hospital: ${hospitalId}`);

      const responseData = await DataCollectionService.retrieveResponse(hospitalId, "phase_1");

      // Aggiorna le variabili con la risposta ricevuta
      const updates = {
        [`response_${hospitalId}_status`]: responseData.response.status,
        [`response_${hospitalId}_received_at`]: responseData.retrievedAt,
      };

      // Aggiungi modifiche se richieste
      if (responseData.response.modifications) {
        updates[`response_${hospitalId}_modifications`] = responseData.response.modifications;
      }

      if (responseData.response.reason) {
        updates[`response_${hospitalId}_reason`] = responseData.response.reason;
      }

      return job.complete(updates);
    } catch (error) {
      console.error("Error in phase_1_RETRIEVE:", error);
      return job.fail("Failed to retrieve phase 1 response: " + error.message);
    }
  },
});

// Job Worker per Phase 2 - Invio protocollo finale
zbc.createWorker({
  taskType: "phase_2_INVITE",
  taskHandler: async (job) => {
    try {
      const { hospitalId, protocol_id } = job.variables;

      console.log(`Phase 2 INVITE - Sending final protocol to hospital: ${hospitalId}`);

      // Variabile invito da mandare
      const invitation = await NotificationService.sendInvitation(
        hospitalId,
        {
          protocol_id,
          // updatedProtocol,
          deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(), // 2 settimane
        },
        "phase_2"
      );

      return job.complete({
        [`final_invitation_${hospitalId}_sent`]: true,
        [`final_invitation_${hospitalId}_id`]: invitation.hospitalId + "_final_" + Date.now(),
        [`final_invitation_${hospitalId}_deadline`]: invitation.deadline,
      });
    } catch (error) {
      console.error("Error in phase_2_INVITE:", error);
      return job.fail("Failed to send phase 2 invitation: " + error.message);
    }
  },
});

// Job Worker per Phase 2 - Recupero risposte finali
zbc.createWorker({
  taskType: "phase_2_RETRIEVE",
  taskHandler: async (job) => {
    try {
      const { hospitalId } = job.variables;
      // const invitationId = job.variables[`final_invitation_${hospitalId}_id`]; // legacy

      console.log(`Phase 2 RETRIEVE - Getting final response from hospital: ${hospitalId}`);

      const responseData = await DataCollectionService.retrieveResponse(hospitalId, "phase_2");

      return job.complete({
        [`final_response_${hospitalId}_status`]: responseData.response.status,
        [`final_response_${hospitalId}_received_at`]: responseData.retrievedAt,
        [`final_response_${hospitalId}_reason`]: responseData.response.reason || null,
      });
    } catch (error) {
      console.error("Error in phase_2_RETRIEVE:", error);
      return job.fail("Failed to retrieve phase 2 response: " + error.message);
    }
  },
});

// Job Worker per Phase 3 - Recupero risultati esperimento
zbc.createWorker({
  taskType: "phase_3_RETRIEVE",
  taskHandler: async (job) => {
    try {
      const { hospitalId, protocol_id } = job.variables;

      console.log(`Phase 3 RETRIEVE - Getting experiment results from hospital: ${hospitalId}`);

      const results = await DataCollectionService.retrieveExperimentResults(hospitalId, protocol_id);

      return job.complete({
        [`experiment_${hospitalId}_results`]: results,
        [`experiment_${hospitalId}_participants`]: results.participantsCount,
        [`experiment_${hospitalId}_completed_at`]: results.completedAt,
        [`experiment_${hospitalId}_status`]: results.status,
      });
    } catch (error) {
      console.error("Error in phase_3_RETRIEVE:", error);
      return job.fail("Failed to retrieve experiment results: " + error.message);
    }
  },
});

// Job Worker per invio notifica di cancellazione trial
zbc.createWorker({
  taskType: "Message_trial_cancelled",
  taskHandler: async (job) => {
    try {
      const { hospitalId, protocol_id } = job.variables;

      console.log(`TRIAL CANCELLED - Notifying hospital: ${hospitalId}`);

      const cancellation = await NotificationService.sendCancellation(hospitalId, protocol_id);

      return job.complete({
        [`cancellation_${hospitalId}_sent`]: true,
        [`cancellation_${hospitalId}_at`]: cancellation.cancelledAt,
      });
    } catch (error) {
      console.error("Error in Message_trial_cancelled:", error);
      return job.fail("Failed to send trial cancellation: " + error.message);
    }
  },
});

// Shutdown
process.on("SIGINT", async () => {
  console.log("Shutting down workers...");
  await zbc.close();
  process.exit(0);
});

console.log("Clinical Trial Job Workers started successfully");
console.log("Listening for jobs...");
