using System;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Shared;

public abstract class PageLayoutComponent : ComponentBase
{
    [Parameter]
    public string Title { get; set; }

    [Parameter]
    public EventCallback<PageLoadArgs> LoadChildContent { get; set; }

    [Parameter]
    public RenderFragment ChildContent { get; set; }

    [Parameter]
    public (string Href, string Text) SubtitleLink { get; set; }

    [Parameter]
    public bool ReloadDisabled { get; set; }

    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected static string ServerInfo { get; private set; }
    protected DateTime LoadTime { get; private set; }
    protected PageState State { get; private set; }
    protected Exception LoadError { get; private set; }

    protected override async Task OnInitializedAsync()
    {
        try
        {
            State = PageState.Loading;
            LoadTime = DateTime.UtcNow;

            var args = new PageLoadArgs();
            var task = LoadChildContent.InvokeAsync(args);
            ServerInfo ??= await VanillaApi.GetAsync<string>(DiagnosticApiUrls.ServerInfoUrl);

            await task; // Run in parallel
            State = !args.IsNotFound ? PageState.Loaded : PageState.NotFound;
        }
        catch (Exception ex)
        {
            LoadError = ex;
            State = PageState.Failed;
        }
    }

    public enum PageState
    {
#pragma warning disable SA1602 // Enumeration items should be documented
        Loading,
        Loaded,
        Failed,
        NotFound,
#pragma warning restore SA1602 // Enumeration items should be documented
    }
}

public sealed class PageLoadArgs
{
    public bool IsNotFound { get; set; }
}
