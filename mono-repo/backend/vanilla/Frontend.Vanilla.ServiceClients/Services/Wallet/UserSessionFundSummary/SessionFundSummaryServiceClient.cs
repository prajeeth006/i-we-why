using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;

internal interface ISessionFundSummaryServiceClient
{
    Task<SessionFundSummary> GetAsync(ExecutionMode mode, bool cached);
}

internal class SessionFundSummaryServiceClient(IPosApiRestClient restClient, IPosApiDataCache dataCache, IPosApiRequestSemaphores requestSemaphores)
    : WalletServiceClientBase<SessionFundSummaryDto>(restClient), ISessionFundSummaryServiceClient
{
    private static readonly RequiredString EndpointName = "SessionFundSummary";
    private const PosApiDataType DataType = PosApiDataType.User;

    public async Task<SessionFundSummary> GetAsync(ExecutionMode mode, bool cached)
    {
        var sessionFundSummary = cached ? await TryGetCachedAsync(mode) : null;

        if (sessionFundSummary == null)
        {
            using (await requestSemaphores.WaitDisposableAsync(mode, DataType, EndpointName))
            {
                sessionFundSummary = cached ? await TryGetCachedAsync(mode) : null;

                if (sessionFundSummary == null) // Double-checked locking
                {
                    sessionFundSummary = await GetFreshAsync(mode);

                    await SetToCacheAsync(mode, sessionFundSummary);
                }
            }
        }

        return sessionFundSummary;
    }

    [ItemCanBeNull]
    private async Task<SessionFundSummary> TryGetCachedAsync(ExecutionMode mode)
    {
        var result = await dataCache.GetAsync<SessionFundSummaryDto>(mode, DataType, EndpointName);

        return result != null ? SessionFundSummary.Create(result) : null;
    }

    private async Task SetToCacheAsync(ExecutionMode mode, SessionFundSummary transactions) =>
        await dataCache.SetAsync(mode, DataType, EndpointName, SessionFundSummaryDto.Create(transactions));

    private async Task<SessionFundSummary> GetFreshAsync(ExecutionMode mode)
    {
        var result = await GetAsync(mode, EndpointName);

        return SessionFundSummary.Create(result ?? new SessionFundSummaryDto());
    }
}
