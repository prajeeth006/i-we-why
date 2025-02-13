using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;
using Frontend.Vanilla.ServiceClients.Services.Offers;

namespace Frontend.Vanilla.ServiceClients.Services.Crm.UserScrub;

internal sealed class UserScrub(bool playerScrubbed, IReadOnlyList<string> productList) : IPosApiResponse<UserScrub>
{
    public bool PlayerScrubbed { get; } = playerScrubbed;
    public IReadOnlyList<string> ProductList { get; } = productList;

    public UserScrub GetData() => this;
}

internal sealed class UserScrubRequest(string component, string useCase, IReadOnlyList<PosApiKeyValuePair> additionalParameters)
{
    public string Component { get; } = component;
    public string UseCase { get; } = useCase;
    public IReadOnlyList<PosApiKeyValuePair> AdditionalParameters { get; } = additionalParameters;
}
