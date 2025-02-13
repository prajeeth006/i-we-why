using System.Collections.Generic;
using System.Linq;

namespace Frontend.Vanilla.Configuration.DynaCon.Initialization;

/// <summary>
/// Executes multiple initializers in specified order.
/// </summary>
internal sealed class CompositeInitializer(IEnumerable<IConfigurationInitializer> initializers) : IConfigurationInitializer
{
    private readonly IReadOnlyList<IConfigurationInitializer> initializers = initializers.ToArray();

    public void Initialize()
    {
        foreach (var initializer in initializers)
            initializer.Initialize();
    }
}
