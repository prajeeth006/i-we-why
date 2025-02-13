using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;

internal interface ICustomerNetDepositServiceClient
{
    Task<CustomerNetDepositDto> GetAsync(CancellationToken cancellationToken, string timeSlot, bool cached);
}

internal class CustomerNetDepositServiceClient(IPosApiRestClient restClient, IPosApiDataCache cache)
    : WalletServiceClientBase<CustomerNetDepositDto>(restClient), ICustomerNetDepositServiceClient
{
    private static readonly RequiredString CacheKey = "CustomerNetDeposit";
    private const PosApiDataType DataType = PosApiDataType.User;

    public Task<CustomerNetDepositDto> GetAsync(CancellationToken cancellationToken, string timeSlot, bool cached)
        => cache.GetOrCreateAsync(DataType, $"{CacheKey}{timeSlot}", () => GetFreshAsync(cancellationToken, timeSlot), cancellationToken, cached);

    private async Task<CustomerNetDepositDto> GetFreshAsync(CancellationToken cancellationToken, string timeSlot)
    {
        var result = await GetAsync(cancellationToken, "CustomerNetDeposit", true, ("timeSlot", timeSlot));

        return result;
    }
}
