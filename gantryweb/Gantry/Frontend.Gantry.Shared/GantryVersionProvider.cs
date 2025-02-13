using Bwin.Vanilla.Core.Reflection;
using Bwin.Vanilla.Features.Diagnostics.SiteVersion;

namespace Frontend.Gantry.Shared
{
    public class GantryVersionProvider : IDiagnosticsVersionProvider
    {
        public GantryVersionProvider()
        {
            Version = typeof(GantryVersionProvider).Assembly.GetFullVersion();
        }
        public string Name => "Gantry";
        public string Version { get; }
    }
}