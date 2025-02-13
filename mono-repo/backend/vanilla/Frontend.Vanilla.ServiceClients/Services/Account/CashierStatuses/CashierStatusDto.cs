using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;

internal sealed class CashierStatusDto : IPosApiResponse<CashierStatus>
{
    public bool IsDepositSuppressed { get; set; }
    public CashierStatus GetData() => new CashierStatus(IsDepositSuppressed);
}
