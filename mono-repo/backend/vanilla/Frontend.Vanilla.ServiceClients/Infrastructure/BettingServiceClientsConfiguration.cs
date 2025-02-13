using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

internal interface IBettingServiceClientsConfiguration
{
    HttpUri Host { get; }
    string Version { get; }
}

internal sealed class BettingServiceClientsConfiguration : IBettingServiceClientsConfiguration
{
    internal const string FeatureName = "VanillaFramework.Services.ServiceClients.Betting";
    public HttpUri Host { get; set; }
    public string Version { get; set; }
}
