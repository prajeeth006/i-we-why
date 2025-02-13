using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Health;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.HealthReport;

public abstract class HealthReportPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected HealthReportResult Result { get; set; }

    protected async Task LoadAsync()
    {
        Result = await VanillaApi.GetAsync<HealthReportResult>(DiagnosticApiUrls.Health.UrlTemplate);
    }
}
