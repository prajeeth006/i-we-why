using System.Collections.Generic;
using System.Net.Http;
using System.Threading.Tasks;
using Frontend.Vanilla.Diagnostics.App.Infrastructure;
using Frontend.Vanilla.Diagnostics.Contracts;
using Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.LogAndTracing;

public abstract class LogAndTracingPageComponent : ComponentBase
{
    [Inject]
    public IVanillaApiClient VanillaApi { get; set; }

    protected bool OnlyMyEntries { get; set; } = true;
    protected bool GroupByRequest { get; set; }

    protected string SelectedLogLevel { get; set; }
    protected HashSet<string> ExpandedRequests { get; set; } = new ();

    protected TracingStatusDto TracingStatus { get; private set; }
    protected IReadOnlyList<LogEntryDto> LogEntries { get; private set; }
    protected bool IsEntriesReloadInProgress { get; private set; }

    protected async Task LoadAsync()
    {
        var task = UpdateTracingStatusAsync();
        await ReloadLogEntriesAsync(OnlyMyEntries);
        await task; // Run in parallel
    }
    public static readonly IReadOnlyList<SelectItem> LogLevelsItems = new[]
    {
       new SelectItem(string.Empty, "Select log level"),
       new SelectItem(LogLevel.Verbose, "Verbose"),
       new SelectItem(LogLevel.Debug, "Debug"),
       new SelectItem(LogLevel.Information, "Information"),
       new SelectItem(LogLevel.Warning, "Warning"),
       new SelectItem(LogLevel.Error, "Error"),
       new SelectItem(LogLevel.Fatal, "Fatal"),
    };
    protected async Task ReloadLogEntriesAsync(bool onlyMyEntries)
    {
        IsEntriesReloadInProgress = true;
        OnlyMyEntries = onlyMyEntries;
        LogEntries = await VanillaApi.GetAsync<List<LogEntryDto>>(DiagnosticApiUrls.LogAndTracing.Log.GetUrl(OnlyMyEntries));
        IsEntriesReloadInProgress = false;
    }

    private async Task UpdateTracingStatusAsync()
        => TracingStatus = await VanillaApi.SendAsync<TracingStatusDto>(HttpMethod.Get, DiagnosticApiUrls.LogAndTracing.Tracing);

    protected async Task StartTracing()
    {
        IsEntriesReloadInProgress = true;
        await ModifyTracingAsync(HttpMethod.Post);

        GroupByRequest = true;
        await ReloadLogEntriesAsync(onlyMyEntries: true);
    }

    protected Task StopTracing()
        => ModifyTracingAsync(HttpMethod.Delete);

    protected Task ProlongTracing()
        => ModifyTracingAsync(HttpMethod.Post);

    private async Task ModifyTracingAsync(HttpMethod method)
    {
        await VanillaApi.SendAsync(method, DiagnosticApiUrls.LogAndTracing.Tracing);
        await UpdateTracingStatusAsync();
    }
}
