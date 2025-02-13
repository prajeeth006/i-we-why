#nullable disable
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Features.Inbox;
using Frontend.Vanilla.Features.RtmsLayer;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace Frontend.Vanilla.Features.Games;

/// <summary>
/// Provides games metadata information by fetching them from casino endpoint. TODO: get rid of this.
/// </summary>
public interface IGamesMetadataService
{
    /// <summary>
    /// Provides games metadata information by fetching them from casino endpoint. TODO: get rid of this.
    /// </summary>
    IEnumerable<MobileGameInfo> GetCasinoGames(IEnumerable<string> ids, IHeaderDictionary currentHttpRequestHeaders);
}

internal sealed class GamesMetadataService(
    IContentService contentService,
    IRestClient requestFactory,
    IGameMetadataConfiguration gameMetadataConfiguration,
    ILogger<GamesMetadataService> log)
    : IGamesMetadataService
{
    public IEnumerable<MobileGameInfo> GetCasinoGames(IEnumerable<string> ids, IHeaderDictionary currentHttpRequestHeaders)
    {
        try
        {
            var result = new List<MobileGameInfo>();
            var casinoHomeLink = contentService.Get<ILinkTemplate>("App-v1.0/Links/HomeCasino")?.Url;

            if (ids.Any())
            {
                // build up casino route and get games metadata and pick uri scheme from config as  calls from casino needs to be local and requested as http
                var casinoUrl = casinoHomeLink?.OriginalString.Replace(casinoHomeLink.Scheme, gameMetadataConfiguration.CasinoUriScheme);
                var url = $"{casinoUrl}{gameMetadataConfiguration.MobileCasinoGameDataEndpoint}";
                ids.Each(id => { url += $"&n={id}"; });
                var restRequest = new RestRequest(new HttpUri(url));

                foreach (var header in currentHttpRequestHeaders)
                    if (header.Key.Equals("Cookie") || header.Key.Equals("User-Agent"))
                        restRequest.Headers.Add(header);

                var restResponse = requestFactory.Execute(restRequest);
                result =
                    JsonConvert.DeserializeObject<List<MobileGameInfo>>(
                        Encoding.UTF8.GetString(restResponse.Content, 0, restResponse.Content.Length));

                // add launch url
                result.ForEach(g =>
                {
                    var casinoGameLaunchUrl = gameMetadataConfiguration.CasinoGameLaunchUrl.Replace("gameId", g.GameId);
                    g.LaunchUrl = casinoHomeLink?.OriginalString + casinoGameLaunchUrl;
                });
            }

            return result;
        }
        catch (Exception ex)
        {
            log.LogError(ex, "Unable to get mobile games metadata from casino");

            return Array.Empty<MobileGameInfo>();
        }
    }
}
