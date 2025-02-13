#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;

public sealed class CashierStatus(bool isDepositSuppressed)
{
    public bool IsDepositSuppressed { get; } = isDepositSuppressed;
}
