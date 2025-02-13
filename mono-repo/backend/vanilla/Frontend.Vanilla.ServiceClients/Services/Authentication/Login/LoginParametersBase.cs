#nullable enable

using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.Utils;
using Newtonsoft.Json;

namespace Frontend.Vanilla.ServiceClients.Services.Authentication.Login;

/// <summary>Common properties used for all ways of login.</summary>
internal abstract class LoginParametersBase
{
    /// <summary>Gets the current language used during the login.</summary>
    public CultureInfo Language => CultureInfo.CurrentCulture;

    /// <summary>Gets or sets UCID.</summary>
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public string? Ucid { get; set; }
}

/// <summary>Common properties for most of the ways of login.</summary>
internal abstract class CommonLoginParameters : LoginParametersBase
{
    /// <summary>Gets or sets the channel ID.</summary>
    [JsonIgnore] // Passed via header
    public string? ChannelId { get; set; }

    /// <summary>Gets or sets the product ID.</summary>
    [JsonIgnore] // Passed via header
    public string? ProductId { get; set; }

    /// <summary>Gets or sets the brand ID.</summary>
    [JsonIgnore] // Passed via header
    public string? BrandId { get; set; }

    /// <summary>Gets or sets the device ID.</summary>
    public string? DeviceId { get; set; }

    public string? VanillaIdToken { get; set; }

    /// <summary>Gets or sets device fingerprint for two-factor authentication.</summary>
    [JsonProperty(DefaultValueHandling = DefaultValueHandling.Ignore)]
    public DeviceFingerprint? Fingerprint { get; set; }

    public IDictionary<string, string?> RequestData { get; } = new Dictionary<string, string?>();
    public bool ShouldSerializeRequestData() => RequestData.Count > 0;
}

/// <summary>Optional username and password properties for login.</summary>
internal abstract class OptionalUsernameLoginParameters : CommonLoginParameters
{
    /// <summary>Gets or sets the user name.</summary>
    public string? Username { get; set; }

    /// <summary>Gets or sets user password.</summary>
    public string? Password { get; set; }
}

/// <summary>Device fingerprint for two-factor authentication.</summary>
public sealed class DeviceFingerprint
{
    /// <summary>Gets or sets super cookie.</summary>
    public string? SuperCookie { get; set; }

    private IDictionary<string, string?> deviceDetails = new Dictionary<string, string?>();

    /// <summary>Gets or sets device details.</summary>
    public IDictionary<string, string?> DeviceDetails
    {
        get => deviceDetails;
        set => deviceDetails = Guard.NotNull(value, nameof(value));
    }
}
