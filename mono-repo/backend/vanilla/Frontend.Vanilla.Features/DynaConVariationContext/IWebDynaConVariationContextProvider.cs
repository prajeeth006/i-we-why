using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.DynaConVariationContext;

/// <summary>
/// Provides raw value for <see cref="IDynaConVariationContextProvider" /> for web app.
/// </summary>
internal interface IWebDynaConVariationContextProvider
{
    TrimmedRequiredString Name { get; }

    TrimmedRequiredString DefaultValue { get; }

    string? GetCurrentRawValue();
}
