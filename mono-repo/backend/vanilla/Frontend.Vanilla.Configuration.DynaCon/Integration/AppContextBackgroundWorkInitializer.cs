using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;
using Frontend.Vanilla.Core.Time.Background;

namespace Frontend.Vanilla.Configuration.DynaCon.Integration;

/// <summary>
/// Passes current context items so that background operation is executed with same config b/c that may have been a reason to execute it.
/// </summary>
internal sealed class AppContextBackgroundWorkInitializer(ICurrentContextAccessor currentContextAccessor, ICurrentChangesetResolver currentChangesetResolver)
    : IBackgroundWorkInitializer
{
    public SetupBackgroundContextHandler CaptureParentContext()
    {
        // Ensure we have some config esp. label is already determined
        currentChangesetResolver.Resolve();

        var items = currentContextAccessor.Items.ToArray();

        return () => currentContextAccessor.Items.Add(itemsToAdd: items, KeyConflictResolution.Skip);
    }
}
