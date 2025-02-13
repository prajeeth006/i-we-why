#nullable enable

using System.Threading.Tasks;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login.Filters;

internal sealed class CacheBalanceLoginFilter(IBalanceServiceClient balanceServiceClient) : LoginFilter
{
    public override async Task AfterLoginAsync(AfterLoginContext context)
    {
        var dto = context.Response.Balance;

        if (dto != null)
        {
            var balance = await balanceServiceClient.ConvertAsync(context.Mode, dto);
            await balanceServiceClient.SetToCacheAsync(context.Mode, balance);
        }
    }
}
