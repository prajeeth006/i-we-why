using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.InvitationUrl;

internal sealed class InvitationUrl(string url = default) : IPosApiResponse<InvitationUrl>
{
    public string Url { get; } = url;

    public InvitationUrl GetData() => this;
}
