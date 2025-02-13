using System.ComponentModel;
using System.Threading.Tasks;
using Frontend.Vanilla.Core.System;

namespace Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

/// <summary>
/// Provides access to user's KYC status.
/// </summary>
[ValueVolatility(ValueVolatility.Client)]
[Description("Provides access to user's KYC status")]
public interface IKycStatusDslProvider
{
    /// <summary>
    /// Indicates user's verification status.
    /// </summary>
    [Description("Indicates user's verification status")]
    Task<string> GetVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// "Indicates number of GraceDaysUnit left.
    /// </summary>
    [Description("Indicates number of GraceDaysUnit left")]
    Task<decimal> GetVerificationDaysLeftAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's grace days unit (days or hours).
    /// </summary>
    [Description("Indicates user's grace days unit (days or hours)")]
    Task<string> GetGraceDaysUnitAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's grace days unit (days or hours).
    /// </summary>
    [Description(
        "Indicates user's grace days unit divisor that could be used to have other fields always in days.)")]
    Task<decimal> GetGraceDaysUnitDivisorAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's verification type.
    /// </summary>
    [Description("Indicates user's verification type")]
    Task<string> GetVerificationTypeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has already uploaded document with pending status.
    /// </summary>
    [Description("Indicates if user has already uploaded document with pending status")]
    Task<bool> DocumentUploadStatusIsPendingAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates uploaded document pending status.
    /// </summary>
    [Description("Indicates uploaded document pending status")]
    Task<string> GetDocsPendingWithAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has started the kyc process.
    /// </summary>
    [Description("Indicates if user has started the kyc process")]
    Task<bool> IsKycStartedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's email verification status.
    /// </summary>
    [Description("Indicates user's email verification status")]
    Task<string> GetEmailVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's age verification status.
    /// </summary>
    [Description("Indicates user's age verification status")]
    Task<string> GetAgeVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user's deposit is suppressed.
    /// </summary>
    [Description("Indicates if user's deposit is suppressed")]
    Task<bool> DepositSuppressedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's ssn verification status.
    /// </summary>
    [Description("Indicates user's ssn verification status")]
    Task<string> GetSsnVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates SSN verification status for for non-NJ environment.
    /// </summary>
    [Description("Indicates SSN verification status for for non-NJ environment")]
    Task<string> GetCustom3Async(ExecutionMode mode);

    /// <summary>
    /// Indicates third-party verification status.
    /// </summary>
    [Description("Indicates third-party verification status")]
    Task<string> GetCustom4Async(ExecutionMode mode);

    /// <summary>
    /// Indicates user's id verification status.
    /// </summary>
    [Description("Indicates user's id verification status")]
    Task<string> GetPersonalIdVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's account status.
    /// </summary>
    [Description("Indicates user's account status")]
    Task<string> GetAccountStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's bank verification status.
    /// </summary>
    [Description("Indicates user's bank verification status")]
    Task<string> GetBankIdVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's secret pin verification status.
    /// </summary>
    [Description("Indicates user's secret pin verification status")]
    Task<string> GetSecretPinVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user's bank account is registered.
    /// </summary>
    [Description("Indicates if user's bank account is registered")]
    Task<bool> BankAccountIsRegisteredAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has bonuses.
    /// </summary>
    [Description("Indicates if user has bonuses")]
    Task<bool> UserHasBonusesAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's address verification status.
    /// </summary>
    [Description("Indicates user's address verification status")]
    Task<string> GetAddressVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if account verification is required.
    /// </summary>
    [Description("Indicates if account verification is required")]
    Task<bool> AccountVerificationIsRequiredAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates number of user's deposit grace days.
    /// </summary>
    [Description("Indicates number of user's deposit grace days")]
    Task<decimal> GetDepositGraceDaysAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if KYC is verified.
    /// </summary>
    [Description("Indicates if KYC is verified")]
    Task<bool> KycVerifiedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates number of GraceDaysBeforeNextAction left.
    /// </summary>
    [Description("Indicates number of GraceDaysBeforeNextAction left")]
    Task<decimal> GetGraceDaysBeforeNextActionAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if BlackListAttempted.
    /// </summary>
    [Description("Indicates if BlackListAttempted")]
    Task<bool> IsBlackListAttemptedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user is transition player.
    /// </summary>
    [Description("Indicates if user is transition player")]
    Task<bool> IsTransitionPlayerAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has his contact information verified.
    /// </summary>
    [Description("Indicates if user has his contact information verified")]
    Task<bool> IsCommVerifiedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has his mobile number verified.
    /// </summary>
    [Description("Indicates if user has his mobile number verified")]
    Task<bool> IsMobileNumberVerifiedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if user has his email verified.
    /// </summary>
    [Description("Indicates if user has his email verified")]
    Task<bool> IsEmailVerifiedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates KYC authentication status.
    /// </summary>
    [Description("Indicates KYC authentication status.")]
    Task<string> KycAuthenticationStatus(ExecutionMode mode);

    /// <summary>
    /// Gets a value from the user's KYC status additional info collection with the given key. The key is case-insensitive.
    /// Returns an empty string if there is no value with the given key.
    /// </summary>
    [Description(
        "Gets a value from the user's KYC status additional info collection with the given key. The key is case-insensitive. Returns an empty string if there is no value with the given key.")]
    Task<string> GetAdditionalKycInfoAsync(ExecutionMode mode, string key);

    /// <summary>
    /// Indicates user's ribbon status code.
    /// </summary>
    [Description("Indicates user's ribbon status code")]
    Task<string> GetRibbonStatusCodeAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates user's ribbon status message.
    /// </summary>
    [Description("Indicates user's ribbon status message")]
    Task<string> GetRibbonStatusMessageAsync(ExecutionMode mode);

    /// <summary>
    /// Gets a value from the user's ribbon additional info collection with the given key. The key is case-insensitive.
    /// Returns an empty string if there is no value with the given key.
    /// </summary>
    [Description(
        "Gets a value from the user's ribbon additional info collection with the given key. The key is case-insensitive. Returns an empty string if there is no value with the given key.")]
    Task<string> GetAdditionalRibbonInfoAsync(ExecutionMode mode, string key);

    /// <summary>
    /// Indicates if the player is partially verified (German AML).
    /// </summary>
    [Description("Indicates if the player is partially verified (German AML)")]
    Task<bool> IsPartiallyVerifiedAsync(ExecutionMode mode);

    /// <summary>
    /// Indicates if F2F is required for the user (German AML).
    /// </summary>
    [Description("Indicates if F2F is required for the user (German AML)")]
    Task<bool> IsF2FVerificationRequiredAsync(ExecutionMode mode);

    /// <summary>
    /// AML verification status of the player (NJ only).
    /// </summary>
    [Description("AML verification status of the player (NJ only).")]
    Task<string> GetAmlVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// If player is black listed or not.
    /// </summary>
    [Description("If player is black listed or not.")]
    Task<string> GetBlackListVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Verification grace days. Not used in US.
    /// </summary>
    [Description("Verification grace days. Not used in US.")]
    Task<decimal> GetIdVerificationGraceDaysAsync(ExecutionMode mode);

    /// <summary>
    /// ID verification status of the player.
    /// </summary>
    [Description("ID verification status of the player.")]
    Task<string> GetIdVerificationStatusAsync(ExecutionMode mode);

    /// <summary>
    /// Used attempts for online KYC verification.
    /// </summary>
    [Description("Used attempts for online KYC verification.")]
    Task<decimal> GetKycAttemptsAsync(ExecutionMode mode);

    /// <summary>
    /// Max attempts for online KYC verification.
    /// </summary>
    [Description("Max attempts for online KYC verification.")]
    Task<decimal> GetKycMaxAttemptsAsync(ExecutionMode mode);

    /// <summary>
    /// Whether max attempt reached or not for KYC verification.
    /// </summary>
    [Description("Whether max attempt reached or not for KYC verification.")]
    Task<bool> IsKycMaxAttemptsReachedAsync(ExecutionMode mode);

    /// <summary>
    /// Used attempts for SSN verification.
    /// </summary>
    [Description("Used attempts for SSN verification.")]
    Task<decimal> GetSsnVerificationAttemptsAsync(ExecutionMode mode);

    /// <summary>
    /// Max attempts of SSN verification.
    /// </summary>
    [Description("Max attempts of SSN verification.")]
    Task<decimal> GetSsnVerificationMaxAttemptsAsync(ExecutionMode mode);

    /// <summary>
    /// Whether max attempts reached for SSN verification.
    /// </summary>
    [Description("Whether max attempts reached for SSN verification.")]
    Task<bool> IsSsnVerificationMaxAttemptsReachedAsync(ExecutionMode mode);

    /// <summary>
    /// ThirdPartyVerificationStatus verification status.
    /// </summary>
    [Description("ThirdPartyVerificationStatus verification status.")]
    Task<string> GetThirdPartyVerificationStatusAsync(ExecutionMode mode);
}
