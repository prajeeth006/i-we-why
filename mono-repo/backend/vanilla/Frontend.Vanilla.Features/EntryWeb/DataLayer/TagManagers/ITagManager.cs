using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;

/// <summary>
/// Renders a Tag Manager (a script and optionally a configuration).
/// </summary>
internal interface ITagManager
{
    bool IsEnabled { get; }

    bool ClientInjectionEnabled { get; }

    TrimmedRequiredString Name { get; }

    string RenderBootstrapScript(bool skipClientInjectionConfigCheck = false);

    string GetClientScript();
}
