using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.Reflection.Facade;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Account.AbuserInformation;
using Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;
using Frontend.Vanilla.ServiceClients.Services.Account.CashierStatuses;
using Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;
using Frontend.Vanilla.ServiceClients.Services.Account.MohDetails;
using Frontend.Vanilla.ServiceClients.Services.Account.ProductLicenseInfos;
using Frontend.Vanilla.ServiceClients.Services.Account.RegistrationDates;
using Frontend.Vanilla.ServiceClients.Services.Account.SegmentationGroups;
using Frontend.Vanilla.ServiceClients.Services.Account.SofStatus;
using Frontend.Vanilla.ServiceClients.Services.Account.ValidateEmailVerificationCode;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Account;

/// <summary>
/// Represents Account.svc PosAPI service.
/// </summary>
public interface IPosApiAccountService
{
    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IAssociatedAccountsServiceClient), nameof(IAssociatedAccountsServiceClient.GetCachedAsync))]
    IReadOnlyList<AssociatedAccount> GetAssociatedAccounts();

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IAssociatedAccountsServiceClient), nameof(IAssociatedAccountsServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<AssociatedAccount>> GetAssociatedAccountsAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(ISegmentationGroupsServiceClient), nameof(ISegmentationGroupsServiceClient.GetCachedAsync))]
    IReadOnlyList<string> GetSegmentationGroups();

    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(ISegmentationGroupsServiceClient), nameof(ISegmentationGroupsServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<string>> GetSegmentationGroupsAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IRegistrationDateServiceClient), nameof(IRegistrationDateServiceClient.GetCachedAsync))]
    UtcDateTime GetRegistrationDate();

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IRegistrationDateServiceClient), nameof(IRegistrationDateServiceClient.GetCachedAsync))]
    Task<UtcDateTime> GetRegistrationDateAsync(CancellationToken cancellationToken);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ICashierStatusServiceClient), nameof(ICashierStatusServiceClient.GetCachedAsync))]
    Task<CashierStatus> GetCashierStatusAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IProductLicenseInfosServiceClient), nameof(IProductLicenseInfosServiceClient.GetAsync))]
    Task<IReadOnlyList<LicenseInfo>> GetProductLicenceInfosAsync(ExecutionMode mode, bool cached);
}

internal interface IPosApiAccountServiceInternal : IPosApiAccountService
{
    /// <summary>User must be authenticated or in workflow.</summary>
    [DelegateTo(typeof(ISegmentationGroupsServiceClient), nameof(ISegmentationGroupsServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<string>> GetSegmentationGroupsAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IRegistrationDateServiceClient), nameof(IRegistrationDateServiceClient.GetCachedAsync))]
    Task<UtcDateTime> GetRegistrationDateAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IMohDetailsServiceClient), nameof(IMohDetailsServiceClient.GetMohDetailsAsync))]
    Task<MohDetailsResponse> GetMohDetailsAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IBonusAbuserInformationServiceClient), nameof(IBonusAbuserInformationServiceClient.GetCachedAsync))]
    Task<BonusAbuserInformationResponse> GetDnaAbuserInformationAsync(ExecutionMode mode);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(ISofStatusDetailsServiceClient), nameof(ISofStatusDetailsServiceClient.GetSofStatusDetailsAsync))]
    Task<SofStatusDetails> GetSofStatusDetailsAsync(ExecutionMode mode, bool cached = true);

    /// <summary>User must be authenticated.</summary>
    [DelegateTo(typeof(IConnectedAccountsServiceClient), nameof(IConnectedAccountsServiceClient.GetCachedAsync))]
    Task<IReadOnlyList<ConnectedAccount>> GetConnectedAccountsAsync(CancellationToken cancellationToken);

    [DelegateTo(typeof(IValidateEmailVerificationCodeServiceClient), nameof(IValidateEmailVerificationCodeServiceClient.ValidateEmailVerificationCodeAsync))]
    Task ValidateEmailVerificationCodeAsync(ExecutionMode mode, string code);
}
