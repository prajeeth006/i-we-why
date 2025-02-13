using System;
using System.Threading;

namespace Frontend.Vanilla.Configuration.DynaCon.Container;

/// <summary>
/// Stores configuration snapshot and handles it in thread-safe manner.
/// </summary>
internal interface IConfigurationContainer
{
    /// <summary>
    /// This is a method instead of property to emphasise that snapshot can be changed by other threads in the meantime.
    /// </summary>
    IConfigurationSnapshot GetSnapshot();

    /// <summary>
    /// Sets a new snapshot based on the current one in thread-safe manner.
    /// </summary>
    void SetSnapshot(SetSnapshotDelegate func);
}

internal delegate IConfigurationSnapshot SetSnapshotDelegate(IConfigurationSnapshot? oldSnapshot);

internal sealed class ConfigurationContainer : IConfigurationContainer
{
    public Lock Lock { get; } = new ();

    private volatile IConfigurationSnapshot? snapshot; // Volatile for thread-safe reading

    public IConfigurationSnapshot GetSnapshot()
        => snapshot ?? throw new InvalidOperationException("Configuration snapshot hasn't been initialized yet.");

    public void SetSnapshot(SetSnapshotDelegate func)
    {
        lock (Lock) // Lock around func for thread safe modification
        {
            var ss = func(snapshot);
            snapshot = ss ?? throw new InvalidOperationException("Configuration snapshot can't be set to null.");
        }
    }
}
