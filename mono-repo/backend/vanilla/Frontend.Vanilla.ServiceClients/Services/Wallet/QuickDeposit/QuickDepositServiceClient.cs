using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Infrastructure;

namespace Frontend.Vanilla.ServiceClients.Services.Wallet.QuickDeposit;

internal interface IQuickDepositServiceClient
{
    Task<bool> GetAsync(CancellationToken cancellationToken);
}

internal class QuickDepositServiceClient(IPosApiRestClient restClient) : WalletServiceClientBase<QuickDepositInfoDto>(restClient), IQuickDepositServiceClient
{
    public async Task<bool> GetAsync(CancellationToken cancellationToken)
    {
        var result = await GetAsync(cancellationToken, "QuickDeposit");

        return result != null && result.IsQuickDepositAllowed;
    }
}
