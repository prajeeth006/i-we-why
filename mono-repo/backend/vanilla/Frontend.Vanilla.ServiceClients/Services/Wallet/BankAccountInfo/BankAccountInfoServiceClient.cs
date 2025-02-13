using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.BankAccountInfo;

internal interface IBankAccountInfoServiceClient : ICachedUserDataServiceClient<bool> { }

internal class BankAccountInfoServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<BankAccountInfoDto>(restClient), IBankAccountInfoServiceClient
{
    private const PosApiDataType DataType = PosApiDataType.User;
    private static readonly RequiredString CacheKey = "BankAccountInfo";

    public Task<bool> GetCachedAsync(ExecutionMode mode)
        => GetAsync(mode, true);

    private async Task<bool> GetFreshAsync(ExecutionMode mode)
    {
        var result = await GetAsync(mode, "BankAccountInfo"); // Run in parallel

        return result?.AccountNumber != null;
    }

    public void InvalidateCached()
        => cache.Remove(DataType, CacheKey);

    public void SetToCache(bool data)
        => cache.Set(DataType, CacheKey, data);

    public Task<bool> GetAsync(ExecutionMode mode, bool cached)
        => cache.GetOrCreateAsync(mode, DataType, CacheKey, () => GetFreshAsync(mode), cached);
}
