using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;

namespace Frontend.Vanilla.Configuration.DynaCon.Container;

/// <summary>
/// Wraps all configuration state at discrete time.
/// </summary>
internal interface IConfigurationSnapshot
{
    /// <summary>The latest valid changeset till now which is used to retrieve actual configuration.</summary>
    IValidChangeset ActiveChangeset { get; }

    /// <summary>Overrides <see cref="ActiveChangeset" />.</summary>
    IValidChangeset? OverriddenChangeset { get; }

    /// <summary>All changesets supposed to be active after <see cref="ActiveChangeset" />.</summary>
    IReadOnlyList<IChangeset> FutureChangesets { get; }

    /// <summary>Changeset with the latest <see cref="IChangeset.ValidFrom" /> among <see cref="ActiveChangeset" /> and <see cref="FutureChangesets" />.</summary>
    IChangeset LatestChangeset { get; }
}

internal sealed class ConfigurationSnapshot : IConfigurationSnapshot
{
    public IValidChangeset ActiveChangeset { get; }
    public IValidChangeset? OverriddenChangeset { get; }
    public IReadOnlyList<IChangeset> FutureChangesets { get; }
    public IChangeset LatestChangeset { get; }

    public ConfigurationSnapshot(
        IValidChangeset activeChangeset,
        IEnumerable<IChangeset>? futureChangesets = null,
        IValidChangeset? overriddenChangeset = null)
    {
        if (overriddenChangeset != null && overriddenChangeset.Id != activeChangeset.Id)
            throw new ArgumentException(
                $"Specified overridden changeset is #{overriddenChangeset.Id} but it can override only specified active changeset #{activeChangeset.Id}.");

        ActiveChangeset = activeChangeset;
        FutureChangesets = futureChangesets
            .NullToEmpty()
            .OrderBy(c => c.ValidFrom)
            .ToArray()
            .AsReadOnly();
        OverriddenChangeset = overriddenChangeset;
        LatestChangeset = FutureChangesets
            .Append(activeChangeset)
            .OrderByDescending(c => c.ValidFrom)
            .First();
    }
}
