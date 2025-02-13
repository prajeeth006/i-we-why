using System;
using Frontend.Vanilla.Core.Patterns;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.Utils;

namespace Frontend.Vanilla.Features.Cookies;

/// <summary>Specifies location where browser should store the cookie.</summary>
public class CookieLocationOptions : ToStringEquatable<CookieLocationOptions>
{
    private CookieDomain domain;

    /// <summary>Gets or sets a domain of a cookie. Default: Label.</summary>
    public CookieDomain Domain
    {
        get => domain;
        set => domain = Guard.DefinedEnum(value, nameof(value));
    }

    private string path = "/";

    /// <summary>Gets or sets a path of a cookie. Default: '/'.</summary>
    public string Path
    {
        get => path;
        set => path = Guard.Requires(value, p => p?.Length > 0 && p[0] == '/', nameof(path), "Cookie Path must start with a slash '/'.");
    }

    /// <summary>Gets or sets a special domain when CookieDomain is Special.</summary>
    public string? SpecialDomainValue { get; set; }

    /// <summary>Gets a string with all options.</summary>
    public override string ToString()
        => domain != CookieDomain.Special ? $"Domain={Domain}, Path={Path}" : $"Domain={Domain}, Path={Path}, SpecialDomainValue={SpecialDomainValue}";
}

/// <summary>Specifies all details of a cookie when setting it.</summary>
public sealed class CookieSetOptions : CookieLocationOptions
{
    /// <summary>Gets or sets an absolute expiration of a cookie. If no expiration is set then it's a session cookie.</summary>
    public UtcDateTime? Expires { get; set; }

    private TimeSpan? maxAge;

    /// <summary>Gets or sets a relative expiration of a cookie. It must be greater than zero. If no expiration is set then it's a session cookie.</summary>
    public TimeSpan? MaxAge
    {
        get => maxAge;
        set => maxAge = Guard.Requires(value,
            v => v == null || v > TimeSpan.Zero,
            nameof(value),
            "Cookie MaxAge must be greater than zero. To to delete a cookie, use corresponding method.");
    }

    /// <summary>Gets or sets a flag to forbid JavaScript from accessing a cookie.</summary>
    public bool HttpOnly { get; set; }

    private SameSiteFlag sameSite;

    /// <summary>Gets or sets a flag to indicate when a cookie should be sent with cross-origin requests. Default: None.</summary>
    public SameSiteFlag SameSite
    {
        get => sameSite;
        set => sameSite = Guard.DefinedEnum(value, nameof(value));
    }

    /// <summary>Gets a string with all options.</summary>
    public override string ToString()
        => $"{base.ToString()}, Expires={Expires}, MaxAge={MaxAge}, HttpOnly={HttpOnly}";
}

/// <summary>Indicates what domain should be used for a cookie. Other domains don't make sense because browser would discard such cookie as unrelated to current request URL.</summary>
public enum CookieDomain
{
    /// <summary>Umbrella domain of current label e.g. '.bwin.com'.</summary>
    Label = 0,

    /// <summary>Full domain of this app e.g. 'qa2.sports.bwin.com'.</summary>
    Full = 1,

    /// <summary> Special domain for extraordinary setups.</summary>
    Special = 2,
}

/// <summary>Used to set the SameSite field on response cookies to indicate if those cookie should be included by the client on future "same-site" or "cross-site" requests.</summary>
public enum SameSiteFlag
{
    /// <summary>No SameSite field will be set, the client should follow its default cookie policy.</summary>
    Unspecified = -1,

    /// <summary>Indicates the client should disable same-site restrictions.</summary>
    None = 0,

    /// <summary>Indicates the client should send the cookie with "same-site" requests, and with "cross-site" top-level navigations.</summary>
    Lax = 1,

    /// <summary>Indicates the client should only send the cookie with "same-site" requests.</summary>
    Strict = 2,
}
