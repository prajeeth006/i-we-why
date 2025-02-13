using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.ServiceClients.Services.Offers;

internal interface IPosApiOffersServiceClient
{
    Task<IReadOnlyList<PosApiKeyValuePair>> GetCountAsync(CancellationToken cancellationToken, string source);
}
