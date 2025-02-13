using System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.Extensions.Logging;

namespace Frontend.Vanilla.Features.Visitor;

/// <summary>
/// Handler for cookie which stores the user name of the last visitor.
/// </summary>
public interface ILastVisitorCookie
{
    /// <summary>Gets the value of the cookie.</summary>
    TrimmedRequiredString? GetValue();

    /// <summary>Sets the value of the cookie.</summary>
    void SetValue(TrimmedRequiredString value);
}

internal sealed class LastVisitorCookie(ICookieHandler cookieHandler, ILogger<LastVisitorCookie> log) : ILastVisitorCookie
{
    public const string Name = "lastVisitor";

    public TrimmedRequiredString? GetValue()
    {
        var rawValue = cookieHandler.GetValue(Name);

        if (rawValue == null)
            return null;

        var value = TrimmedRequiredString.TryCreate(rawValue.Trim());
        if (value?.Value.Length != rawValue.Length)
            log.LogWarning("Received " + Name + " cookie with {invalidValue}. Cleaned it to {value}. Most likely this has no user impact", rawValue, value?.Value);

        return value;
    }

    public void SetValue(TrimmedRequiredString value)
    {
        Guard.NotNull(value, nameof(value));

        var options = new CookieSetOptions { MaxAge = TimeSpan.FromDays(365 * 10) };
        cookieHandler.Set(Name, value, options);
    }
}
