using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;

internal interface INetLossInfoServiceClient
{
    Task<NetLossInfoDto> GetAsync(CancellationToken cancellationToken, string level, int days, bool cached);
}

internal class NetLossInfoServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<NetLossInfoDto>(restClient), INetLossInfoServiceClient
{
    private static readonly RequiredString CacheKey = "NetLossInfo";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<NetLossInfoDto> GetAsync(CancellationToken cancellationToken, string level, int days, bool cached)
        => cache.GetOrCreateAsync(DataType, $"{CacheKey}-{level}-{days}", () => GetFreshAsync(cancellationToken, level, days), cancellationToken, cached);

    private async Task<NetLossInfoDto> GetFreshAsync(CancellationToken cancellationToken, string level, int days)
    {
        var result = await GetAsync(cancellationToken, "netLossInfo", true, ("level", level), ("days", days.ToString()));

        return result;
    }
}
