#nullable enable

using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Common.ClientInfo;
#pragma warning disable CS1591
public sealed class ClientInformation(string? brandId = null, string? channelId = null, string? frontendId = null, string? productId = null)
    : IPosApiResponse<ClientInformation>
{
    public string? BrandId { get; } = brandId;
    public string? ChannelId { get; } = channelId;
    public string? FrontendId { get; } = frontendId;
    public string? ProductId { get; } = productId;

    ClientInformation IPosApiResponse<ClientInformation>.GetData() => this;
}
