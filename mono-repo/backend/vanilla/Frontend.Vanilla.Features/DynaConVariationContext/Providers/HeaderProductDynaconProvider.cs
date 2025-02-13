using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

namespace Frontend.Vanilla.Features.DynaConVariationContext.Providers;

/// <summary>
/// Provides information about product the request is originating from.
/// </summary>
internal sealed class HeaderProductDynaconProvider(IDynaConParameterExtractor dynaConParameterExtractor, ICurrentProductResolver currentProductResolver)
    : IWebDynaConVariationContextProvider
{
    public TrimmedRequiredString Name { get; } = "HeaderProduct";
    public TrimmedRequiredString DefaultValue => dynaConParameterExtractor.Product;

    public string GetCurrentRawValue()
        => currentProductResolver.ProductLegacy;
}
