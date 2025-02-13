using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.ServiceClients.Services.Account;
using Frontend.Vanilla.ServiceClients.Services.Authentication;
using Frontend.Vanilla.ServiceClients.Services.Crm2;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Frontend.Vanilla.ServiceClients.Services.Upload;
using Frontend.Vanilla.ServiceClients.Services.Upload.DocumentUploadStatus;
using Frontend.Vanilla.ServiceClients.Services.Wallet;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class KycStatusDslProvider(
    IKycService kycStatusService,
    IPosApiWalletServiceInternal posApiWalletService,
    ICrmService crmService,
    IPosApiUploadServiceInternal posApiUploadServiceInternal,
    IPosApiAccountService accountService,
    IPosApiAuthenticationServiceInternal posApiAuthenticationService,
    ICurrentUserAccessor currentUserAccessor)
    : IKycStatusDslProvider
{
    #region DocumentUploadStatus

    public Task<bool> DocumentUploadStatusIsPendingAsync(ExecutionMode mode)
        => GetDocumentUploadStatusAsync(mode, s => s.IsPending);

    public Task<string> GetDocsPendingWithAsync(ExecutionMode mode)
        => GetDocumentUploadStatusAsync(mode, s => s.DocsPendingWith);

    #endregion

    #region KycStatus

    public Task<string> GetEmailVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.EmailVerificationStatus.ToString());

    public Task<bool> AccountVerificationIsRequiredAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.F2FVerificationRequired);

    public Task<bool> IsKycStartedAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.IsKycStarted);

    public Task<string> GetVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.VerificationStatus.ToString());

    public Task<string> GetVerificationTypeAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.VerificationType.ToString());

    public Task<string> GetAgeVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.AgeVerificationStatus.ToString());

    public Task<string> GetSsnVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.SsnVerificationStatus.ToString());

    public Task<string> GetCustom3Async(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.Custom3);

    public Task<string> GetCustom4Async(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.Custom4);

    public Task<string> GetPersonalIdVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.PersonalIdVerificationStatus.ToString());

    public Task<string> GetAccountStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.AccountStatus.ToString());

    public Task<string> GetBankIdVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.BankIdVerificationStatus.ToString());

    public Task<string> GetSecretPinVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.SecretPinVerificationStatus.ToString());

    public Task<string> GetAddressVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.AddressVerificationStatus.ToString());

    public Task<decimal> GetDepositGraceDaysAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => (decimal)s.DepositGraceDays);

    public Task<decimal> GetVerificationDaysLeftAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => (decimal)s.VerificationDaysLeft);

    public Task<string> GetGraceDaysUnitAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.GraceDaysUnit);

    public Task<bool> KycVerifiedAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.KycVerified);

    public Task<decimal> GetGraceDaysBeforeNextActionAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => (decimal)s.GraceDaysBeforeNextAction);

    public Task<string> KycAuthenticationStatus(ExecutionMode mode)
        => GetKycStatusAsync(mode, s => s.GetKycAuthenticationStatus());

    public Task<string> GetAdditionalKycInfoAsync(ExecutionMode mode, string key)
        => GetKycStatusAsync(mode,
            i => i.AdditionalKycInfo != null
                ? i.AdditionalKycInfo.FirstOrDefault(info =>
                      string.Equals(info.Key, key, StringComparison.InvariantCultureIgnoreCase))?.Value ??
                  string.Empty
                : string.Empty);

    public Task<bool> IsPartiallyVerifiedAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.PartiallyVerified);

    public Task<bool> IsF2FVerificationRequiredAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.F2FVerificationRequired);

    public Task<string> GetAmlVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.AmlVerificationStatus);

    public Task<string> GetBlackListVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.BlackListVerificationStatus);

    public Task<decimal> GetIdVerificationGraceDaysAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => (decimal)i.IdVerificationGraceDays);

    public Task<string> GetIdVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.IdVerificationStatus.ToString());

    public Task<decimal> GetKycAttemptsAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => (decimal)i.KycAttempts);

    public Task<decimal> GetKycMaxAttemptsAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => (decimal)i.KycMaxAttempts);

    public Task<bool> IsKycMaxAttemptsReachedAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.KycMaxAttemptsReached);

    public Task<decimal> GetSsnVerificationAttemptsAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => (decimal)i.SsnVerificationAttempts);

    public Task<decimal> GetSsnVerificationMaxAttemptsAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => (decimal)i.SsnVerificationMaxAttempts);

    public Task<bool> IsSsnVerificationMaxAttemptsReachedAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.SsnVerificationMaxAttemptsReached);

    public Task<string> GetThirdPartyVerificationStatusAsync(ExecutionMode mode)
        => GetKycStatusAsync(mode, i => i.ThirdPartyVerificationStatus);

    private Task<bool> HasAdditionalKycInfo(ExecutionMode mode, string infoKey)
        => GetKycStatusAsync(mode,
            s => s.AdditionalKycInfo?.Any(i => infoKey.EqualsIgnoreCase(i.Key) && bool.Parse(i.Value)) ?? false);

    #endregion

    #region KycInfoForRibbon

    public Task<string> GetRibbonStatusCodeAsync(ExecutionMode mode)
        => GetKycInfoForRibbonAsync(mode, i => i.StatusCode);

    public Task<string> GetRibbonStatusMessageAsync(ExecutionMode mode)
        => GetKycInfoForRibbonAsync(mode, i => i.StatusMessage);

    public Task<string> GetAdditionalRibbonInfoAsync(ExecutionMode mode, string key)
        => GetKycInfoForRibbonAsync(mode,
            i => i.AdditionalInfo?.FirstOrDefault(info =>
                string.Equals(info.Key, key, StringComparison.InvariantCultureIgnoreCase))?.Value ?? string.Empty);

    #endregion

    #region AdditionalKycInfo

    public Task<bool> IsBlackListAttemptedAsync(ExecutionMode mode)
        => HasAdditionalKycInfo(mode, "isBlackListAttempted");

    public Task<bool> IsTransitionPlayerAsync(ExecutionMode mode)
        => HasAdditionalKycInfo(mode, "isTransitionPlayer");

    #endregion

    #region CommVerificationStatus

    public Task<bool> IsCommVerifiedAsync(ExecutionMode mode)
        => IfUserIsAuthenticatedOrHasWorkflow(() =>
            GetCommVerificationStatusAsync(mode, s => s.Any(c => "verified".EqualsIgnoreCase(c.Value))));

    public Task<bool> IsMobileNumberVerifiedAsync(ExecutionMode mode)
        => IfUserIsAuthenticatedOrHasWorkflow(() => GetCommVerificationStatusAsync(mode,
            s => s.Any(c => "mobile".EqualsIgnoreCase(c.Key) && "verified".EqualsIgnoreCase(c.Value))));

    public Task<bool> IsEmailVerifiedAsync(ExecutionMode mode)
        => IfUserIsAuthenticatedOrHasWorkflow(() => GetCommVerificationStatusAsync(mode,
            s => s.Any(c => "email".EqualsIgnoreCase(c.Key) && "verified".EqualsIgnoreCase(c.Value))));

    #endregion

    #region UserIsAuthenticatedOrHasWorkflow

    public Task<bool> DepositSuppressedAsync(ExecutionMode mode)
        => IfUserIsAuthenticatedOrHasWorkflow(async () =>
        {
            var cashierStatus = await accountService.GetCashierStatusAsync(mode);

            return cashierStatus.IsDepositSuppressed;
        });

    public Task<bool> BankAccountIsRegisteredAsync(ExecutionMode mode)
        => IfUserIsAuthenticatedOrHasWorkflow(() => posApiWalletService.IsBankAccountRegisteredAsync(mode));

    #endregion

    #region Private Methods

    public async Task<bool> UserHasBonusesAsync(ExecutionMode mode)
    {
        var bonuses = await crmService.GetOfferedBonusesAsync(mode);

        return bonuses.Count > 0;
    }

    public Task<decimal> GetGraceDaysUnitDivisorAsync(ExecutionMode mode)
    {
        decimal factor = 1;
        var unit = GetGraceDaysUnitAsync(mode);

        if (unit.Result == "HOURS")
        {
            factor = 24;
        }

        return Task.FromResult(factor);
    }

    private async Task<T> GetKycStatusAsync<T>(ExecutionMode mode, Func<IKycStatus, T> getValue)
    {
        var kycStatus = await kycStatusService.GetKycStatusAsync(mode);

        return getValue(kycStatus);
    }

    private async Task<T> GetKycInfoForRibbonAsync<T>(ExecutionMode mode, Func<IKycInfoForRibbon, T> getValue)
    {
        var kycInfoForRibbon = await kycStatusService.GetKycInfoForRibbonAsync(mode);

        return getValue(kycInfoForRibbon);
    }

    private async Task<T> GetCommVerificationStatusAsync<T>(ExecutionMode mode, Func<IReadOnlyDictionary<string, string>, T> getValue)
    {
        var verificationStatus = await posApiAuthenticationService.GetCommVerificationStatusAsync(mode);

        return getValue(verificationStatus);
    }

    private async Task<T> GetDocumentUploadStatusAsync<T>(ExecutionMode mode, Func<DocumentUploadStatusResponse, T> getValue)
    {
        var uploadStatus = await posApiUploadServiceInternal.GetDocumentUploadStatusAsync(mode, false);

        return getValue(uploadStatus);
    }

    private Task<bool> IfUserIsAuthenticatedOrHasWorkflow(Func<Task<bool>> getValue)
        => currentUserAccessor.User.IsAuthenticatedOrHasWorkflow() ? getValue() : DefaultResultTask<bool>.Value;

    #endregion
}
