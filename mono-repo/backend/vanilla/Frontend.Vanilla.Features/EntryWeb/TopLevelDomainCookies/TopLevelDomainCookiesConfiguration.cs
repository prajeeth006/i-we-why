#nullable disable

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Features.EntryWeb.TopLevelDomainCookies;

internal interface ITopLevelDomainCookiesConfiguration
{
    CookieDomainConfiguration Cleanup { get; }
    CookieDomainConfiguration SetCookieDomain { get; }
}

internal sealed class TopLevelDomainCookiesConfiguration(CookieDomainConfiguration cleanup, CookieDomainConfiguration setCookieDomain)
    : ITopLevelDomainCookiesConfiguration
{
    public const string FeatureName = "VanillaFramework.Features.TopLevelDomainCookies";
    public CookieDomainConfiguration Cleanup { get; } = cleanup;
    public CookieDomainConfiguration SetCookieDomain { get; } = setCookieDomain;
}

internal class CookieDomainConfiguration : IValidatableObject
{
    public IReadOnlyList<string> Cookies { get; set; }
    public string Domain { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (Cookies.Count > 0 && string.IsNullOrWhiteSpace(Domain))
            yield return new ValidationResult("Domain must be configured because feature is activated.");
    }
}
