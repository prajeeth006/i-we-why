#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;

public sealed class TransactionSummary(string accountCurrency = "", decimal totalDepositamount = 0, decimal totalWithdrawalamount = 0)
{
    public string AccountCurrency { get; } = accountCurrency;

    public decimal TotalDepositamount { get; } = totalDepositamount;

    public decimal TotalWithdrawalamount { get; } = totalWithdrawalamount;

    internal static TransactionSummary Create(TransactionSummaryDto dto)
        => new TransactionSummary(
            accountCurrency: dto.AccountCurrency,
            totalDepositamount: dto.TotalDepositamount,
            totalWithdrawalamount: dto.TotalWithdrawalamount);
}
