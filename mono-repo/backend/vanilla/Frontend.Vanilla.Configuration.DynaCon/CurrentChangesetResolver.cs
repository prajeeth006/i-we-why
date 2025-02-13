using Frontend.Vanilla.Configuration.DynaCon.Container;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Ioc;

namespace Frontend.Vanilla.Configuration.DynaCon;

/// <summary>Resolves changeset for current context.</summary>
internal interface ICurrentChangesetResolver
{
    IValidChangeset Resolve();
}

/// <summary>Primary implementation specific for a tenant.</summary>
internal sealed class CurrentChangesetResolver(IConfigurationContainer configContainer) : ICurrentChangesetResolver
{
    public IValidChangeset Resolve()
    {
        var snapshot = configContainer.GetSnapshot();

        return snapshot.OverriddenChangeset ?? snapshot.ActiveChangeset;
    }
}

/// <summary>Caches current changeset for current context including multitenancy.</summary>
internal sealed class CachedChangesetResolver(ICurrentChangesetResolver inner, ICurrentContextAccessor currentContextAccessor) : ICurrentChangesetResolver
{
    public static readonly object ItemsKey = "Van:Config:Changeset";

    public IValidChangeset Resolve()
        // Once associated with the context then it can't change to keep the execution consistent!
        => currentContextAccessor.Items.GetOrAddFromFactory(ItemsKey, _ => inner.Resolve());
}
