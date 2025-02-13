#nullable disable
using System;
using System.Collections.Generic;
using Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

#pragma warning disable CS1591 // Just dummy data -> no docs needed
namespace Frontend.Vanilla.Features.Login;

public sealed class MobileLoginParameters
{
    public string Username { get; set; }
    public string Email { get; set; }
    public string Password { get; set; }
    public string SsoToken { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string ProductId { get; set; }
    public string BrandId { get; set; }
    public DeviceFingerprint Fingerprint { get; set; }
    public string LoginType { get; set; }
    public bool RememberMe { get; set; }
    public string Pid { get; set; }
    public string AuthorizationCode { get; set; }
    public string HandShakeSessionKey { get; set; }

    public string OAuthProvider { get; set; }
    public string OAuthUserId { get; set; }
    public string RememberMeToken { get; set; }
    public bool NewReq { get; set; }
    public bool NewUser { get; set; }
    public string TerminalId { get; set; }
    public string ShopId { get; set; }
    public string VanillaIdToken { get; set; }
    public IDictionary<string, string> RequestData { get; set; }
}
