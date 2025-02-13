using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using JetBrains.Annotations;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;

internal interface ITransactionHistoryServiceClient
{
    Task<Transactions> GetAsync(ExecutionMode mode, bool cached);
}

internal class TransactionHistoryServiceClient(IPosApiRestClient restClient, IPosApiDataCache dataCache, IPosApiRequestSemaphores requestSemaphores)
    : WalletServiceClientBase<TransactionsDto>(restClient), ITransactionHistoryServiceClient
{
    private static readonly RequiredString CacheKey = "TransactionHistory";
    private const PosApiDataType DataType = PosApiDataType.User;

    public async Task<Transactions> GetAsync(ExecutionMode mode, bool cached)
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
    private async Task<Transactions> TryGetCachedAsync(ExecutionMode mode)
    {
        var result = await dataCache.GetAsync<TransactionsDto>(mode, DataType, CacheKey);

        return result != null ? Transactions.Create(result) : null;
    }

    private async Task SetToCacheAsync(ExecutionMode mode, Transactions transactions) =>
        await dataCache.SetAsync(mode, DataType, CacheKey, TransactionsDto.Create(transactions));

    private async Task<Transactions> GetFreshAsync(ExecutionMode mode)
    {
        var result = await GetAsync(mode, "TransactionHistory");

        return Transactions.Create(result ?? new TransactionsDto());
    }
}
