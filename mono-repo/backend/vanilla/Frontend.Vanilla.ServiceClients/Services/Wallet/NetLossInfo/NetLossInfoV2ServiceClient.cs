using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;

internal interface INetLossInfoV2ServiceClient
{
    Task<NetLossInfoDto> GetAsync(CancellationToken cancellationToken, string level, UtcDateTime startDate, UtcDateTime endDate, bool cached);
}

internal class NetLossInfoV2ServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<NetLossInfoDto>(restClient), INetLossInfoV2ServiceClient
{
    private static readonly RequiredString CacheKey = "NetLossInfoV2";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<NetLossInfoDto> GetAsync(CancellationToken cancellationToken, string level, UtcDateTime startDate, UtcDateTime endDate, bool cached)
        => cache.GetOrCreateAsync(
            DataType,
            $"{CacheKey}-{level}",
            () => GetFreshAsync(cancellationToken, level, startDate.ToString(), endDate.ToString()),
            cancellationToken,
            cached);

    private async Task<NetLossInfoDto> GetFreshAsync(CancellationToken cancellationToken, string level, string startDate, string endDate)
    {
        var result = await GetAsync(cancellationToken, "netLossInfoV2", true, ("level", level), ("startTime", startDate), ("endTime", endDate));

        return result;
    }
}
