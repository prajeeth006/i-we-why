using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

namespace Frontend.Vanilla.ServiceClients.Services.Account.ConnectedAccounts;

internal sealed class ConnectedAccount(string key, string value)
{
    public string Key { get; } = key;
    public string Value { get; } = value;

    public bool HasAccount => Value == "true";
}

internal sealed class ConnectedAccountsResponse : IPosApiResponse<IReadOnlyList<ConnectedAccount>>
{
    public IReadOnlyList<ConnectedAccount> UnregisteredBrands { get; set; }
    public IReadOnlyList<ConnectedAccount> GetData() => UnregisteredBrands;
}
