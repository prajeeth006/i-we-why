using System;
using System.Collections.Generic;
using System.Linq;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.Features.Cookies;

namespace Frontend.Vanilla.Features.ContentMessages;

/// <summary>
/// Handles working with cookies that store information about closed content messages.
/// </summary>
internal interface IClosedContentMessagesCookie
{
    IEnumerable<ClosedMessageInfo> GetValues(TrimmedRequiredString cookieKey);
    void SetValues(TrimmedRequiredString cookieKey, IEnumerable<ClosedMessageInfo> values);
    void RemoveValuesOnLogin();
}

internal sealed class ClosedContentMessagesCookie(ICookieHandler cookieHandler) : IClosedContentMessagesCookie
{
    public static class CookieNames
    {
        public const string Persistent = "clsd-p";
        public const string Session = "clsd-s";
        public const string Login = "clsd-l";
    }

    private const string Separator = "|";

    public IEnumerable<ClosedMessageInfo> GetValues(TrimmedRequiredString cookieKey)
    {
        Guard.NotNull(cookieKey, nameof(cookieKey));

        return GetValues(CookieNames.Persistent, showOnNextSession: false, showOnNextLogin: false)
            .Concat(GetValues(CookieNames.Session, showOnNextSession: true, showOnNextLogin: false))
            .Concat(GetValues(CookieNames.Login, showOnNextSession: false, showOnNextLogin: true));

        IEnumerable<ClosedMessageInfo> GetValues(string cookieName, bool showOnNextSession, bool showOnNextLogin)
        {
            var rawValue = cookieHandler.GetValue(cookieName) ?? string.Empty;
            var values = QueryUtil.Parse(rawValue);

            return values.GetValue(cookieKey).ToString()
                .Split(new[] { Separator }, StringSplitOptions.RemoveEmptyEntries)
                .Where(v => !string.IsNullOrWhiteSpace(v))
                .Select(v => new ClosedMessageInfo(v, showOnNextSession, showOnNextLogin));
        }
    }

    public void SetValues(TrimmedRequiredString cookieKey, IEnumerable<ClosedMessageInfo> values)
    {
        Guard.NotNull(cookieKey, nameof(cookieKey));
        values = Guard.NotNullItems(values?.Distinct().ToList(), nameof(values));

        SetValues(CookieNames.Persistent, showOnNextSession: false, showOnNextLogin: false);
        SetValues(CookieNames.Session, showOnNextSession: true, showOnNextLogin: false);
        SetValues(CookieNames.Login, showOnNextSession: false, showOnNextLogin: true);

        void SetValues(string cookieName, bool showOnNextSession, bool showOnNextLogin)
        {
            var originalRawValue = cookieHandler.GetValue(cookieName);
            var currentValues = QueryUtil.Parse(originalRawValue);

            var keyedValue = values
                .Where(v => v.ShowOnNextSession == showOnNextSession && v.ShowOnNextLogin == showOnNextLogin)
                .Select(v => v.Name.Value)
                .OrderBy(v => v)
                .Join(Separator);

            currentValues.Remove(cookieKey);
            if (!string.IsNullOrWhiteSpace(keyedValue))
                currentValues.Append(cookieKey, keyedValue);

            var currentValue = QueryUtil.Build(currentValues) ?? string.Empty;

            if (string.Equals(originalRawValue ?? string.Empty, currentValue, StringComparison.OrdinalIgnoreCase))
                return; // Don't write cookie if not changed

            if (string.IsNullOrWhiteSpace(currentValue))
            {
                cookieHandler.Delete(cookieName);
            }
            else
            {
                cookieHandler.Set(
                    cookieName,
                    currentValue.Replace("%7C", "|"), // hack replace (encoded |)  with | to maintain compatibility - check with peter
                    showOnNextSession ? null : new CookieSetOptions { MaxAge = TimeSpan.FromDays(365) });
            }
        }
    }

    public void RemoveValuesOnLogin()
    {
        cookieHandler.Delete(CookieNames.Login);
    }
}
