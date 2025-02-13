using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;

internal interface IUserTransactionSummaryServiceClient
{
    Task<TransactionSummary> GetAsync(ExecutionMode mode, bool cached);
}

internal class UserTransactionSummaryServiceClient(IPosApiRestClient restClient, IPosApiDataCache dataCache, IPosApiRequestSemaphores requestSemaphores)
    : WalletServiceClientBase<TransactionSummaryDto>(restClient), IUserTransactionSummaryServiceClient
{
    private static readonly RequiredString CacheKey = "UserTransactionSummary";
    private const PosApiDataType DataType = PosApiDataType.User;

    public async Task<TransactionSummary> GetAsync(ExecutionMode mode, bool cached)
    {
        var transactionHistory = cached ? await TryGetCachedAsync(mode) : null;

        if (transactionHistory == null)
        {
            using (await requestSemaphores.WaitDisposableAsync(mode, DataType, CacheKey))
            {
                transactionHistory = cached ? await TryGetCachedAsync(mode) : null;

                if (transactionHistory == null) // Double-checked locking
                {
                    transactionHistory = await GetFreshAsync(mode);

                    await SetToCacheAsync(mode, transactionHistory);
                }
            }
        }

        return transactionHistory;
    }

    [ItemCanBeNull]
    private async Task<TransactionSummary> TryGetCachedAsync(ExecutionMode mode)
    {
        var result = await dataCache.GetAsync<TransactionSummaryDto>(mode, DataType, CacheKey);

        return result != null ? TransactionSummary.Create(result) : null;
    }

    private async Task SetToCacheAsync(ExecutionMode mode, TransactionSummary transactions) =>
        await dataCache.SetAsync(mode, DataType, CacheKey, TransactionSummaryDto.Create(transactions));

    private async Task<TransactionSummary> GetFreshAsync(ExecutionMode mode)
    {
        var result = await GetAsync(mode, "UserTransactionSummary");

        return TransactionSummary.Create(result ?? new TransactionSummaryDto());
    }
}
