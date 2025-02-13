using Frontend.Vanilla.Diagnostics.Contracts.LogAndTracing;
using Microsoft.AspNetCore.Components;

namespace Frontend.Vanilla.Diagnostics.App.Pages.LogAndTracing;

public abstract class LogEntryDetailComponent : ComponentBase
{
    [Parameter]
    public LogEntryDto Entry { get; set; }

    protected bool IsExpanded { get; set; }

    protected string LevelCssClass
        => Entry.Level switch
        {
            LogLevel.Fatal => "badge-danger",
            LogLevel.Error => "badge-danger",
            LogLevel.Warning => "badge-warning",
            LogLevel.Information => "badge-primary",
            _ => "badge-secondary",
        };
}
