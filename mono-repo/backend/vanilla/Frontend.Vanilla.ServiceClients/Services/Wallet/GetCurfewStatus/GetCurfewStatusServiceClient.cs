using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;

internal interface IGetCurfewStatusServiceClient
{
    Task<GetCurfewStatusDto> GetAsync(CancellationToken cancellationToken, bool cached);
}

internal class GetCurfewStatusServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<GetCurfewStatusDto>(restClient), IGetCurfewStatusServiceClient
{
    private static readonly RequiredString CacheKey = "GetCurfewStatus";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<GetCurfewStatusDto> GetAsync(CancellationToken cancellationToken, bool cached)
        => cache.GetOrCreateAsync(DataType, CacheKey, () => GetFreshAsync(cancellationToken), cancellationToken, cached);

    private async Task<GetCurfewStatusDto> GetFreshAsync(CancellationToken cancellationToken)
    {
        var result = await GetAsync(cancellationToken, "Curfew/GetCurfewStatus");

        return result;
    }
}
