using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.WebIntegration.Configuration.DynaCon;

/// <summary>
/// Extracts DynaCon parameters from configuration.
/// </summary>
internal interface IDynaConParameterExtractor
{
    /// <summary>
    /// Indicates the current product.
    /// </summary>
    TrimmedRequiredString Product { get; }
}

internal sealed class DynaConParameterExtractor : IDynaConParameterExtractor
{
    public TrimmedRequiredString Product { get; }

    public DynaConParameterExtractor(DynaConEngineSettings settings)
    {
        Product = ExtractParameter(DynaConParameter.ContextPrefix + "product");

        TrimmedRequiredString ExtractParameter(string name)
        {
            var param = settings.TenantBlueprint.Parameters.FirstOrDefault(x => x.Name.Equals(name, StringComparison.OrdinalIgnoreCase));

            return param?.Value ?? throw new Exception(
                $"Missing mandatory DynaCon parameter '{name}'."
                + $" Specify it in 'dynaCon' web.config section or register as {typeof(DynaConParameter)} in Autofac."
                + $" Current parameters: {settings.TenantBlueprint.Parameters.Join()}");
        }
    }
}
