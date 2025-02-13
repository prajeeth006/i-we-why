using Frontend.Vanilla.Configuration.DynaCon.Container;

namespace Frontend.Vanilla.Configuration.DynaCon.FileFallback;

/// <summary>
/// Decorates <see cref="IConfigurationContainer" />. Backs up recently activated configuration to the fallback file.
/// </summary>
internal sealed class BackupToFallbackFileDecorator(IConfigurationContainer inner, IFallbackFile<IValidChangeset> fallbackFile) : IConfigurationContainer
{
    public IConfigurationSnapshot GetSnapshot()
        => inner.GetSnapshot();

    public void SetSnapshot(SetSnapshotDelegate func)
    {
        if (fallbackFile.Handler == null)
        {
            inner.SetSnapshot(func);

            return;
        }

        inner.SetSnapshot(oldSnapshot =>
        {
            var newSnapshot = func(oldSnapshot);
            var activatingNewChangesetFromService = newSnapshot.ActiveChangeset.Source == ConfigurationSource.Service
                                                    && newSnapshot.ActiveChangeset.Id != oldSnapshot?.ActiveChangeset.Id;

            if (activatingNewChangesetFromService)
                fallbackFile.Handler.Write(newSnapshot.ActiveChangeset);

            return newSnapshot;
        });
    }
}
