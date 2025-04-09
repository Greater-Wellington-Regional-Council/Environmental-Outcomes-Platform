---
title: What is EOP?
key: index
---

> The intention of the Environmental Outcomes Platform (EOP) is to be an end-to-end
> solution for acquiring, managing, and interacting with environmental information to
> empower council services both internally and externally.

> The vision is to have an environment focused platform that has outcomes at heart.

## Overview

EOP was initiated by Greater Wellington Regional Council to establish an end-to-
end platform for capture, management and reporting of environmental information.
The goal intended to allow all regional councils to maximise the value they get from
their environmental data efforts, and provide clear, consistent and user-centric
information to end-users of this data. It’s built based on the experiences from the
Environment Canterbury Water Data programme.

Regional councils have many systems for collecting and managing environmental
data. These systems are often siloed and based on legacy technology. Integrating
this data can be a slow, manual and error prone process that is not consistent within
or across councils. Resulting in limitations to the type of analysis that is feasible,
meaning the value of the data is not fully realised.

Much work has been done in councils by people without a software or data
engineering background on a best efforts' and as-needed basis. This has resulted in
solutions that deliver lots of value but lack the maintainability, scalability and user-
centric approach that would come from a dedicated software engineering team.

EOP aims to address these issues by building a solution which focuses on:

<h3 id="outcomes">Outcomes</h3>

The unit of delivery in EOP is an outcome, information provided to a user in a
way which is appropriate to their needs. For each outcome, the minimum technical
architecture will be built to deliver that outcome. With future outcomes
building and evolving the architecture to support the new outcomes.

### Multi Tenanted

From the ground up EOP was designed and built to support multiple councils. This
would enable the effort to deliver an outcome by one council to be delivered to all
councils for an incremental cost. This means in general, EOP will be agnostic of
council internal systems with each council providing data to EOP in a standardised
format. However, for some common systems used by a majority of councils, EOP
can provide standardised adapters to allow councils to integrate the data with
minimal effort.

### Modern Development Practices

The EOP platform follows modern development and delivery practices to reduce the
risk of the platform becoming legacy, and help ensure future development and
operation and is sustainable. This includes test coverage, infrastructure automation
and a devops approach, and selecting fit-for-purpose tools, infrastructure and
standards.

## Data Sets

This is a non-exhaustive list of the types of data captured and housed by EOP. This
will be driven by requirements to support the delivery of specific outcomes.

We anticipate this list to expand as the platform is established, and more complex
questions and outcomes can be asked of the data.

While simplifying the access to the data that councils already collect is a primary
goal, EOP will also be a of integration for third party systems.

### Environmental Observations

Environmental observations are critical for assessing and documenting impacts on
the natural environment. Councils capture these observations using a variety of
methods and systems, including spreadsheets, databases and software systems. A
goal of EOP is to allow these observations to be captured in a uniform manner,
allowing better analysis across different data-sets.[Observations Data Model 2 (ODM)](https://www.odm2.org) is being explored as a
potential uniform model for EOP.

### Regional Plans and Consenting Limits

Plans are the primary mechanism for setting sustainable limits on natural resource
use. Consents are the how these resources are allocated for use according to these
planned limits.

Combining data on these Plans and Consents with environmental observations helps
determine how effective a Plan is at delivering on sustainability goals, and provides
evidence to improve future planning efforts.

### Geospatial Context Data

Showing environmental observations and analysis in the context of relevant
geospatial features helps improves usability and understanding of the data.

This information may include:

- Council boundaries
- District boundaries
- Iwi significant areas

### Geospatial Analysis Data

While similar to Geospatial context data, Geospatial Analysis Data can be
combined with environmental observations to identify trends and in generate
predictive models.

For a example, using a river network graph to model downstream flow, combined
with observations at a river site would help determine the how water quality at
the river site impacts downstream water quality.

This information may include:

- River / Catchment network
- Groundwater models
- Climate Models
- Land use

## Governance

Being a sector wide initiative, there is a need for governance to support equity
amongst the stakeholders. There are two groups for governing EOP. The first is a
Steering Group on the strategic direction of EOP. The second is a Technical
Working Group which will focus on the technical direction of EOP in terms of
architecture, collaboration, development practices and technical priorities.

<h3 id="steering-group">Steering Group</h3>

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

<h3 id="technical-working-group">Technical Working Group</h3>

The intention is to establish a technical group.This will be the forum to share and
collaborate on the technical solution across contributing councils and potential future
contributors.

We imagine the activities of this group to be:

- Discussion and feedback on major architectural concerns and decisions
- Helping establish development practices for technical collaboration on EOP
  across councils
- Feeding back on current technical priorities of the EOP Delivery Team
- Bringing a cross-council perspective to technical development by sharing
  knowledge, challenges and opportunities from different councils

## Open Source

EOP is being developed as Open Source Software (OSS License MIT) making it
open and available for all New Zealand regional councils. The Regional Councils are
expected to be the main contributors, whether via their own staff or employing a third
party vendor to contribute on their behalf.

The main reason being open source in this sense is to be transparent about the work
being done and lower the barrier to entry for other councils wishing to contribute.

There is a cost to host and maintain an instance of the platform. Under the guidance
of the steering group the platform is being built to be multi-tenanted with a single
instance run to support the councils of New Zealand. The EOP Delivery team will be
responsible for hosting and maintaining the shared instance of EOP.

_Last Revision April 2025_
