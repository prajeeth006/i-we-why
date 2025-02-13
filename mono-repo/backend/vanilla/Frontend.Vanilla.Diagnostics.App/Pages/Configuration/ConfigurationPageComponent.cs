using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Configuration;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Configuration;

public abstract class ConfigurationPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    public ConfigurationReportDto Model { get; private set; }
    public bool WarningsExpanded { get; set; }

    protected async Task LoadAsync()
        => Model = await VanillaApi.GetAsync<ConfigurationReportDto>(DiagnosticApiUrls.Configuration.Report);
}
