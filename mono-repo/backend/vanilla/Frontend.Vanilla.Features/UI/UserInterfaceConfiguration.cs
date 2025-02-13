using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.DomainSpecificLanguage.Compilation;

namespace Frontend.Vanilla.Features.UI;

internal sealed class ImageProfileSet(string prefix, IReadOnlyList<int> widthBreakpoints)
{
    public string Prefix { get; } = prefix;
    public IReadOnlyList<int> WidthBreakpoints { get; } = widthBreakpoints;
}

internal interface IUserInterfaceConfiguration
{
    string Theme { get; }
    IReadOnlyDictionary<string, string> Currency { get; }
    IReadOnlyList<string> UserDisplayNameProperties { get; }
    IReadOnlyDictionary<string, ImageProfileSet> ImageProfiles { get; }
    string Viewport { get; }
    IDslExpression<bool> ScrollBehaviorEnabledCondition { get; }
    IReadOnlyDictionary<string, string> Breakpoints { get; }
    IReadOnlyDictionary<string, string> HtmlSourceTypeReplace { get; }
    bool EnableDsScrollbar { get; }
}

internal sealed class UserInterfaceConfiguration(
    string theme,
    IReadOnlyDictionary<string, string> currency,
    IReadOnlyList<string> userDisplayNameProperties,
    IReadOnlyDictionary<string, ImageProfileSet> imageProfiles,
    string viewport,
    IDslExpression<bool> scrollBehaviorEnabledCondition,
    IReadOnlyDictionary<string, string> breakpoints,
    IReadOnlyDictionary<string, string> htmlSourceTypeReplace,
    bool enableDsScrollbar)

    : IUserInterfaceConfiguration
{
    public const string FeatureName = "VanillaFramework.Web.UI";

    [Required]
    public string Theme { get; } = theme;

    [Required]
    public IReadOnlyDictionary<string, string> Currency { get; } = currency;

    public IReadOnlyList<string> UserDisplayNameProperties { get; } = userDisplayNameProperties;
    public IReadOnlyDictionary<string, ImageProfileSet> ImageProfiles { get; } = imageProfiles;

    [Required]
    public string Viewport { get; } = viewport;

    [Required]
    public IDslExpression<bool> ScrollBehaviorEnabledCondition { get; } = scrollBehaviorEnabledCondition;

    public IReadOnlyDictionary<string, string> Breakpoints { get; } = breakpoints;

    public IReadOnlyDictionary<string, string> HtmlSourceTypeReplace { get; } = htmlSourceTypeReplace;

    public bool EnableDsScrollbar { get; } = enableDsScrollbar;
}
