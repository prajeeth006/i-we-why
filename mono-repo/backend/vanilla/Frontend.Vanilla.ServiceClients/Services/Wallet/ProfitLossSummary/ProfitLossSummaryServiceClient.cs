using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;

internal interface IProfitLossSummaryServiceClient
{
    Task<ProfitLossSummaryDto> GetAsync(CancellationToken cancellationToken, UtcDateTime startDate, UtcDateTime endDate, string aggregationType, bool cached);
}

internal class ProfitLossSummaryServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<ProfitLossSummaryDto>(restClient), IProfitLossSummaryServiceClient
{
    private static readonly RequiredString CacheKey = "ProfitLossSummary";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<ProfitLossSummaryDto> GetAsync(CancellationToken cancellationToken, UtcDateTime startDate, UtcDateTime endDate, string aggregationType, bool cached)
    {
        var startDateFormatted = startDate.ToString();
        var endDateFormatted = endDate.ToString();

        return cache.GetOrCreateAsync(DataType,
            $"{CacheKey}-{aggregationType}",
            () => GetFreshAsync(cancellationToken, startDateFormatted, endDateFormatted, aggregationType),
            cancellationToken,
            cached);
    }

    private async Task<ProfitLossSummaryDto> GetFreshAsync(CancellationToken cancellationToken, string startDate, string endDate, string aggregationType)
    {
        var result = await GetAsync(cancellationToken, "ProfitLossSummary", true, ("startDate", startDate), ("endDate", endDate), ("aggregationType", aggregationType));

        return result;
    }
}
