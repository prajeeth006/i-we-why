using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Features.UserDocuments;

internal interface IUserDocumentsConfiguration
{
    [Required]
    bool IsEnabled { get; }

    [Required]
    Dictionary<string, string[]> DocumentVerificationStatus { get; }

    [Required]
    decimal DepositLimitNoticeThreshold { get; }

    [Required]
    TimeSpan VerifiedDocumentsVisibilityTimespan { get; }
}

internal class UserDocumentsConfiguration(
    bool isEnabled,
    Dictionary<string, string[]> documentVerificationStatus,
    decimal depositLimitNoticeThreshold,
    TimeSpan verifiedDocumentsVisibilityTimespan)
    : IUserDocumentsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.UserDocuments";

    public bool IsEnabled { get; set; } = isEnabled;

    public Dictionary<string, string[]> DocumentVerificationStatus { get; set; } = documentVerificationStatus;

    public decimal DepositLimitNoticeThreshold { get; set; } = depositLimitNoticeThreshold;

    public TimeSpan VerifiedDocumentsVisibilityTimespan { get; set; } = verifiedDocumentsVisibilityTimespan;
}
