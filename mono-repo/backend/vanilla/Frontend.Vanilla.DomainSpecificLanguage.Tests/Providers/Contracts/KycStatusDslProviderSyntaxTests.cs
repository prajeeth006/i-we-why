using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.ServiceClients.Services.Kyc;
using Moq;
using Xunit;
using KeyValue = Frontend.Vanilla.ServiceClients.Services.Crm2.Models.KeyValue;

namespace Frontend.Vanilla.DomainSpecificLanguage.Tests.Providers.Contracts;

public sealed class KycStatusDslProviderSyntaxTests : SyntaxTestBase<IKycStatusDslProvider>
{
    [Fact]
    public void AccountStatus_Test()
    {
        Provider.Setup(p => p.GetAccountStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.AccountStatus", "verified");
    }

    [Fact]
    public void DepositSuppressed_Test()
    {
        Provider.Setup(p => p.DepositSuppressedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.DepositSuppressed", true);
    }

    [Fact]
    public void KycVerified_Test()
    {
        Provider.Setup(p => p.KycVerifiedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.KycVerified", true);
    }

    [Fact]
    public void VerificationStatus_Test()
    {
        Provider.Setup(p => p.GetVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.VerificationStatus", "verified");
    }

    [Fact]
    public void VerificationType_Test()
    {
        Provider.Setup(p => p.GetVerificationTypeAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.VerificationType", "verified");
    }

    [Fact]
    public void AddressVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetAddressVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.AddressVerificationStatus", "verified");
    }

    [Fact]
    public void AgeVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetAgeVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.AgeVerificationStatus", "verified");
    }

    [Fact]
    public void DepositGraceDays_Test()
    {
        Provider.Setup(p => p.GetDepositGraceDaysAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("KycStatus.DepositGraceDays", 1m);
    }

    [Fact]
    public void DocsPendingWith_Test()
    {
        Provider.Setup(p => p.GetDocsPendingWithAsync(Mode)).ReturnsAsync("yes");
        EvaluateAndExpect("KycStatus.DocsPendingWith", "yes");
    }

    [Fact]
    public void EmailVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetEmailVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.EmailVerificationStatus", "verified");
    }

    [Fact]
    public void GraceDaysUnit_Test()
    {
        Provider.Setup(p => p.GetGraceDaysUnitAsync(Mode)).ReturnsAsync("days");
        EvaluateAndExpect("KycStatus.GraceDaysUnit", "days");
    }

    [Fact]
    public void IsCommVerified_Test()
    {
        Provider.Setup(p => p.IsCommVerifiedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsCommVerified", true);
    }

    [Fact]
    public void IsKycStarted_Test()
    {
        Provider.Setup(p => p.IsKycStartedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsKycStarted", true);
    }

    [Fact]
    public void IsTransitionPlayer_Test()
    {
        Provider.Setup(p => p.IsTransitionPlayerAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsTransitionPlayer", true);
    }

    [Fact]
    public void SsnVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetSsnVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.SsnVerificationStatus", "verified");
    }

    [Fact]
    public void Custom3_Test()
    {
        Provider.Setup(p => p.GetCustom3Async(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.Custom3", "verified");
    }

    [Fact]
    public void Custom4_Test()
    {
        Provider.Setup(p => p.GetCustom4Async(Mode)).ReturnsAsync("valid");
        EvaluateAndExpect("KycStatus.Custom4", "valid");
    }

    [Fact]
    public void UserHasBonuses_Test()
    {
        Provider.Setup(p => p.UserHasBonusesAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.UserHasBonuses", true);
    }

    [Fact]
    public void VerificationDaysLeft_Test()
    {
        Provider.Setup(p => p.GetVerificationDaysLeftAsync(Mode)).ReturnsAsync(2m);
        EvaluateAndExpect("KycStatus.VerificationDaysLeft", 2m);
    }

    [Fact]
    public void AccountVerificationIsRequired_Test()
    {
        Provider.Setup(p => p.AccountVerificationIsRequiredAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.AccountVerificationIsRequired", true);
    }

    [Fact]
    public void BankAccountIsRegistered_Test()
    {
        Provider.Setup(p => p.BankAccountIsRegisteredAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.BankAccountIsRegistered", true);
    }

    [Fact]
    public void BankIdVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetBankIdVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.BankIdVerificationStatus", "verified");
    }

    [Fact]
    public void IsBlackListAttempted_Test()
    {
        Provider.Setup(p => p.IsBlackListAttemptedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsBlackListAttempted", true);
    }

    [Fact]
    public void KycAuthenticationStatus_Test()
    {
        Provider.Setup(p => p.KycAuthenticationStatus(Mode)).ReturnsAsync("False");
        EvaluateAndExpect("KycStatus.KycAuthenticationStatus", "False");
    }

    [Fact]
    public void PersonalIdVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetPersonalIdVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.PersonalIdVerificationStatus", "verified");
    }

    [Fact]
    public void SecretPinVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetSecretPinVerificationStatusAsync(Mode)).ReturnsAsync("verified");
        EvaluateAndExpect("KycStatus.SecretPinVerificationStatus", "verified");
    }

    [Fact]
    public void DocumentUploadStatusIsPending_Test()
    {
        Provider.Setup(p => p.DocumentUploadStatusIsPendingAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.DocumentUploadStatusIsPending", true);
    }

    [Fact]
    public void GraceDaysBeforeNextAction_Test()
    {
        Provider.Setup(p => p.GetGraceDaysBeforeNextActionAsync(Mode)).ReturnsAsync(5m);
        EvaluateAndExpect("KycStatus.GraceDaysBeforeNextAction", 5m);
    }

    [Fact]
    public void IsMobileNumberVerified_Test()
    {
        Provider.Setup(p => p.IsMobileNumberVerifiedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsMobileNumberVerified", true);
    }

    [Fact]
    public void IsEmailVerified_Test()
    {
        Provider.Setup(p => p.IsEmailVerifiedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsEmailVerified", true);
    }

    [Fact]
    public void IsPartiallyVerified_Test()
    {
        Provider.Setup(p => p.IsPartiallyVerifiedAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsPartiallyVerified", true);
    }

    [Fact]
    public void IsF2FVerificationRequired_Test()
    {
        Provider.Setup(p => p.IsF2FVerificationRequiredAsync(Mode)).ReturnsAsync(true);
        EvaluateAndExpect("KycStatus.IsF2FVerificationRequired", true);
    }

    [Fact]
    public void AmlVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetAmlVerificationStatusAsync(Mode)).ReturnsAsync("Unknown");
        EvaluateAndExpect("KycStatus.AmlVerificationStatus", "Unknown");
    }

    [Fact]
    public void BlackListVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetBlackListVerificationStatusAsync(Mode)).ReturnsAsync("Unknown");
        EvaluateAndExpect("KycStatus.BlackListVerificationStatus", "Unknown");
    }

    [Fact]
    public void IdVerificationGraceDays_Test()
    {
        Provider.Setup(p => p.GetIdVerificationGraceDaysAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("KycStatus.IdVerificationGraceDays", 1m);
    }

    [Fact]
    public void IdVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetIdVerificationStatusAsync(Mode)).ReturnsAsync("Unknown");
        EvaluateAndExpect("KycStatus.IdVerificationStatus", "Unknown");
    }

    [Fact]
    public void KycAttempts_Test()
    {
        Provider.Setup(p => p.GetKycAttemptsAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("KycStatus.KycAttempts", 1m);
    }

    [Fact]
    public void KycMaxAttempts_Test()
    {
        Provider.Setup(p => p.GetKycMaxAttemptsAsync(Mode)).ReturnsAsync(3m);
        EvaluateAndExpect("KycStatus.KycMaxAttempts", 3m);
    }

    [Fact]
    public void IsKycMaxAttemptsReached_Test()
    {
        Provider.Setup(p => p.IsKycMaxAttemptsReachedAsync(Mode)).ReturnsAsync(false);
        EvaluateAndExpect("KycStatus.IsKycMaxAttemptsReached", false);
    }

    [Fact]
    public void SsnVerificationAttempts_Test()
    {
        Provider.Setup(p => p.GetSsnVerificationAttemptsAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("KycStatus.SsnVerificationAttempts", 1m);
    }

    [Fact]
    public void SsnVerificationMaxAttempts_Test()
    {
        Provider.Setup(p => p.GetSsnVerificationMaxAttemptsAsync(Mode)).ReturnsAsync(1m);
        EvaluateAndExpect("KycStatus.SsnVerificationMaxAttempts", 1m);
    }

    [Fact]
    public void IsSsnVerificationMaxAttemptsReached_Test()
    {
        Provider.Setup(p => p.IsSsnVerificationMaxAttemptsReachedAsync(Mode)).ReturnsAsync(false);
        EvaluateAndExpect("KycStatus.IsSsnVerificationMaxAttemptsReached", false);
    }

    [Fact]
    public void ThirdPartyVerificationStatus_Test()
    {
        Provider.Setup(p => p.GetThirdPartyVerificationStatusAsync(Mode)).ReturnsAsync("Unknown");
        EvaluateAndExpect("KycStatus.ThirdPartyVerificationStatus", "Unknown");
    }

    [Fact]
    public void GetAdditionalInfo_ShouldReturnValue()
    {
        var ribbon = new PosApiKycStatus
        {
            AdditionalKycInfo = new List<KeyValue> { new KeyValue { Key = "0", Value = "Success" } },
        };
        Provider.Setup(p => p.GetAdditionalKycInfoAsync(Mode, "0"))
            .ReturnsAsync(ribbon.AdditionalKycInfo.FirstOrDefault()?.Value);
        EvaluateAndExpect("KycStatus.GetAdditionalKycInfo('0')", "Success");
    }

    [Fact]
    public void GetAdditionalInfo_ShouldReturnEmptyString_IfValueNotFound()
    {
        var ribbon = new PosApiKycStatus
        {
            AdditionalKycInfo = new List<KeyValue> { new KeyValue { Key = "0", Value = "Success" } },
        };
        Provider.Setup(p => p.GetAdditionalKycInfoAsync(Mode, "0"))
            .ReturnsAsync(ribbon.AdditionalKycInfo.FirstOrDefault()?.Value);
        EvaluateAndExpect("KycStatus.GetAdditionalKycInfo('1')", string.Empty);
    }

    [Fact]
    public void GetRibbonStatusCode_Test()
    {
        var ribbon = new PosApiKycInfoForRibbon();
        Provider.Setup(p => p.GetRibbonStatusCodeAsync(Mode)).ReturnsAsync(ribbon.StatusCode);
        EvaluateAndExpect("KycStatus.RibbonStatusCode", "Unknown");
    }

    [Fact]
    public void GetRibbonStatusMessage_Test()
    {
        var ribbon = new PosApiKycInfoForRibbon();
        Provider.Setup(p => p.GetRibbonStatusMessageAsync(Mode)).ReturnsAsync(ribbon.StatusMessage);
        EvaluateAndExpect("KycStatus.RibbonStatusMessage", "Unknown");
    }

    [Fact]
    public void GetRibbonAdditionalInfo_ShouldReturnValue()
    {
        var ribbon = new PosApiKycInfoForRibbon
        {
            AdditionalInfo = new List<KeyValue> { new KeyValue { Key = "0", Value = "Success" } },
        };
        Provider.Setup(p => p.GetAdditionalRibbonInfoAsync(Mode, "0"))
            .ReturnsAsync(ribbon.AdditionalInfo.FirstOrDefault()?.Value);
        EvaluateAndExpect("KycStatus.GetAdditionalRibbonInfo('0')", "Success");
    }

    [Fact]
    public void GetRibbonAdditionalInfo_ShouldReturnEmptyString_IfValueNotFound()
    {
        var ribbon = new PosApiKycInfoForRibbon
        {
            AdditionalInfo = new List<KeyValue> { new KeyValue { Key = "0", Value = "Success" } },
        };
        Provider.Setup(p => p.GetAdditionalRibbonInfoAsync(Mode, "0"))
            .ReturnsAsync(ribbon.AdditionalInfo.FirstOrDefault()?.Value);
        EvaluateAndExpect("KycStatus.GetAdditionalRibbonInfo('1')", string.Empty);
    }
}
