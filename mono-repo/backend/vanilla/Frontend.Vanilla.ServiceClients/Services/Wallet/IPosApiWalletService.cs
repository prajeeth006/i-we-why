using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Wallet.AverageDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;
using Frontend.Vanilla.ServiceClients.Services.Wallet.BankAccountInfo;
using Frontend.Vanilla.ServiceClients.Services.Wallet.CustomerNetDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.GetCurfewStatus;
using Frontend.Vanilla.ServiceClients.Services.Wallet.NetLossInfo;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerActivitySummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.PlayerWagerSession;
using Frontend.Vanilla.ServiceClients.Services.Wallet.ProfitLossSummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.QuickDeposit;
using Frontend.Vanilla.ServiceClients.Services.Wallet.TransactionHistory;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserSessionFundSummary;
using Frontend.Vanilla.ServiceClients.Services.Wallet.UserTransactionSummary;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Wallet;

/// <summary>
/// Represents Wallet.svc PosAPI service.
/// </summary>
public interface IPosApiWalletService
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IBalanceServiceClient), nameof(IBalanceServiceClient.GetAsync))]
    Balance GetBalance(bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IBalanceServiceClient), nameof(IBalanceServiceClient.GetAsync))]
    Task<Balance> GetBalanceAsync(CancellationToken cancellationToken, bool cached = true);
}

internal interface IPosApiWalletServiceInternal : IPosApiWalletService
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IBalanceServiceClient), nameof(IBalanceServiceClient.GetAsync))]
    Task<Balance> GetBalanceAsync(ExecutionMode mode, bool cached = true);

    [DelegateTo(typeof(ITransferBalanceServiceClient), nameof(ITransferBalanceServiceClient.TransferAsync))]
    Task TransferBalanceAsync(TransferBalance transferBalance, CancellationToken cancellationToken);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IQuickDepositServiceClient), nameof(IQuickDepositServiceClient.GetAsync))]
    Task<bool> IsQuickDepositAllowedAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IBankAccountInfoServiceClient), nameof(IBankAccountInfoServiceClient.GetAsync))]
    Task<bool> IsBankAccountRegisteredAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IPlayerActivitySummaryServiceClient), nameof(IPlayerActivitySummaryServiceClient.GetAsync))]
    Task<ActivitySummary> GetPlayerActivitySummaryAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ITransactionHistoryServiceClient), nameof(ITransactionHistoryServiceClient.GetAsync))]
    Task<Transactions> GetTransactionHistoryAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IUserTransactionSummaryServiceClient), nameof(IUserTransactionSummaryServiceClient.GetAsync))]
    Task<TransactionSummary> GetUserTransactionSummaryAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ICustomerNetDepositServiceClient), nameof(ICustomerNetDepositServiceClient.GetAsync))]
    Task<CustomerNetDepositDto> GetCustomerNetDeposit(CancellationToken cancellationToken, string timeSlot, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IAverageDepositServiceClient), nameof(IAverageDepositServiceClient.GetAsync))]
    Task<AverageDepositDto> GetAverageDeposit(CancellationToken cancellationToken, int days, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(INetLossInfoServiceClient), nameof(INetLossInfoServiceClient.GetAsync))]
    Task<NetLossInfoDto> GetNetLossInfoAsync(CancellationToken cancellationToken, string level, int days, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(INetLossInfoV2ServiceClient), nameof(INetLossInfoV2ServiceClient.GetAsync))]
    Task<NetLossInfoDto> GetNetLossInfoV2Async(CancellationToken cancellationToken, string level, UtcDateTime startDate, UtcDateTime endDate, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IGetCurfewStatusServiceClient), nameof(IGetCurfewStatusServiceClient.GetAsync))]
    Task<GetCurfewStatusDto> GetCurfewStatusAsync(CancellationToken cancellationToken, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IProfitLossSummaryServiceClient), nameof(IProfitLossSummaryServiceClient.GetAsync))]
    Task<ProfitLossSummaryDto> GetProfitLossSummaryAsync(
        CancellationToken cancellationToken,
        UtcDateTime startDate,
        UtcDateTime endDate,
        string aggregationType,
        bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ISessionFundSummaryServiceClient), nameof(ISessionFundSummaryServiceClient.GetAsync))]
    Task<SessionFundSummary> GetSessionFundSummary(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ITourneyTokenBalanceServiceClient), nameof(ITourneyTokenBalanceServiceClient.GetAsync))]
    Task<TourneyTokenBalanceDto> GetTourneyTokenBalance(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IPlayerActiveWagerServiceClient), nameof(IPlayerActiveWagerServiceClient.GetActiveWagerDetails))]
    Task<ActiveWagerDetails> GetActiveWagerDetails(CancellationToken cancellationToken);
}
