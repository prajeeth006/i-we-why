using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc;

internal static class KycStatusExtensions
{
    public static string GetKycAuthenticationStatus(this IKycStatus kycStatus) => string.IsNullOrWhiteSpace(kycStatus.Custom3) ? "Unknown" : kycStatus.Custom3;
}

internal interface IKycStatus
{
    KycAccountStatus AccountStatus { get; }
    KycVerificationStatus AddressVerificationStatus { get; }
    int AgeVerificationGraceDays { get; set; }
    DateTime AgeVerificationGracePeriod { get; set; }
    KycVerificationStatus AgeVerificationStatus { get; }
    string AmlVerificationStatus { get; }
    KycBankIdVerificationStatus BankIdVerificationStatus { get; }
    string BlackListVerificationStatus { get; }
    DateTime CreateDate { get; }
    EmailVerificationStatus EmailVerificationStatus { get; }
    bool F2FVerificationRequired { get; }
    int GraceDaysBeforeNextAction { get; }
    int IdVerificationGraceDays { get; }
    DateTime IdVerificationGracePeriod { get; }
    KycVerificationStatus IdVerificationStatus { get; }
    bool IsKycStarted { get; }
    int KycAttempts { get; }
    int KycMaxAttempts { get; }
    bool KycMaxAttemptsReached { get; }
    bool PartiallyVerified { get; }
    KycPersonalIdVerificationStatus PersonalIdVerificationStatus { get; }
    KycSecretPinVerificationStatus SecretPinVerificationStatus { get; }
    int SsnVerificationAttempts { get; }
    int SsnVerificationMaxAttempts { get; }
    bool SsnVerificationMaxAttemptsReached { get; }
    KycVerificationStatus SsnVerificationStatus { get; }
    string ThirdPartyVerificationStatus { get; }
    int VerificationDaysLeft { get; }
    KycVerificationStatus VerificationStatus { get; }
    KycVerificationType VerificationType { get; }
    int DepositGraceDays { get; }
    string GraceDaysUnit { get; }
    bool KycVerified { get; }
    IReadOnlyList<KeyValue> AdditionalKycInfo { get; }
    string Custom3 { get; } // SsnVerificationStatus
    string Custom4 { get; } // ThirdPartyVerificationStatus
}

internal enum KycVerificationType
{
    Unspecified = -1,
    Document = 0,
    Id = 1,
    Age = 2,
}

internal enum KycVerificationStatus
{
    Failed = -2,
    Unknown = -1,
    Pending = 0,
    NotStarted = 1,
    DuplicateAccount = 2,
    Verified = 3,
    New = 4,
    Alerted = 5,
    Blacklisted = 6,
}

internal enum KycSecretPinVerificationStatus
{
    Unknown = -1,
    Verified = 1,
    New = 2,
    Inproc = 3,
}

internal enum KycBankIdVerificationStatus
{
    Unknown = -1,
    Pending = 0,
    Verified = 1,
    New = 2,
}

internal enum KycPersonalIdVerificationStatus
{
    Failed = -2,
    Unknown = -1,
    Pending = 0,
    Verified = 1,
    New = 2,
}

internal enum KycAccountStatus
{
    Unknown = -1,
    Deactivated = 0,
    Verified = 1,
    Closed = 2,
    Blocked = 3,
    Unverified = 4,
}

internal sealed class PosApiKycStatus : IKycStatus
{
    public PosApiKycStatus()
    {
        AmlVerificationStatus = "Unknown";
        BlackListVerificationStatus = "Unknown";
        CreateDate = default;
        F2FVerificationRequired = false;
        IdVerificationGraceDays = -1;
        IdVerificationGracePeriod = default;
        IdVerificationStatus = KycVerificationStatus.Unknown;
        IsKycStarted = false;
        KycVerified = false;
        KycAttempts = -1;
        KycMaxAttempts = -1;
        KycMaxAttemptsReached = false;
        PartiallyVerified = false;
        GraceDaysUnit = "Unknown";
        Custom3 = "Unknown";
        Custom4 = "Unknown";
        VerificationDaysLeft = -1;
        DepositGraceDays = -1;
        VerificationStatus = KycVerificationStatus.Unknown;
        VerificationType = KycVerificationType.Unspecified;
        PersonalIdVerificationStatus = KycPersonalIdVerificationStatus.Unknown;
        BankIdVerificationStatus = KycBankIdVerificationStatus.Unknown;
        SecretPinVerificationStatus = KycSecretPinVerificationStatus.Unknown;
        AccountStatus = KycAccountStatus.Unknown;
        EmailVerificationStatus = EmailVerificationStatus.Unknown;
        SsnVerificationStatus = KycVerificationStatus.Unknown;
        SsnVerificationAttempts = -1;
        SsnVerificationMaxAttempts = -1;
        SsnVerificationMaxAttemptsReached = false;
        AddressVerificationStatus = KycVerificationStatus.Unknown;
        AgeVerificationStatus = KycVerificationStatus.Unknown;
        GraceDaysBeforeNextAction = -1;
        ThirdPartyVerificationStatus = "Unknown";
        AdditionalKycInfo = new List<KeyValue>();
    }

    public KycAccountStatus AccountStatus { get; set; }
    public KycVerificationStatus AddressVerificationStatus { get; set; }
    public int AgeVerificationGraceDays { get; set; }
    public DateTime AgeVerificationGracePeriod { get; set; }
    public KycVerificationStatus AgeVerificationStatus { get; set; }
    public string AmlVerificationStatus { get; set; }
    public KycBankIdVerificationStatus BankIdVerificationStatus { get; set; }
    public string BlackListVerificationStatus { get; set; }
    public DateTime CreateDate { get; set; }
    public EmailVerificationStatus EmailVerificationStatus { get; set; }
    public bool F2FVerificationRequired { get; set; }
    public int GraceDaysBeforeNextAction { get; set; }
    public int IdVerificationGraceDays { get; set; }
    public DateTime IdVerificationGracePeriod { get; set; }
    public KycVerificationStatus IdVerificationStatus { get; set; }
    public bool IsKycStarted { get; set; }
    public int KycAttempts { get; set; }
    public int KycMaxAttempts { get; set; }
    public bool KycMaxAttemptsReached { get; set; }
    public bool PartiallyVerified { get; set; }
    public KycPersonalIdVerificationStatus PersonalIdVerificationStatus { get; set; }
    public KycSecretPinVerificationStatus SecretPinVerificationStatus { get; set; }
    public int SsnVerificationAttempts { get; set; }
    public int SsnVerificationMaxAttempts { get; set; }
    public bool SsnVerificationMaxAttemptsReached { get; set; }
    public KycVerificationStatus SsnVerificationStatus { get; set; }
    public string ThirdPartyVerificationStatus { get; set; }
    public int VerificationDaysLeft { get; set; }
    public KycVerificationStatus VerificationStatus { get; set; }
    public KycVerificationType VerificationType { get; set; }
    public int DepositGraceDays { get; set; }
    public string GraceDaysUnit { get; set; }
    public bool KycVerified { get; set; }
    public IReadOnlyList<KeyValue> AdditionalKycInfo { get; set; }
    public string Custom3 { get; set; }
    public string Custom4 { get; set; }
}
