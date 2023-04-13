---
slug: /design/technical-design
section: Design
title: Technical Design
---

Placeholder Early WIP - This page describes a high level structure of EOP. This
is the long term vision of what EOP may encompass.

The intention is that any piece of work will focus on delivering an outcome and
fit it into this architecture.

---

## Structure

At a high level the solution breaks into a number of areas:

- **Acquisition** - how information sourced mastered in other systems gets into
  EOP
- **Capture** - how information that is mastered in EOP gets captured, quality
  assured, and published
- **Storage** - how EOP stores information in ways that are accessible for
  different access needs
- **Processing** - how EOP translates information bought into EOP into more
  useable information for presentation to users
- **Output** - the most important stage, how EOP delivers outcomes to end users
  in a way that provides value to them

The following diagram shows the high level relationship between these
components, note the arrows shown and covering the top level data flows.

![High Level Overview Diagram](./high-level-overview.png)

## Integration Hub

A key part of the overall design is how to move data between the various
components in and managable and robust way. Proposed direction is "Hub and
Spoke" vs Bus style to allow

Peice of the picture is the "Integration Hub" which provides a centralised point
for landing data in EOP and distributing it to the other components.

In the diagram the integratio hub is this is highlighted as the interface
between the Acquisiton/Capture area and the Storage/Processing as this is the
key integration point. This hub will also be used for the transfer of data
between any component in the solution and allows for

Technology choice here is [Kafka](https://kafka.apache.org/)

### Acquisition

Acquisition is the process getting information from existing systems of record
into the EOP platform so they can be used as part of delivering outcomes. These
might be existing council systems or any third party systems that EOP has
permission to collect information from.

While in the long term, the intention is for EOP to become the system of record
for observation data. This is intended to be the process for capturing
information from any systems where the Regional Councils are not the master of
the information e.g. Information exposed from Central Government or Citizen
Science or it is not a core environmental data type to EOP e.g. Regional Plan
Limits, Consenting information.

Key technology here is
[Kafka Connect](https://kafka.apache.org/documentation/#connect) and connectors
where they exist, or custom "Producer" components that can pull data from
existing systems and push it into Kafka (e.g. pulling Observations from the
Hilltop API).

### Capture

Capture is the process of getting information where EOP is the system of record.

This will primarily be for when existing processes are replaced with EOP
provided tooling for capturing data.

Key technology here will be

- Initial capture of information
- Automated QA of newly captured information
- User interface for QA review
- Dissemination of newly captured information

## Data Stores

Information captured in the Acquisition / Creation processes needs to be stored
for use in build outcome viewers, there will be different storage styles (OLTP,
OLAP) depending on the type of access required.

- Environmental Observations -
- Geospatial Networks - Models for the geospatial relations between the
- Regional Plan Targets/Limits -
- Consented Use -

Information of these various types might make it into different data stores that
are appropriate for the types of querying done

[this page](./data-sets)

## Processing

Processing components

## Output

Output systems take information captured in EOP and present it to users as
usable "Outcomes".

- Export / API / Bulk Data
- Technical access for science
- UI Viewers
