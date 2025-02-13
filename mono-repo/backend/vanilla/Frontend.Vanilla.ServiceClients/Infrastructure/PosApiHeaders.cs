namespace Frontend.Vanilla.ServiceClients.Infrastructure;

/// <summary>
/// Provides typed access to all headers related to service clients.
/// </summary>
internal static class PosApiHeaders
{
    public const string AccessId = "x-bwin-accessId";
    public const string UserToken = "x-bwin-user-token";
    public const string SessionToken = "x-bwin-session-token";
    public const string ClientIP = "x-bwin-client-ip";
    public const string ChannelId = "x-bwin-channel";
    public const string ProductId = "x-bwin-product";
    public const string BrandId = "x-bwin-brand";
    public const string LocationId = "x-bwin-locationId";
    public const string VanillaId = "x-vanilla-id";
}
