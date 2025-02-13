using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.Features.Login;

public sealed class LoginResponse
{
    public bool IsCompleted { get; set; }
    public string? RedirectUrl { get; set; }
    public UserInfo? User { get; set; }
    public IDictionary<string, string>? Claims { get; set; }
    public IReadOnlyDictionary<string, object>? PostLoginValues { get; set; }
    public string? Action { get; set; }
    public bool RememberMeEnabled { get; set; }
    public Balance? Balance { get; set; }
}

public sealed class UserInfo(bool isAuthenticated, string? loyaltyCategory)
{
    public bool IsAuthenticated { get; } = isAuthenticated;
    public string? LoyaltyCategory { get; } = loyaltyCategory;
}
