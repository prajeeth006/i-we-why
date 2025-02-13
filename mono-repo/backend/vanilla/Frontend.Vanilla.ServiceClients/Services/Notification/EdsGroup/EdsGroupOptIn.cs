using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Notification.EdsGroup;

public sealed class EdsGroupOptIn(bool optinStatus)
{
    public bool OptinStatus { get; } = optinStatus;
}

internal sealed class EdsGroupOptInResponse : IPosApiResponse<EdsGroupOptIn>
{
    public bool OptinStatus { get; set; }
    public EdsGroupOptIn GetData() => new EdsGroupOptIn(OptinStatus);
}
