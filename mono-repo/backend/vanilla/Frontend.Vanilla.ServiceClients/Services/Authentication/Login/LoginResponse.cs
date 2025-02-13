using System.Collections.Generic;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Services.Authentication.PendingActions;
using Frontend.Vanilla.ServiceClients.Services.Crm.LoyaltyProfiles;
using Frontend.Vanilla.ServiceClients.Services.Wallet.Balances;

#pragma warning disable 1591

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

public sealed class LoginResponse : ClaimsResponse
{
    public string SessionToken { get; set; }
    public string UserToken { get; set; }
    public string SsoToken { get; set; }
    public UtcDateTime LastLoginUtc { get; set; }
    public UtcDateTime LastLogoutUtc { get; set; }
    public BalancePosApiDto Balance { get; set; }
    public LoyaltyProfile LoyaltyStatus { get; set; }
    public Dictionary<string, string> PostLoginValues { get; set; }
    public PendingActionList PendingActions { get; set; }
    public List<string> WorkflowKeys { get; set; }
    public string SuperCookie { get; set; }
    public string RememberMeToken { get; set; }
}
