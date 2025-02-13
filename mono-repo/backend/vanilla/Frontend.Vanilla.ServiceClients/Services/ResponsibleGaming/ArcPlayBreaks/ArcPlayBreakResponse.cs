using System;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.ResponsibleGaming.ArcPlayBreaks;

public sealed class ArcPlayBreakResponse : IPosApiResponse<ArcPlayBreakResponse>
{
    public bool PlayBreak { get; set; }
    public string PlayBreakType { get; set; }
    public DateTime? PlayBreakEndTime { get; set; }
    public bool GracePeriod { get; set; }
    public DateTime? GracePeriodEndTime { get; set; }
    public bool PlayBreakOpted { get; set; }
    public ArcPlayBreakResponse GetData() => this;
}
