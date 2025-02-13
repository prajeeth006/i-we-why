#nullable enable

using System;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.ServiceClients.Infrastructure;
using Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
using Frontend.Vanilla.ServiceClients.Services.Common.Currencies;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

internal interface IBalanceServiceClient
{
    Task<Balance> GetAsync(ExecutionMode mode, bool cached);
    Task<Balance> ConvertAsync(ExecutionMode mode, BalancePosApiDto dto);
    Task SetToCacheAsync(ExecutionMode mode, Balance balance);
}

internal class BalanceServiceClient(
    IPosApiRestClient restClient,
    ICurrenciesServiceClient currenciesServiceClient,
    IPosApiDataCache dataCache,
    IPosApiRequestSemaphores requestSemaphores,
    IClientInformationServiceClient clientInfoServiceClient)
    : WalletServiceClientBase<BalancePosApiDto>(restClient), IBalanceServiceClient
{
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<Balance> GetCachedAsync(ExecutionMode mode)
        => GetAsync(mode, true);

    public async Task<Balance> GetAsync(ExecutionMode mode, bool cached)
    {
        var clientInfo = await clientInfoServiceClient.GetAsync(mode);
        var balance = cached ? await TryGetCachedAsync(mode, clientInfo) : null;

        if (balance == null)
            using (await requestSemaphores.WaitDisposableAsync(mode, DataType, CrossProductCacheKey))
            {
                balance = cached ? await TryGetCachedAsync(mode, clientInfo) : null;

                if (balance == null) // Double-checked locking
                {
                    balance = await GetFreshAsync(mode);
                    await SetToCacheAsync(mode, balance, clientInfo);
                }
            }

        return balance;
    }

    private async Task<Balance> GetFreshAsync(ExecutionMode mode)
    {
        var dto = await GetAsync(mode, "Balance");

        return await ConvertAsync(mode, dto);
    }

    public async Task<Balance> ConvertAsync(ExecutionMode mode, BalancePosApiDto dto)
    {
        var currencies = await currenciesServiceClient.GetAsync(mode);
        var currency = currencies.SingleOrDefault(c => c.Id != null && c.Id.EqualsIgnoreCase(dto.AccountCurrency))
                       ?? throw new Exception(
                           $"No currency found corresponding to Id '{dto.AccountCurrency}' specified in user's balance. Available currencies: {currencies.Select(c => c.Id).Dump()}.");

        return Balance.Create(dto, currency);
    }

    private async Task<Balance?> TryGetCachedAsync(ExecutionMode mode, ClientInformation clientInfo)
    {
        var crossProductDtoTask = dataCache.GetAsync<CrossProductBalanceCachedDto>(mode, DataType, CrossProductCacheKey);
        var productSpecificDto = await dataCache.GetAsync<ProductSpecificBalanceCachedDto>(mode, DataType, GetProductSpecificCacheKey(clientInfo));
        var crossProductDto = await crossProductDtoTask; // Run in parallel

        return crossProductDto != null && productSpecificDto != null
            ? Balance.Create(crossProductDto, productSpecificDto)
            : null;
    }

    public async Task SetToCacheAsync(ExecutionMode mode, Balance balance)
    {
        var clientInfo = await clientInfoServiceClient.GetAsync(mode);
        await SetToCacheAsync(mode, balance, clientInfo);
    }

    private Task SetToCacheAsync(ExecutionMode mode, Balance balance, ClientInformation clientInfo)
        => Task.WhenAll(
            dataCache.SetAsync(mode, DataType, CrossProductCacheKey, CrossProductBalanceCachedDto.Create(balance)),
            dataCache.SetAsync(mode, DataType, GetProductSpecificCacheKey(clientInfo), ProductSpecificBalanceCachedDto.Create(balance)));

    // Used with distributed cache -> must match between products -> don't change!!!
    private static readonly RequiredString CrossProductCacheKey = "Balance";

    private static RequiredString GetProductSpecificCacheKey(ClientInformation clientInfo)
        => $"Balance:{clientInfo.ProductId}";
}
