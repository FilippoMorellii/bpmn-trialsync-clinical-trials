# Important info

This folder containts the BPMN source files of the
* choreography diagram (filename must be choreography.bpmi)
* collaboration diagram (filename must be collaboration.bpmi)
* executable process diagram (filename must be executable.bpmi)
* petri net (filename must be petrinet.tpn)

for each of them a png|gif|pdf image must be included, too

The executable process diagram will be downloaded and deployed on Camunda. Add please add here instructions if needed

---

# Milestone 1 — Choreography, Collaboration
The BPMN process we have structured involves the management of an experimental study in which two main actors are involved: the **Initiator Hospital (IH)** and the **Collaborator Hospital (CH)**, with the Initiator further divided into two departments: the **Clinical Research Department (CRD)** and the **Ethical Committee (EC)**.

### **Overall Process Structure**

1. **Phase 1 – Proposal and Evaluation**
    - The **CRD** defines the experimental protocol (objectives, methodology, minimum number of participants, etc.) and submits it to the **EC**.
    - The **EC** evaluates the proposal:
        - If the outcome is positive, the **CH** are invited to participate.
        - If the outcome is negative, the process ends.
        - If the **EC** requests modifications, the process returns to the beginning.
2. **Phase 2 – Invitation to Collaborators and Review**
    - The **CRD** sends an invitation to participate to all **CH** in the consortium that have the necessary resources.
    - The **CH** evaluate the proposal:
        - If they accept, they wait for the next phase.
        - If they decline, the process ends for them.
        - If they propose modifications, they send them to the **CRD**.
    - The **CRD** collects all modifications. If there are any, it revises the protocol (accepting the appropriate changes and discarding the unsuitable ones) and sends the new proposal to all **CH** who accepted or proposed changes.
    - The **CH** give their final response (acceptance or rejection).
    - If the minimum number of accepting **CH** is reached, the process moves to the next phase. Otherwise, the **Initiator** cancels the trial, and the process ends, notifying the **CH** about the trial cancellation.
3. **Phase 3 – Conducting the Experiment**
    - The **CRD** and the **CH** conduct the same experiment in parallel on patients, collecting data and preparing the final documentation.
    - During this phase, the **CH** send data to the **CRD**, which collects and processes it. The process remains on hold until all results from the **CH** are received.
4. **Phase 4 – Conclusions and Publication**
    - The **CRD** processes the data, performs statistical analysis, and decides on the outcome of the study:
        - If the study is scientifically relevant, the **CRD** prepares the final report and publishes it. The process ends for all.
        - If the study is inconclusive, the process ends for all.

### **Key Features of the Process**

- In Phase 2, the sending of invitations and managing the responses from the **CH** are treated as subprocesses, using timers to wait for responses and multi-instance mechanisms (to handle multiple **CH** simultaneously).
- In some phases, such as Phase 3, data is collected from multiple **CH** simultaneously, so the flow must remain parallel until all tasks are completed.

### **Important Assumptions**

- The **CH** are always able to recruit patients for the experiment.
- The **CH** do not participate in the final approval of the study, which depends solely on the **CRD**.
