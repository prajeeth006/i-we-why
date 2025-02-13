#nullable enable

using System.ComponentModel.DataAnnotations;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.HttpRequest;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.HttpTester;

public abstract class HttpTesterPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient? VanillaApi { get; set; }

    protected RestRequestViewModel Model { get; private set; } = new ();
    protected HttpTesterResult? Result { get; set; }

    protected async Task Test()
    {
        var url = DiagnosticApiUrls.HttpTester.GetUrl(Model.Url, Model.Headers);
        Result = await VanillaApi!.GetAsync<HttpTesterResult>(url);
    }

    public sealed class RestRequestViewModel
    {
        [Required]
        public string Url { get; set; } = "";

        public string? Headers { get; set; }
    }
}
