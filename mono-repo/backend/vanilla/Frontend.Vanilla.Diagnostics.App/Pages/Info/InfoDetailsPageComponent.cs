using System.Net;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.App.Shared;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Info;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Info;

public abstract class InfoDetailsPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    [Inject]
    public NavigationManager Navigation { get; set; }

    [Parameter]
    public string UrlPath { get; set; }

    public InfoPageDetailsDto Model { get; private set; }

    protected async Task LoadAsync(PageLoadArgs args)
    {
        try
        {
            var url = DiagnosticApiUrls.InfoPages.Details.GetUrl(UrlPath);
            Model = await VanillaApi.GetAsync<InfoPageDetailsDto>(url);
        }
        catch (ApiException ex) when (ex.StatusCode == HttpStatusCode.NotFound)
        {
            args.IsNotFound = true;
        }
    }
}
