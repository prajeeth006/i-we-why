using System.Collections.Generic;
using Frontend.Vanilla.Diagnostics.Contracts.Dsl;
using Microsoft.AspNetCore.Components;
using Microsoft.JSInterop;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Dsl;

public abstract class DslProvidersShortcutsComponent : ComponentBase
{
    [Parameter]
    public IReadOnlyList<ProviderMetadata> ProvidersMetadata { get; set; }

    [Parameter]
    public EventCallback<string> OnScroll { get; set; }

    [Inject]
    public IJSRuntime JsRuntime { get; set; }
}
