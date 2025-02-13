using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Infrastructure.GenericServiceClients;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.ServiceClients.Services.Account.AssociatedAccounts;

public sealed class AssociatedAccount(
    string userName = null,
    string foreignUserId = null,
    short loginDomainId = 0,
    string loginDomainName = null,
    int sportsBookUserId = 0)
{
    public string UserName { get; } = userName;
    public string ForeignUserId { get; } = foreignUserId;
    public short LoginDomainId { get; } = loginDomainId;
    public string LoginDomainName { get; } = loginDomainName;
    public int SportsBookUserId { get; } = sportsBookUserId;
}

internal sealed class AssociatedAccountsResponse : IPosApiResponse<IReadOnlyList<AssociatedAccount>>
{
    public IReadOnlyList<AssociatedAccount> AssociatedAccount { get; set; }
    public IReadOnlyList<AssociatedAccount> GetData() => AssociatedAccount;
}
