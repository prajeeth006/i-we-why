using System;
using System.Collections.Generic;
using System.Globalization;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Primitives;

namespace Frontend.Vanilla.Features.Visitor;

/// <summary>
/// Handles loading and saving of <see cref="VisitorSettings" /> to/from corresponding cookie.
/// </summary>
internal interface IVisitorSettingsManager
{
    /// <summary>Gets settings as received in this request.</summary>
    VisitorSettings Received { get; }

    /// <summary>Gets or sets current settings with all changes during this request.</summary>
    VisitorSettings Current { get; set; }
}

internal sealed class VisitorSettingsManager(ICookieHandler cookieHandler, IHttpContextAccessor httpContextAccessor) : IVisitorSettingsManager
{
    public const string CookieName = "usersettings";
    public const string ReceivedKey = "Van:VisitorSettings:Received";
    public const string CurrentKey = "Van:VisitorSettings:Current";

    private static class CookieKeys
    {
        public const string Culture = "cid";
        public const string VisitCount = "vc";
        public const string SessionStartTime = "sst";
        public const string PreviousSessionStartTime = "psst";
    }

    public VisitorSettings Received
        => GetReceived(httpContextAccessor.GetRequiredHttpContext());

    public VisitorSettings GetReceived(HttpContext httpContext)
        => httpContext.GetOrAddScopedValue(ReceivedKey, _ => DeserializeFromCookie());

    public VisitorSettings Current
    {
        get
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();

            return httpContext.GetOrAddScopedValue(CurrentKey, _ => GetReceived(httpContext));
        }
        set
        {
            var httpContext = httpContextAccessor.GetRequiredHttpContext();
            httpContext.RequestServices.GetRequiredService<IRequestScopedValuesProvider>().Items[CurrentKey] = new Lazy<object?>(value);
            SerializeToCookie(value);
        }
    }

    private VisitorSettings DeserializeFromCookie()
    {
        var cookieValue = cookieHandler.GetValue(CookieName);

        if (cookieValue.IsNullOrWhiteSpace())
            return new VisitorSettings();

        var values = QueryUtil.Parse(cookieValue);

        return new VisitorSettings(
            cultureName: GetString(CookieKeys.Culture),
            visitCount: GetInt32(CookieKeys.VisitCount),
            sessionStartTime: GetDateTime(CookieKeys.SessionStartTime),
            previousSessionStartTime: GetDateTime(CookieKeys.PreviousSessionStartTime));

        TrimmedRequiredString? GetString(string key)
            => TrimmedRequiredString.TryCreate(values.GetValue(key).ToString().Trim());

        int GetInt32(string key)
            => int.TryParse(values.GetValue(key), NumberStyles.Integer, CultureInfo.InvariantCulture, out var x) ? x : default;

        UtcDateTime GetDateTime(string key)
            => UtcDateTime.TryParse(values.GetValue(key)) ?? default;
    }

    private void SerializeToCookie(VisitorSettings settings)
    {
        var values = new Dictionary<string, StringValues>
        {
            { CookieKeys.Culture, settings.CultureName },
            { CookieKeys.VisitCount, settings.VisitCount.ToInvariantString() },
            { CookieKeys.SessionStartTime, settings.SessionStartTime.ToString() },
            { CookieKeys.PreviousSessionStartTime, settings.PreviousSessionStartTime.ToString() },
        };
        var cookieValue = QueryUtil.Build(values, escape: false);
        cookieHandler.Set(CookieName, cookieValue, new CookieSetOptions { HttpOnly = true, MaxAge = TimeSpan.FromDays(10 * 365) });
    }
}
