namespace Frontend.Host.Features.ClientApp;

internal sealed class ClientAppNoSuitableVersionException : Exception
{
    public ClientAppNoSuitableVersionException(string message)
        : base(message) { }
}
