using System;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Core.Configuration;

/// <summary>
/// Provides a sorted list of environments for configuration purposes.
/// </summary>
public interface IEnvironmentProvider
{
    /// <summary>Gets the name of environment that this app is running in e.g. qa2, prod.</summary>
    TrimmedRequiredString Environment { get; }

    /// <summary>Denotes whether the app runs in the production environment or not.</summary>
    bool IsProduction { get; }

    /// <summary>
    /// Gets the label dynamically resolved according to current context so it should be obtained just-in-time, not during app startup.
    /// Vanilla webs resolve the value from hostname of current HTTP request, but label positioning can be on start or end of host string. Examples: bwin.com, casino.nj.partycasino.com.
    /// </summary>
    TrimmedRequiredString CurrentLabel { get; }

    /// <summary>
    /// Gets the top level domain from end of host string always - dynamically resolved according to current context so it should be obtained just-in-time, not during app startup.
    /// Vanilla webs resolve the value from hostname of current HTTP request. Examples: bwin.com, casino.nj.partycasino.com.
    /// </summary>
    TrimmedRequiredString CurrentDomain { get; }

    /// <summary>
    /// Gets a value indicating whether the app runs as part of single domain app (either as the single domain host/entry web) or
    /// one of REST APIs that are being called from the host app.
    /// </summary>
    bool IsSingleDomainApp { get; }
}

/// <summary>Extensions for <see cref="IEnvironmentProvider" />.</summary>
public static class EnvironmentProviderExtensions
{
    /// <summary>Determines if given URL corresponds to <see cref="IEnvironmentProvider.CurrentLabel" />.</summary>
    public static bool IsCurrentLabel(this IEnvironmentProvider provider, Uri? uri)
        => uri != null && uri.IsAbsoluteUri && uri.Host.EndsWithIgnoreCase("." + provider.CurrentLabel);
}
