namespace Frontend.Host.Features.HttpForwarding;

internal interface IHttpForwardingConfiguration
{
    Dictionary<string, string> WhitelistedHosts { get; }
}

internal sealed class HttpForwardingConfiguration : IHttpForwardingConfiguration
{
    public const string FeatureName = "Host.Features.HttpForwarding";

    public Dictionary<string, string> WhitelistedHosts { get; } = new ();
}
