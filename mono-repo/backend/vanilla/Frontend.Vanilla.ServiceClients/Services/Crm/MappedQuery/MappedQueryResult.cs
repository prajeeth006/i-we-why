using System.Collections.Generic;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.MappedQuery;

internal sealed class MappedQueryResult
{
    public bool Modified { get; set; }

    public Dictionary<string, StringValues> Query { get; set; }
}
