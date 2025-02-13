using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.EntryWeb.DataLayer.TagManagers;

namespace Frontend.TestWeb.Features;

internal class DummyTagManagerRenderer : ITagManager
{
    public bool IsEnabled => true;
    public TrimmedRequiredString Name => "DummyTagManagerRenderer";
    public bool ClientInjectionEnabled => false;

    public string RenderBootstrapScript(bool skipClientInjectionConfigCheck = false)
    {
        return "<script id='dummy-tag-manager' type='text/javascript'>console.log('Dummy Tag Manager loaded');</script>";
    }

    public string GetClientScript()
        => throw new NotSupportedException();
}
