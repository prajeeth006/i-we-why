#nullable enable

using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.Cache;
using Microsoft.AspNetCore.Components;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Diagnostics.App.Pages.Cache;

public abstract class CachePageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; } = default!;

    protected CachePageViewModel ViewModel { get; } = new ();
    protected JToken InfoModel { get; private set; } = "";
    protected CacheViewResult? Result { get; set; }

    protected async Task LoadAsync()
    {
        var info = await VanillaApi.GetAsync<CacheInfoResult>(DiagnosticApiUrls.Cache.Info.Url);
        InfoModel = JToken.FromObject(info);
    }

    protected async Task ViewAsync()
    {
        var url = DiagnosticApiUrls.Cache.View.GetUrl(ViewModel.Key);
        Result = await VanillaApi.GetAsync<CacheViewResult>(url);
    }

    public sealed class CachePageViewModel
    {
        [Required]
        [MinLength(3)]
        public string Key { get; set; } = "";
    }
}
