#nullable disable
using System;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Core.Caching;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.WebIntegration.Content;

/// <summary>
/// Implementation of <see cref="IEditorOverridesResolver" /> for web applications.
/// </summary>
internal sealed class WebEditorOverridesResolver(IHttpContextAccessor httpContextAccessor, IInternalRequestEvaluator requestEvaluator, ICookieHandler cookieHandler)
    : IEditorOverridesResolver
{
    private static readonly EditorOverrides PublicInternetOverrides = new EditorOverrides();
    public const string CookieName = "SitecoreEditor";

    public EditorOverrides Resolve()
    {
        var httpContext = httpContextAccessor.HttpContext;

        return httpContext != null
            ? httpContext.GetOrAddScopedValue("Van:Content:EditorOverrides", _ => ResolveFresh(httpContext))
            : PublicInternetOverrides; // Null HttpContext in background operation
    }

    private EditorOverrides ResolveFresh(HttpContext httpContext)
    {
        if (!requestEvaluator.IsInternal())
            return PublicInternetOverrides; // Quick win for regular users

        try
        {
            var settings = PublicInternetOverrides;
            var cookieValue = cookieHandler.GetValue(CookieName);
            var query = ParseSettingsFromQuery(httpContext);

            if (cookieValue != null)
                settings = JsonConvert.DeserializeObject<EditorOverrides>(cookieValue);

            if (query.Equals((null, null, null)))
                return settings;

            // Query params take precedence + write to cookie to be used during the whole session
            settings = new EditorOverrides(
                query.NoCache ?? settings.NoCache,
                query.UsePreview ?? settings.UsePreview,
                query.PreviewDate != null ? query.PreviewDate.Item1 : settings.PreviewDate);

            cookieValue = JsonConvert.SerializeObject(settings);
            cookieHandler.Set(CookieName, cookieValue, new CookieSetOptions()
            {
                HttpOnly = true,
            });

            return settings;
        }
        catch (Exception ex)
        {
            throw new Exception("Failed creating content editor settings.", ex);
        }
    }

    private static (bool? NoCache, bool? UsePreview, Tuple<UtcDateTime?> PreviewDate) ParseSettingsFromQuery(HttpContext httpContext)
    {
        var noCache = ParseQueryParam<bool?>(httpContext, "_NoCache", str =>
        {
            switch (str.ToLowerInvariant())
            {
                case "true":
                case "1":
                    return true;
                case "false":
                case "0":
                    return false;
                default:
                    return null;
            }
        });
        var usePreview = ParseQueryParam<bool?>(httpContext, "_Mode", str =>
        {
            switch (str.ToLowerInvariant())
            {
                case "preview":
                    return true;
                case "normal":
                case "default":
                    return false;
                default:
                    return null;
            }
        });
        var previewDate = ParseQueryParam(httpContext, "_PreviewDate", str =>
        {
            if (str.Equals("null", StringComparison.OrdinalIgnoreCase))
                return new Tuple<UtcDateTime?>(null);

            var date = DateTime.Parse(str).ToUniversalTime();

            return new Tuple<UtcDateTime?>(new UtcDateTime(date));
        });

        return (noCache, usePreview, previewDate);
    }

    private static T ParseQueryParam<T>(HttpContext httpContext, string name, Func<string, T> parseFunc)
    {
        var value = httpContext.Request.Query[name];

        if (value.IsNullOrEmpty())
            return default;

        try
        {
            return parseFunc(value);
        }
        catch (Exception ex)
        {
            throw new Exception($"Query string parameter '{name}' has invalid value '{value}'.", ex);
        }
    }
}
