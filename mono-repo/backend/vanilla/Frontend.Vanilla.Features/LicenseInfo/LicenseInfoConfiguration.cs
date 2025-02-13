using System.Collections.Generic;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Features.LicenseInfo;

internal interface ILicenseInfoConfiguration : IDisableableConfiguration
{
    IReadOnlyDictionary<string, IReadOnlyList<string>> LicenceInfo { get; }
    string Url { get; }
}

internal sealed class LicenseInfoConfiguration : ILicenseInfoConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.LicenseCompliance";
    public IReadOnlyDictionary<string, IReadOnlyList<string>> LicenceInfo { get; set; } = new Dictionary<string, IReadOnlyList<string>>();

    public bool IsEnabled { get; set; }

    public string Url { get; set; } = "";
}
