using System.Globalization;

namespace Frontend.Vanilla.Core.Time.Background;

/// <summary>
/// Passes culture to background operation.
/// </summary>
internal sealed class CultureBackgroundWorkInitializer : IBackgroundWorkInitializer
{
    public SetupBackgroundContextHandler CaptureParentContext()
    {
        var culture = CultureInfo.CurrentCulture;

        return () =>
        {
            CultureInfo.CurrentCulture = culture;
            CultureInfo.CurrentUICulture = culture;
        };
    }
}
