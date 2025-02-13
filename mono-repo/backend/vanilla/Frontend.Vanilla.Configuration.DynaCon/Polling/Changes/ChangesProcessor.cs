using System.Collections.Generic;
using System.Linq;
using Bwin.DynaCon.Api.Contracts.V1;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization;
using Frontend.Vanilla.Configuration.DynaCon.Deserialization.A_Changeset;
using Frontend.Vanilla.Configuration.DynaCon.Reporting;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Time;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;

/// <summary>
/// Creates new snapshot based on given config changes.
/// </summary>
internal interface IChangesProcessor
{
    IConfigurationSnapshot Process(IConfigurationSnapshot snapshot, IEnumerable<ConfigurationResponse> changes, VariationHierarchyResponse contextHierarchy);
}

internal sealed class ChangesProcessor(
    IChangesetDeserializer deserializer,
    IActivateChangesetScheduler activationScheduler,
    IConfigurationSnapshotFactory snapshotFactory,
    IHistoryLog<PastChangesetInfo> pastChangesetsLog,
    IClock clock)
    : IChangesProcessor
{
    public IConfigurationSnapshot Process(IConfigurationSnapshot oldSnapshot, IEnumerable<ConfigurationResponse> changes, VariationHierarchyResponse contextHierarchy)
    {
        var pastChangesets = pastChangesetsLog.GetItems();
        var existingIds = oldSnapshot.FutureChangesets
            .Append(oldSnapshot.ActiveChangeset)
            .Select(c => c.Id)
            .Concat(pastChangesets.Select(i => i.Id))
            .ToHashSet();

        var discoveredChangesets = changes
            .Where(c => !existingIds.Contains(c.ChangesetId))
            .Select(c => Deserialize(c, contextHierarchy))
            .ToList();

        if (discoveredChangesets.Count == 0)
            return oldSnapshot;

        // If several polls have failed, there may be config which should be already active, let's check
        var now = clock.UtcNow;
        var newActiveChangeset = discoveredChangesets
                                     .OfType<IValidChangeset>()
                                     .Where(c => c.ValidFrom <= now && c.ValidFrom > oldSnapshot.ActiveChangeset.ValidFrom)
                                     .OrderByDescending(c => c.ValidFrom)
                                     .FirstOrDefault()
                                 ?? oldSnapshot.ActiveChangeset;

        foreach (var toActivate in discoveredChangesets.OfType<IValidChangeset>().Where(c => c.ValidFrom > newActiveChangeset.ValidFrom))
            activationScheduler.ScheduleActivation(toActivate);

        return snapshotFactory.Recreate(oldSnapshot, newActiveChangeset, changesetsToAdd: discoveredChangesets.Except(newActiveChangeset));
    }

    private IChangeset Deserialize(ConfigurationResponse dto, VariationHierarchyResponse contextHierarchy)
    {
        try
        {
            return deserializer.Deserialize(dto, contextHierarchy, ConfigurationSource.Service);
        }
        catch (ChangesetDeserializationException ex)
        {
            return ex.FailedChangeset;
        }
    }
}
