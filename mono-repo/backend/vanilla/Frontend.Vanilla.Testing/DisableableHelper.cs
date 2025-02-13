using System;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Configuration;

namespace Frontend.Vanilla.Testing;

/// <summary>
///     Utility for apply <see cref="IDisableableGuard" /> on <see cref="IDisableableConfiguration" /> in tests.
/// </summary>
public static class DisableableHelper
{
    /// <summary>
    ///     Decorates configuration by <see cref="IDisableableGuard" /> so that it has same behavior as in production.
    /// </summary>
    public static TConfiguration GetGuardedDisableable<TConfiguration>(this TConfiguration config)
        where TConfiguration : IDisableableConfiguration
    {
        if (!typeof(TConfiguration).IsInterface)
        {
            var suggestedInterface = typeof(TConfiguration).GetInterfaces().Except(typeof(IDisableableConfiguration)).FirstOrDefault();

            throw new ArgumentException(
                "Unable to decorate config by disableable guard because you haven't provided its interface."
                + (suggestedInterface != null ? $" Most likely you need to write: config.{nameof(GetGuardedDisableable)}<{suggestedInterface.Name}>()" : null));
        }

        var guard = new DisableableGuard();

        return (TConfiguration)guard.Decorate(typeof(TConfiguration), config);
    }
}
