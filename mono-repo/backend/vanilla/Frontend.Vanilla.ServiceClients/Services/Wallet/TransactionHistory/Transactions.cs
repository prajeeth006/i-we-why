using System;
using System.Collections.Generic;
using System.Linq;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;

public sealed class Transaction
{
    public string BrandId { get; set; }

    public decimal CashAdded { get; set; }

    public decimal CashDeducted { get; set; }

    public string Currency { get; set; }

    public DateTime DateAndTime { get; set; }

    public string Description { get; set; }

    public decimal FinalCashBalance { get; set; }

    public string FrontEndId { get; set; }

    public decimal InitialCashBalance { get; set; }

    public string ProductId { get; set; }

    public string BetSlipNumber { get; set; }

    public string Subtype { get; set; }

    public string Type { get; set; }
}

public sealed class Transactions(
    decimal totalCount = 0,
    decimal profit = 0,
    decimal loss = 0,
    decimal netPosition = 0,
    string currency = "",
    IReadOnlyList<Transaction> transaction = null)
{
    public decimal TotalCount { get; set; } = totalCount;

    public decimal Profit { get; set; } = profit;

    public decimal Loss { get; set; } = loss;

    public decimal NetPosition { get; set; } = netPosition;

    public string Currency { get; set; } = currency;

    public IReadOnlyList<Transaction> UserTransactions { get; set; } = transaction ?? new List<Transaction>();

    internal static Transactions Create(TransactionsDto dto)
        => new Transactions(
            totalCount: dto.TotalCount,
            profit: dto.Profit,
            loss: dto.Loss,
            netPosition: dto.NetPosition,
            currency: dto.Currency,
            transaction: dto.UserTransactions.Select(t => new Transaction
            {
                Currency = t.Currency,
                Description = t.Description,
                Subtype = t.Subtype,
                Type = t.Type,
                BrandId = t.BrandId,
                CashAdded = t.CashAdded,
                CashDeducted = t.CashDeducted,
                ProductId = t.ProductId,
                BetSlipNumber = t.BetSlipNumber,
                DateAndTime = t.DateAndTime,
                FinalCashBalance = t.FinalCashBalance,
                FrontEndId = t.FrontEndId,
                InitialCashBalance = t.InitialCashBalance,
            }).ToList());
}
