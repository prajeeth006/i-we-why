using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Dsl;

public abstract class DslPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected static DslMetadataResponse Metadata { get; private set; }
    protected IReadOnlyDictionary<string, ProviderMemberValue> ProvidersValues { get; private set; } = new Dictionary<string, ProviderMemberValue>();

    protected async Task LoadAsync()
    {
        // Static b/c doesn't change ever
        Metadata ??= await VanillaApi.GetAsync<DslMetadataResponse>(DiagnosticApiUrls.Dsl.Metadata);

        // Initially loaded on background
        if (ProvidersValues.Count > 0)
            await ReloadProvidersValues();
    }

    protected override Task OnInitializedAsync()
        => ReloadProvidersValues();

    protected async Task ReloadProvidersValues()
        => ProvidersValues = await VanillaApi.GetAsync<IReadOnlyDictionary<string, ProviderMemberValue>>(DiagnosticApiUrls.Dsl.ProvidersValues);
}
