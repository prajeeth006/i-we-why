using Frontend.Vanilla.DomainSpecificLanguage.Providers;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;

namespace Frontend.Vanilla.Features.DslProviders;

internal sealed class PlayBreakDslProvider : IPlayBreakDslProvider
{
    public string BreakType()
        => throw new ClientSideOnlyException();

    public string EndDate()
        => throw new ClientSideOnlyException();

    public bool IsActive()
        => throw new ClientSideOnlyException();
}
