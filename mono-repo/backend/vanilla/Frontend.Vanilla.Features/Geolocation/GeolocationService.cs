using System;
using System.Web;
using Frontend.Vanilla.Core.Json;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.WebAbstractions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Geolocation;

/// <summary>Provides current geolocation position.</summary>
public interface IGeolocationService
{
    /// <summary>Gets current position. Returns <see langword="null" /> if not available yet or it's disabled by user in browser or the feature is disabled.</summary>
    GeolocationPosition? CurrentPosition { get; }
}

internal sealed class GeolocationService(IHttpContextAccessor httpContextAccessor, ICookieHandler cookieHandler, ILogger<GeolocationService> log)
    : IGeolocationService
{
    public const string CookieName = "geolocation";

    public GeolocationPosition? CurrentPosition
    {
        get
        {
            var httpContext = httpContextAccessor.HttpContext;

            var wrapper = httpContext?.GetOrAddScopedValue("Van:Geolocation", _ => GetFreshPosition());

            return wrapper?.Value;
        }
    }

    private Wrapper<GeolocationPosition?> GetFreshPosition()
    {
        var rawValue = cookieHandler.GetValue(CookieName);

        try
        {
            return !rawValue.IsNullOrWhiteSpace()
                ? JsonConvert.DeserializeObject<GeolocationPosition>(HttpUtility.UrlDecode(rawValue), JsonSettings)
                : null;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Failed parsing Geolocation position from {cookie} with {value}", CookieName, rawValue);

            return (GeolocationPosition?)null;
        }
    }

    private static readonly JsonSerializerSettings JsonSettings = new () { Converters = { new TimestampJsonConverter() } };

    private sealed class TimestampJsonConverter : JsonConverter<DateTime>
    {
        public override DateTime ReadJson(JsonReader reader, Type objectType, DateTime existingValue, bool hasExistingValue, JsonSerializer serializer)
        {
            var unixTime = reader.GetRequiredValue<long>();

            return DateTimeOffset.FromUnixTimeMilliseconds(unixTime).UtcDateTime;
        }

        public override void WriteJson(JsonWriter writer, DateTime value, JsonSerializer serializer)
        {
            var unixTime = new DateTimeOffset(value).ToUnixTimeMilliseconds();
            writer.WriteValue(unixTime);
        }
    }
}
