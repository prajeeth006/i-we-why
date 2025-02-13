using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.Kyc;

internal interface IKycConfiguration
{
    [Required]
    bool IsRibbonStatusEnabled { get; }

    [Required]
    Dictionary<string, IDslExpression<bool>> UserKycStatus { get; }
}

internal class KycConfiguration(bool isRibbonStatusEnabled, Dictionary<string, IDslExpression<bool>> userKycStatus) : IKycConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.Kyc";

    public bool IsRibbonStatusEnabled { get; set; } = isRibbonStatusEnabled;

    public Dictionary<string, IDslExpression<bool>> UserKycStatus { get; set; } = userKycStatus;
}
