using Frontend.Vanilla.Features.Diagnostics.SiteVersion;

namespace Frontend.TestWeb;

public class TestWebDiagnosticsComponentProvider : IDiagnosticsComponentProvider
{
    public string Name => PlaygroundPlugin.Product.Name;
}
