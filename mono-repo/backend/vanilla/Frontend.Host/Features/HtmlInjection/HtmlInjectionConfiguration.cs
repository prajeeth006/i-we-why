#nullable disable
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;

namespace Frontend.Host.Features.HtmlInjection;

internal interface IHtmlInjectionConfiguration
{
    bool EnableHtmlHeadTagsFromSitecore { get; }
    IDictionary<string, HeadTags> DslHeadTags { get; }
}

internal sealed class HtmlInjectionConfiguration : IHtmlInjectionConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.HtmlInjection";

    public bool EnableHtmlHeadTagsFromSitecore { get; set; }

    [Required]
    public IDictionary<string, HeadTags> DslHeadTags { get; set; }
}

internal sealed class HeadTags
{
    public IDslExpression<bool> Condition { get; set; }
    public IReadOnlyDictionary<string, IDictionary<string, string>> Tags { get; set; }
}
