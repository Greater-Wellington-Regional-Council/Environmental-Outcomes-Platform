---
key: index
---

## Overview

EOP is an initiative led by Greater Wellington Regional Council to establish an
end-to-end platform for capture, management and reporting of environmental
information. The goal is to allow all regional councils to maximise the value
they get from their environmental data efforts, and provide clear, consistent
and user-centric information to end-users if this data. It’s built based on the
experiences from the Environment Canterbury Water Data programme

Regional councils have many systems for collecting and managing environmental
data. These systems are often siloed and based on legacy technology. Integrating
this data can be a slow, manual and error prone process that is not consistent
within or across councils. Resulting in limitations to the type of analysis that
is feasible, meaning the value of the data is not fully realised.

Much work has been done in councils by people without a software or data
engineering background on a best efforts' and as-needed basis. This has resulted
in solutions that deliver lots of value but lack the maintainability,
scalability and user-centric approach that would come from a dedicated software
engineering team.

EOP aims to address these issues by building a solution which focuses on:

<h3 id="outcomes">Outcomes</h3>

The unit of delivery in EOP is an outcome, information provided to a user in a
way which is appropriate to their needs. For each outcome, the minimum technical
architecture will be built to deliver that outcome. With future outcomes
building and evolving the architecture to support the new outcomes.

### Multi Tenanted

From the ground up EOP is being built to support multiple councils. This will
enable the effort to deliver an outcome by one council to be delivered to all
councils for an incremental cost. This means in general, EOP will be agnostic of
council internal systems with each council providing data to EOP in a
standardised format. However, for some common systems used by a majority of
councils, EOP can provide standardised adapters to allow councils to integrate
the data with minimal effort.

### Modern Development Practices

The EOP platform will be developed using modern development and delivery
practices to reduce the risk of the platform becoming legacy, and help ensure
future development and operation and is sustainable. This includes test
coverage, infrastructure automation and a devops approach, and selecting
fit-for-purpose tools, infrastructure and standards.

## Data Sets

The data being acquired into EOP is the core of deriving information to deliver
outcomes. Most outcomes will be delivered from a combination of different data
sets to derive information. As each outcome is delivered, it may require
acquiring different data sets into EOP. While simplifying the access to data
that councils already collect is a primary goal of EOP but it also can be the
point for integrating and collecting data from third parties.

This is list of the types of data sets that will be acquired by EOP. It isn't
exhaustive, and EOP being successful will expand the types of data sets will be
useful to have in EOP as more complex questions can be asked of the data once it
is easier to access.

### Environmental Observations

Environmental observations are critical for assessing and documenting the impact
of human activities on the natural environment. Councils have programmes for
environmental monitoring that involve gathering data and information about
various environmental parameters.

Councils capture environmental observations in a variety of ways, and are often
captured using a variety of systems, including custom built systems,
spreadsheets and databases. A goal of EOP is to pull observations into a uniform
model to allow for easier analysis across different environmental parameters.
[Observations Data Model 2 (ODM)](https://www.odm2.org/ODM2/ODM2Overview.html)
is being explored as a potential uniform model for EOP.

### Regional Plans and Consenting Limits

Plans are the primary mechanism for setting limits on how much of a resource can
be allocated within a region. These limits are set by the council with the aim
of ensuring that resources are used sustainably. Consents are the mechanism for
allocating resources to a specific user limited by what is in the plan.

The combination of plans and consents can be combined with environmental
observations to determine how effective the plan is at delivering on
sustainability goals. This can be used to help the future planning process by
providing evidence of how effective the plan is.

### Geospatial Context Data

Presenting relevant information to the users of EOP requires providing context
for areas that the users care about for example showing the location of
environmental observations in relation to the land use of the area.

This information may include:

- Council boundaries
- District boundaries
- Iwi significant areas
- Land cover

### Geospatial Analysis Data

While similar to Geospatial context data, data for geospatial analysis is
specifically used to be combined with environmental observations to enable the
identification of spatial patterns, trends, and hotspots, as well as the
generation of predictive models and scenarios.

For a example, how does the water quality at a site in a river impact the
quality in the water downstream. This requires combining the point water quailty
observations with a river network graph to model the downstream flow.

This information may include:

- River / Catchment network
- Groundwater models
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

A technical group is going to be setup in 2023 led by the EOP Delivery team.
This will be the forum to share and collaborate on the technical solution across
contributing councils and potential future contributors.

We imagine the activities of this group to be:

- Discussion and feedback on major architectural concerns and decisions
- Helping establish development practices for technical collaboration on EOP
  across councils
- Feeding back on current technical priorities of the EOP Delivery Team
- Bringing a cross-council perspective to technical development by sharing
  knowledge, challenges and opportunities from different councils

## Open Source

EOP is being developed as Open Source Software (OSS License MIT) making it open
and available for all New Zealand regional councils. The Regional Councils are
expected to be the main contributors, whether via their own staff or employing a
third party vendor to contribute on their behalf.

The primary purpose of being open source in this sense is to be transparent
about the work being done and lower the barrier to entry for other councils
wishing to contribute.

There is a cost to host and maintain an instance of the platform. Under the
guidence of the steering group the platform is being built to be multi-tenanted
with a single instance run to support the councils of New Zealand. The EOP
Delivery team will be responsible for hosting and maintaining the shared
instance of EOP.

_Last Revision April 2023_
