using Frontend.Vanilla.Core.System.Uris;

namespace Frontend.Vanilla.ServiceClients.Infrastructure;

internal interface IExtendedServiceClientsConfiguration
{
    HttpUri Host { get; }
    string Version { get; }
}

internal sealed class ExtendedServiceClientsConfiguration : IExtendedServiceClientsConfiguration
{
    internal const string FeatureName = "VanillaFramework.Services.ServiceClients.Extended";
    public HttpUri Host { get; set; }
    public string Version { get; set; }
}
