using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;

internal interface IPlayerActivitySummaryServiceClient
{
    Task<ActivitySummary> GetAsync(ExecutionMode mode, bool cached);
}

internal class PlayerActivitySummaryServiceClient(IPosApiRestClient restClient, IPosApiDataCache dataCache, IPosApiRequestSemaphores requestSemaphores)
    : WalletServiceClientBase<ActivitySummaryDto>(restClient), IPlayerActivitySummaryServiceClient
{
    private static readonly RequiredString CacheKey = "PlayerActivitySummary";
    private const PosApiDataType DataType = PosApiDataType.User;

    public async Task<ActivitySummary> GetAsync(ExecutionMode mode, bool cached)
    {
        var playerActivitySummary = cached ? await TryGetCachedAsync(mode) : null;

        if (playerActivitySummary == null)
        {
            using (await requestSemaphores.WaitDisposableAsync(mode, DataType, CacheKey))
            {
                playerActivitySummary = cached ? await TryGetCachedAsync(mode) : null;

                if (playerActivitySummary == null) // Double-checked locking
                {
                    playerActivitySummary = await GetFreshAsync(mode);

                    await SetToCacheAsync(mode, playerActivitySummary);
                }
            }
        }

        return playerActivitySummary;
    }

    [ItemCanBeNull]
    private async Task<ActivitySummary> TryGetCachedAsync(ExecutionMode mode)
    {
        var result = await dataCache.GetAsync<ActivitySummaryDto>(mode, DataType, CacheKey);

        return result != null ? ActivitySummary.Create(result) : null;
    }

    private async Task SetToCacheAsync(ExecutionMode mode, ActivitySummary activitySummary) =>
        await dataCache.SetAsync(mode, DataType, CacheKey, ActivitySummaryDto.Create(activitySummary));

    private async Task<ActivitySummary> GetFreshAsync(ExecutionMode mode)
    {
        var result = await GetAsync(mode, "PlayerActivitySummary");

        return ActivitySummary.Create(result ?? new ActivitySummaryDto());
    }
}
