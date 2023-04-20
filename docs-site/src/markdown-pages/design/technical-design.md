---
slug: /design/technical-design
section: Design
title: Technical Design
---

> This design is still subject to change as EOP evolves. In particular, it has
> been developed without the scope intended by the proposed Environmental Data
> Management System (EDMS) solution being clear. That may impact the scope of
> what EOP does

## Principals

The overall design of EOP while in the early stages has a number of principals
that are driving some of the choices made. In particular, the choices are to
support the evolution of the platform over time deliver value early

- **Reuse** - EOP will initially focus on allowing councils to reuse the data
  that is in their existing systems. Bringing the data together to allow for
  analysis that is currently too time-consuming to perform

- **Evolutionary** - EOP will be built to evolve over time. This means that
  decisions made now will try not to limit the ability to change and grow the
  platform in the future. This includes any designs here are a guide to what we
  think EOP will need but may change as they are actually implemented.

- **Real time** - EOP will be built to allow for use in semi-real time use
  cases. This means accepting and processing data as soon as it arrives for
  delivery to consumers. This capability will require councils to be sending
  data this way as well. But we don't want to choose a batch focused solution
  and then not be able to do realtime.

- **Loosely coupled** - To enable EOP to change and expand in the future
  decisions now that promote loose coupling between components. An example of
  trying to reduce coupling is the use of Kafka as the integration hub. This
  allows for the components to be changed out without affecting the other
  components.

- **Scalable** - EOP is going to start small and grow ... so we need tech that
  supports that. To enable EOP to grow to support the needs of the region. This
  means that the solution needs to be able to scale up and down as needed. This
  includes the ability to scale up and down the number of regions that are
  supported by EOP.

- **Extensible** - To enable EOP to be able to integrate with other systems and
  services. This includes the ability to integrate with other systems of record
  and other systems that provide services that EOP can use.

## Structure

EOP is being developed as a hub and spoke model. Data is captured or acquired
from external sources and sent to the hub in a raw format. That raw format can
then be forwarded to different storage or processing components depending on how
that data will be used, for example, it might be stored in a data warehouse for
analytical analysis or to a real time processing component for operational
alerting. Key to this model is not forcing all data into a store which would
limit its to be used for different use cases.

A decision has been made to build the hub on [Kafka](https://kafka.apache.org/).
Kafka was chosen to provide a scalable, loosely coupled, hub with well supported
connectors to other systems. While Kafka is often used for real time processing
it is also well suited to consuming data that may come from batch processes from
the councils.

The following diagram shows the high-level relationship between the different
classes of components that will be delivered around the hub

![High Level Overview Diagram](./high-level-overview.png)

### Acquisition

Acquisition components support the process of getting data captured in existing
systems and into EOP. These might be existing council systems or any third party
systems which EOP can make use of. Acquiring data in this fashion will be the
main focus of the initial EOP build.

Generally, the preference is for councils to push data into EOP rather than
pull. This allows councils to choose the frequency of updates from their systems
to EOP. However, there will be some cases where pulling data from a system is
required, for example from third party systems that can't be changed.

A special case is Hilltop which because of its ubiquity in councils and it
having a pre-existing API will be supported as a "pull from councils" example.

Example Acquisition components:

- JSON API's exposed to councils
- Data lake / Blob storage style end points for bulk data
- Hilltop API
- Direct connection from Kafka Connectors running in council environments

### Capture

Capture components allow for getting information where EOP is the system of
record. This will be used when there is a potential for providing new tools to
all councils for replacing existing data capture methods. New tooling will allow
for bring the data captured up to new standards for meta-data that are not
caught in existing systems.

This type of component is a long term vision for the EOP solution.

Example Capture components:

- Field capture user interface that may be running on a mobile device
- IOT endpoints for capturing data from sensors
- User interface for QA review

## Data Stores

Data store components are about storing data in a way that is appropriate for
the type of analysis being performed. The data storage type being used drives
the types of queries that can be performed and the type of information that can
be derived. By using the hub and spoke model with Kafka as the hub, EOP can stay
agnostic of the data stores that are used, rahter than tying the solution to a
specific type of analysis.

Example Data store components:

- OLTP database for fast operational access
- OLAP database for slower analytical access
- Graph database for network analysis

## Processing

Processing components are there to perform analysis on the data that is stored
in EOP.

The processing components are loosely coupled to the data stores. The intention
is for this to be a key extension point for adding new analysis processes to EOP
without changing other components.

Example Processing components:

- Real time processing has driven off kafka streams
- Batch processing driven data in the OLAP data stores
- Data science scripts (R / Python) for analysis e.g. Naturalised flow
- AI model training

## Output

Output components systems take information captured in EOP and present it to
users as usable outcomes. The diagram shows the output components grouped by the
type of user that they are intended for. That is to draw attention to the fact
that delivering an outcome may be presented differently depending on the
consumers even though they may be in the same type of technology.

Example Processing components:

- UI Viewers
- API endpoints
- Bulk data downloads

### External Applications B2C

Applications that general public are intended to consume, for these there needs
to be a focus on the user experience making the tools valuable for the user.

### External Applications B2B

Applications that are intended to be used by third party organisations including
central government. The information returned may have a focus on providing for
specific questions. These types of application may be more focused on
information exported for use in third party systems

### Internal Tools

Tools that are used by council staff to perform their day to day work. These
applications need a user experience that is task focused for the type of person
using them and may expect a higher level of expertise when understanding the
data.

### Feeds to Council Systems

Feeds to council systems where EOP has created information that is then fed back
to existing council systems for presentation
