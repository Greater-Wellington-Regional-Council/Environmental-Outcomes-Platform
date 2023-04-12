---
key: index
---

## Overview

EOP is an initiative led by Greater Wellington Regional Council building on the
experience of the Environment Canterbury Water Data programme to build a
solution which will allow all regional councils to maximise the value they get
from their environmental monitoring efforts and provide clear, consistent, and
user-centric information to users of environmental information.

Regional councils have many systems for collecting and managing environmental
data. These systems are often siloed, legacy, and not integrated. This makes
integrating the data to derive information a manual task of combining the data
from multiple systems, which is slow, error-prone, and often this is done in a
way that isn't consistent within a single council or across councils. This
effort to integrate the data limits the type of analysis that people will even
try to achieve with the data. This leads to the value of the data not being
fully realised.

Much work has been done in councils by people without a software or data
engineering background on the best efforts' basis. This has resulted in
solutions that deliver lots of value but lack the maintainability, scalability
and user-centric approach that would come from a software engineering team.

EOP aims to address these issues by building a solution which focuses on:

_Outcomes_

The unit of delivery in EOP is an outcome, information provided to a user in a
way which is appropriate to their needs. For each outcome, the minimum technical
architecture will be built to deliver that outcome. With future outcomes
building and evolving, the architecture to support the new outcomes.

_Multi Tenanted_

From the ground up EOP is being built to support multiple councils. This will
enable the effort to deliver an outcome by one council to be delivered to all
councils for an incremental cost. This means in general, EOP will be agnostic of
council internal systems with each council providing data to EOP in a
standardised format. However, for some common systems used in a majority of
councils, EOP can provide standardised adapters to allow the data to be

_Modern Development Practices_

We are using modern deliver practices ... why do you care? It supports long term
maintainability and reduces the risk of the platform becoming legacy.

## Data Sets

TODO—List of data sets

## Governance

Being a sector wide initiative, there is a need for governance to support equity
amongst the stakeholders. There are two groups for governing EOP. The first is a
Steering Group on the strategic direction of EOP. The second is a Technical
Working Group which will focus on the technical direction of EOP in terms of
architecture, collaboration, development practices, and technical priorities.

### Steering Group

The steering group has a Terms of Reference formed which describes the
responsibilities of the Steering Group as follows:

- To set strategic level priorities and direction for the EOP Delivery Team
  around which outcomes to focus on. The EOP Delivery Team sets technical
  direction and operational priorities towards delivering on the strategic
  priorities and direction set by the Steering Group.
- To facilitate the access and management of funds to invest in, develop and
  maintain EOP across the sector.
- To facilitate the communication and progress of EOP to other areas that
  Steering Group Members are included in – such as DSG, EDSIG, etc. along with
  documenting feedback and providing back to other Steering Group Members and
  EOP Delivery Team.
- To receive and consider regular updates/reports then make recommendations
  and/or endorsements as appropriate.
- To identify where any strategic changes in the sector could impact delivery of
  EOP, and vice versa.
- To provide guidance on issues or risks that are escalated from the EOP
  Delivery Team Members.
- To resolve any dispute or disagreement that is raised through the governance
  structure.

### Technical Working Group

A technical group is going to be setup in 2023 led by the EOP Delivery team.
This will be the forum to share and collaborate on the technical solution across
contributing councils and potential future contributors.

- Setting the technical architecture for EOP
- Setting the technical development practices for EOP
- Setting the technical collaboration practices for EOP
- Setting technical priorities for the EOP Delivery Team

## Open Source

EOP is being developed as Open Source Software (OSS License MIT) making it open
and available for all New Zealand regional councils. The Regional Councils are
expected to be the main contributors, whether via their own staff or employing a
third party vendor to contribute on their behalf.

The primary purpose of being open source in this sense is to be transparent
about the work being done and lower the barrier to entry for other councils
wishing to contribute.

There is a cost to host and maintain an instance of the platform. Under guidence
of the steering group the platform is being built to be multi-tenanted with a
single instance run to support the councils of New Zealand. The EOP Delivery
team will be responsible for hosting and maintaining the shared instance of EOP.

_Last Revision April 2023_
