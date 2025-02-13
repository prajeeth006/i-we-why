using System;
using System.Linq;
using Frontend.Vanilla.Configuration.DynaCon.Container;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Configuration.DynaCon.Polling.Changes;

/// <summary>
/// Sets given changeset to be the active one.
/// </summary>
internal interface IActivateChangesetJob
{
    void Execute();
}

internal sealed class ActivateChangesetJob(
    IValidChangeset changeset,
    IConfigurationContainer container,
    IConfigurationSnapshotFactory snapshotFactory,
    ILogger<ActivateChangesetJob> log)
    : IActivateChangesetJob
{
    public void Execute()
    {
        try
        {
            container.SetSnapshot(oldSnapshot =>
            {
                if (oldSnapshot!.FutureChangesets.All(c => c.Id != changeset.Id))
                    throw new Exception("Changeset is no longer scheduled as the next one.");

                if (oldSnapshot.ActiveChangeset.Id == changeset.Id)
                    throw new Exception("Changeset is already activated.");

                if (oldSnapshot.ActiveChangeset.ValidFrom >= changeset.ValidFrom)
                    throw new Exception($"There is already newer changeset ({oldSnapshot.ActiveChangeset.Id}) activated.");

                return snapshotFactory.Recreate(oldSnapshot, activeChangeset: changeset);
            });
            log.LogInformation("Activated configuration changeset with {id}", changeset.Id);
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed activating configuration changeset with {id}", changeset.Id);
        }
    }
}
