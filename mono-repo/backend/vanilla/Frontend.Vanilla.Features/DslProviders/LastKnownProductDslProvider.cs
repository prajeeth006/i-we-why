using System;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Utils;
using Frontend.Vanilla.DomainSpecificLanguage.Providers.Contracts;
using Frontend.Vanilla.Features.Cookies;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.DslProviders;

/// <summary>
/// Implementation of <see cref="ILastKnownProductDslProvider" />.
/// </summary>
internal sealed class LastKnownProductDslProvider(ICookieHandler cookieHandler, Func<IContentService> contentService, ILogger<LastKnownProductDslProvider> log)
    : ILastKnownProductDslProvider
{
    public const string LastKnownProductCookieName = "lastKnownProduct";
    public const string ProductUnknown = "unknown";
    private readonly ICookieHandler cookieHandler = Guard.NotNull(cookieHandler, nameof(cookieHandler));

    public string Name => GetValue().Name;
    public string Previous => GetValue().Previous ?? ProductUnknown;
    public string PlatformProductId => GetValue().PlatformProductId ?? string.Empty;
    public string Url => GetValue().Url ?? string.Empty;

    private LastKnownProduct GetValue()
    {
        var lastKnownProductString = cookieHandler.GetValue(LastKnownProductCookieName);

        if (string.IsNullOrEmpty(lastKnownProductString))
        {
            return GetDefaultValue();
        }

        try
        {
            var lastKnownProduct = JsonConvert.DeserializeObject<LastKnownProduct>(lastKnownProductString);

            if (lastKnownProduct != null)
            {
                return lastKnownProduct;
            }

            log.LogError("Failed to deserialize last known product using {value}", lastKnownProductString);

            return GetDefaultValue();
        }
        catch (Exception ex)
        {
            log.LogWarning(ex, "Failed deserializing last known product to object from string {value}", lastKnownProductString);

            return GetDefaultValue();
        }
    }

    private LastKnownProduct GetDefaultValue()
    {
        var homePageUrl = contentService().GetRequired<ILinkTemplate>("MobileLogin-v1.0/Links/BackToProduct", new ContentLoadOptions { RequireTranslation = true }).Url
            ?.AbsoluteUri;

        return new LastKnownProduct(ProductUnknown, string.Empty, ProductUnknown, homePageUrl);
    }
}

internal sealed class LastKnownProduct(string name, string? platformProductId, string? previous, string? url)
{
    public string Name { get; } = name;

    /// <summary>
    /// Remove nullable when everyone is on van11.
    /// </summary>
    public string? PlatformProductId { get; } = platformProductId;

    /// <summary>
    /// Remove nullable when everyone is on van11.
    /// </summary>
    public string? Previous { get; } = previous;

    public string? Url { get; } = url;
}
