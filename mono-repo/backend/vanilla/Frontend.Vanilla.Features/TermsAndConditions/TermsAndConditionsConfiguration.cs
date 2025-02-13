#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.TermsAndConditions;

#pragma warning disable CS1591 // Missing XML comment for publicly visible type or member
public interface ITermsAndConditionsConfiguration
{
    string AbsoluteContentRoot { get; }
    string TncSectionTemplate { get; }
    string MiscTncSectionTemplate { get; }
    IReadOnlyDictionary<string, string> TncSectionByTemplateId { get; }
    string CampaignTncSectionTemplate { get; }
    string CampaignMiscTncSectionTemplate { get; }
    IReadOnlyDictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> OddsBoostKeyValues { get; }
    IReadOnlyDictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> RiskFreeBetKeyValues { get; }
    string StaticKeyValues { get; }
}

internal sealed class TermsAndConditionsConfiguration : ITermsAndConditionsConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.TermsAndConditions";

    public string AbsoluteContentRoot { get; set; }
    public string TncSectionTemplate { get; set; }
    public string MiscTncSectionTemplate { get; set; }
    public IReadOnlyDictionary<string, string> TncSectionByTemplateId { get; set; }
    public string CampaignTncSectionTemplate { get; set; }
    public string CampaignMiscTncSectionTemplate { get; set; }
    public IReadOnlyDictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> OddsBoostKeyValues { get; set; }
    public IReadOnlyDictionary<TrimmedRequiredString, OddsBoostRiskFreeBetMetadata> RiskFreeBetKeyValues { get; set; }

    public string StaticKeyValues { get; set; }
}

public sealed class OddsBoostRiskFreeBetMetadata(TrimmedRequiredString name, TrimmedRequiredString type)
{
    public TrimmedRequiredString Name { get; set; } = name;
    public TrimmedRequiredString Type { get; set; } = type;
}
