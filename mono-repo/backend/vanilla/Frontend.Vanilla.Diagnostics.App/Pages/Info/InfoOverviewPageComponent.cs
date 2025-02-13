using System.Collections.Generic;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Info;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Info;

public abstract class InfoOverviewPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    public static IReadOnlyList<InfoPageMetadataDto> Model { get; private set; }

    protected async Task LoadAsync()
        => Model ??= await VanillaApi.GetAsync<IReadOnlyList<InfoPageMetadataDto>>(DiagnosticApiUrls.InfoPages.Overview);
}
