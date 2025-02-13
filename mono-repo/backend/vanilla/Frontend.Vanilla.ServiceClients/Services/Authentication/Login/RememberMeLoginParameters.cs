using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>
/// Parameters for automatic background login using corresponding token if user has checked remember-me during regular login.
/// </summary>
internal sealed class RememberMeLoginParameters : CommonLoginParameters
{
    /// <summary>Creates a new instance.</summary>
    public RememberMeLoginParameters(string rememberMeToken)
        => RememberMeToken = rememberMeToken;

    private string rememberMeToken;

    /// <summary>Gets or sets the token.</summary>
    public string RememberMeToken
    {
        get => rememberMeToken;
        set => rememberMeToken = Guard.NotWhiteSpace(value, nameof(value));
    }

    /// <summary>Gets or sets the token type e.g. "legacy". Null is default.</summary>
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public string TokenType { get; set; }
}
