#nullable enable

using System;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Specifies parameters for the login by username and password. Password can be empty when login type is USERNAME_SUBMIT.
/// </summary>
internal sealed class LoginParameters : CommonLoginParameters
{
    /// <summary>Creates a new instance.</summary>
    public LoginParameters(string username, string? password)
    {
        Username = username;
        Password = password;
    }

    /// <summary>Gets or sets the user name.</summary>
    public string Username { get; set; }

    /// <summary>Gets or sets the user name.</summary>
    public string? Password { get; set; }

    /// <summary>Gets or sets user's date of birth.</summary>
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public DateTime? DateOfBirth { get; set; }

    /// <summary>Gets or sets handshake session key for login with previous 3rd party handshake.</summary>
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public string? HandshakeSessionKey { get; set; }

    /// <summary>Gets or sets flag indicating type of username and password e.g. 'online' username with password or 'connect card' with pin code.</summary>
    public string? LoginType { get; set; }

    /// <summary>Indicates if remember-me token should be issued if the feature is enabled.</summary>
    public bool RememberMe { get; set; }

    public string? TerminalId { get; set; }

    public string? ShopId { get; set; }
}
