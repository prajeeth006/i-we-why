using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.Configuration.DynaCon.Container;

/// <summary>
/// Wraps all configuration related information at particular time.
/// </summary>
internal interface IConfigurationSnapshotFactory
{
    IConfigurationSnapshot Recreate(
        IConfigurationSnapshot snapshot,
        IValidChangeset? activeChangeset = null,
        IEnumerable<IChangeset>? changesetsToAdd = null);
}

internal sealed class ConfigurationSnapshotFactory(IHistoryLog<PastChangesetInfo> pastChangesetsLog, IClock clock) : IConfigurationSnapshotFactory
{
    public IConfigurationSnapshot Recreate(IConfigurationSnapshot snapshot, IValidChangeset? activeChangeset, IEnumerable<IChangeset>? changesetsToAdd)
    {
        if (snapshot.OverriddenChangeset != null)
            throw new ArgumentException("OverriddenChangeset can't be specified at this point.", nameof(snapshot));

        var now = clock.UtcNow;
        var validFrom = activeChangeset?.ValidFrom;
        if (validFrom > now)
            throw new Exception(
                "ValidFrom of new specified ActiveChangeset must by less than or equal to now otherwise it's a future changeset which can't be activated yet"
                + $" but #{activeChangeset?.Id} has ValidFrom={validFrom} while now={now}.");

        activeChangeset ??= snapshot.ActiveChangeset;
        var otherChangesets = changesetsToAdd
            .NullToEmpty()
            .Concat(snapshot.FutureChangesets)
            .Append(snapshot.ActiveChangeset)
            .Where(c => c.Id != activeChangeset.Id)
            .Distinct(c => c.Id)
            .ToList();

        var futureChangesets = otherChangesets
            .Where(c => c.ValidFrom > activeChangeset.ValidFrom)
            .ToList();

        pastChangesetsLog.AddRange(otherChangesets
            .Except(futureChangesets)
            .Select(c => new PastChangesetInfo(c.Id, c.ValidFrom, c is IValidChangeset)));

        return new ConfigurationSnapshot(activeChangeset, futureChangesets);
    }
}
