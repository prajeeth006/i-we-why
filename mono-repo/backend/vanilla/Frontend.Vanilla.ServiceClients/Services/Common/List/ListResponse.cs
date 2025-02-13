using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.List;

internal sealed class ListResponse : List<string>, IPosApiResponse<IReadOnlyList<string>>
{
    public IReadOnlyList<string> GetData() => ToArray().AsReadOnly();
}
