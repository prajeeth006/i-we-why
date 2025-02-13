using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Crm2.Models;

namespace Frontend.Vanilla.ServiceClients.Services.Kyc.Models;

internal sealed class KycStatus
{
    public string GraceDaysUnit { get; set; }
    public int DepositGraceDays { get; set; }
    public bool F2FVerificationRequired { get; set; }
    public bool PartiallyVerified { get; set; }
    public int EmailVerificationStatus { get; set; }
    public bool IsKycStarted { get; set; }
    public int AccountStatus { get; set; }
    public int GraceDaysBeforeNextAction { get; set; }
    public int SecretPinVerificationStatus { get; set; }
    public int BankIdVerificationStatus { get; set; }
    public int PersonalIdVerificationStatus { get; set; }
    public string SsnVerificationStatus { get; set; }
    public bool SsnVerificationMaxAttemptsReached { get; set; }
    public int SsnVerificationMaxAttempts { get; set; }
    public int SsnVerificationAttempts { get; set; }
    public int KycMaxAttempts { get; set; }
    public bool KycMaxAttemptsReached { get; set; }
    public int VerificationType { get; set; }
    public int VerificationStatus { get; set; }
    public int VerificationDaysLeft { get; set; }
    public string AddressVerificationStatus { get; set; }
    public int AgeVerificationGraceDays { get; set; }
    public DateTime AgeVerificationGracePeriod { get; set; }
    public bool KycVerified { get; set; }
    public string AgeVerificationStatus { get; set; }
    public string BlackListVerificationStatus { get; set; }
    public DateTime CreateDate { get; set; }
    public int IdVerificationGraceDays { get; set; }
    public string IdVerificationStatus { get; set; }
    public DateTime IdVerificationGracePeriod { get; set; }
    public int KycAttempts { get; set; }
    public string AmlVerificationStatus { get; set; }
    public string ThirdPartyVerificationStatus { get; set; } // Same as Custom4
    public IReadOnlyList<KeyValue> AdditionalKycInfo { get; set; }
    public string Custom3 { get; set; }
    public string Custom4 { get; set; } // Same as ThirdPartyVerificationStatus
}
