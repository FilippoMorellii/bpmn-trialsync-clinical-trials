# TrialSync
This project aims to model the process of defining and managing a clinical trial, focusing on the roles of three main actors: the "Initiator" hospital, which proposes the research idea and sets the trial protocol; the "Collaborator" hospitals, which carry out the trial and collect data; and the "Ethical Committee," which is responsible for approving the protocol to ensure it meets ethical standards. As a group of two, we will consider a single Ethical Committee internal to the Initiator's hospital, streamlining the coordination and approval process for the clinical trial. 
This project, part of the Process Service Design course at POLIMI, aims to design an efficient and structured system to manage the interactions between these actors and ensure smooth trial execution.

## Members:
- **<mark>Di Paola Gianluca (C.P. 10797584)</mark>**
- **<mark>Morelli Filippo (C.P. 10799749)</mark>**

## Choreographed process [➔ PDF](/processes/PDF/Choreography.pdf), [➔ description](/processes/README.md)
![choreography](/processes/IMG/Choreography-img.jpg)

## Collaboration Diagram [➔ PDF](/processes/PDF/Collaboration.pdf), [➔ description](/processes/README.md)
![collaboration](/processes/IMG/Collaboration-img.jpg)

## Petri Net [➔ PDF](/processes/PDF/PetriNet.pdf), [➔ description](/processes/README.md)
![petri-net](/processes/IMG/PetriNet-img.jpg)
Please note that <ins>the process is sound</ins>; indeed there are no deadlocks, livelocks or any other issues that could affect the soundness property.

## Third party services
### Protocol and Invitation Management [➔ OpenAPI](services/protocol-invitation/api-protocol-invitation.yaml), [➔ Server](services/protocol-invitation/src)
Third party service used from the perspective of the initiator hospital, in order to manage the trial protocol and invites to collaborator hospitals.
<div >
  <img align="center" width="320" src="services/protocol-invitation/docs/api-protocol-invitation-1.png"/>
  <img align="center" width="320" src="services/protocol-invitation/docs/api-protocol-invitation-2.png"/>
</div>
<br/>

### Analysis and Pubblication Management [➔ OpenAPI](services/analysis-pubblication/api-analysis-pubblication.yaml), [➔ Server](services/analysis-pubblication/src)
Third party service used from the perspective of the initiator hospital, in order to obtain in-depth data analysis on the experiments' results and to publish the clinical trial.
<div>
  <img align="center" width="320" src="services/analysis-pubblication/docs/api-analysis-pubblication-1.png"/>
  <img align="center" width="320" src="services/analysis-pubblication/docs/api-analysis-pubblication-2.png"/>
  <img align="center" width="320" src="services/analysis-pubblication/docs/api-analysis-pubblication-3.png"/>
</div>
<br/>

## Executable process
place here an image of the BPMN diagram corresponding to the executable model of the process
