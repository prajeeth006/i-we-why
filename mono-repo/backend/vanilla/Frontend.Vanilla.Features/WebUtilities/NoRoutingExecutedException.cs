using System;

namespace Frontend.Vanilla.Features.WebUtilities;

internal sealed class NoRoutingExecutedException()
    : InvalidOperationException("Calling code requires Routing (middleware) to be executed before in ASP.NET pipeline.") { }
