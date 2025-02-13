using System.Globalization;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides culture based on current thread for config variation context.
/// </summary>
internal sealed class CultureDynaConProvider : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "Culture";
    public TrimmedRequiredString DefaultValue { get; } = "unknown";

    public string GetCurrentRawValue()
        => CultureInfo.CurrentCulture.Name;
}
