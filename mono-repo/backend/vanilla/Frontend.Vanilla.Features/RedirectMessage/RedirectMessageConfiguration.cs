#nullable disable
using System.Collections.Generic;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Vanilla.Features.RedirectMessage;

internal interface IRedirectMessageConfiguration : IDisableableConfiguration
{
    IEnumerable<RedirectRules> Rules { get; }
}

internal sealed class RedirectMessageConfiguration : IRedirectMessageConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI.RedirectMessage";

    public bool IsEnabled { get; set; }
    public IEnumerable<RedirectRules> Rules { get; set; }
}

internal sealed class RedirectRules
{
    public IDslExpression<bool> Condition { get; set; }
    public Redirect Redirect { get; set; }
}

internal sealed class Redirect
{
    public string Label { get; set; }
    public string Url { get; set; }
}
