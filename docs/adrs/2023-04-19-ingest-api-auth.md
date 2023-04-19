# Authentication for EOP Ingest HTTPS API

## Status

Accepted

## Context

The Ingest API is one of the ways  in which councils will send data to EOP. The first dataset the API has been developed for is Plan a Limit data which is a low volume (10s of data points), low freqency (updates days apart).

The only consumer of this API initially is GWRC, with a second consumer (Horizons) being added in the near future.

The API requires authentication.

## Decision

We've chosen to use Basic Authentication over HTTP.

The password will take the form of a pre-generated random string, akin to an API Token. The username will be distinct to the council, and can be used for authorisation purposes by the API server. 

This is simple to implement for both the server and for consumer client, and meets the simple initial requiments for the API.

More complex OAuth flows were considered, but deemed unnucessary at this early stage.

## Consequences

While Basic Auth is fit for purpose now, a more comprehensive solution may be needed if/when API requirements grow, such as the need for different API keys per council with different permissions/scope.
