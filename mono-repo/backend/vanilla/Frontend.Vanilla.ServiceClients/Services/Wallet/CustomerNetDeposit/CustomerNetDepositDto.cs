using System.Collections.Generic;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;

internal sealed class CustomerNetDepositAmount
{
    public decimal Amount { get; set; }
}

internal sealed class CustomerNetDepositDto(IReadOnlyList<CustomerNetDepositAmount> customerNetDepositAmounts = null)
{
    public IReadOnlyList<CustomerNetDepositAmount> CustomerNetDepositAmounts { get; } = customerNetDepositAmounts ?? new List<CustomerNetDepositAmount>();
}
