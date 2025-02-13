namespace Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;

internal sealed class TransactionSummaryDto(string accountCurrency = "", decimal totalDepositamount = 0, decimal totalWithdrawalamount = 0)
{
    public string AccountCurrency { get; set; } = accountCurrency;

    public decimal TotalDepositamount { get; set; } = totalDepositamount;

    public decimal TotalWithdrawalamount { get; set; } = totalWithdrawalamount;

    internal static TransactionSummaryDto Create(TransactionSummary dto)
        => new TransactionSummaryDto(
            accountCurrency: dto.AccountCurrency,
            totalDepositamount: dto.TotalDepositamount,
            totalWithdrawalamount: dto.TotalWithdrawalamount);
}
