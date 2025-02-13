using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Configuration.DynaCon.Context;

/// <summary>
/// Provides a dynamic value for variation context property for selecting appropriate configuration at runtime.
/// </summary>
internal interface IDynaConVariationContextProvider
{
    /// <summary>
    /// Gets the name of variation context property provided.
    /// </summary>
    TrimmedRequiredString Name { get; }

    /// <summary>
    /// Gets the current value of variation context property.
    /// Value can't be null in order to be able to target specific state by variation context.
    /// </summary>
    TrimmedRequiredString GetCurrentValue(ReadOnlySet<TrimmedRequiredString> definedValues);
}
