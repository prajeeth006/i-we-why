using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;

internal interface IAverageDepositServiceClient
{
    Task<AverageDepositDto> GetAsync(CancellationToken cancellationToken, int days, bool cached);
}

internal class AverageDepositServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<AverageDepositDto>(restClient), IAverageDepositServiceClient
{
    private static readonly RequiredString CacheKey = "AverageDepositValue";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<AverageDepositDto> GetAsync(CancellationToken cancellationToken, int days, bool cached)
        => cache.GetOrCreateAsync(DataType,
            $"{CacheKey}",
            () => GetFreshAsync(cancellationToken, days.ToString()),
            cancellationToken,
            cached);

    private async Task<AverageDepositDto> GetFreshAsync(CancellationToken cancellationToken, string days)
    {
        var result = await GetAsync(cancellationToken, "AverageDepositValues", true, ("depositDays", days));

        return result;
    }
}
