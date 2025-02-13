using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using System.Xml.Linq;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.Collections;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Core.System.Uris;
using Frontend.Vanilla.Core.Utils;
using JetBrains.Annotations;

namespace Frontend.Vanilla.Content.Templates.DataSources;

/// <summary>
/// Loads XML with content templates from Sitecore service.
/// </summary>
internal interface ISitecoreServiceTemplatesSource
{
    [NotNull, ItemNotNull]
    Task<IReadOnlyList<SitecoreTemplate>> GetTemplatesAsync(ExecutionMode mode, [NotNull] Action<string> trace, bool verbose);
}

internal sealed class SitecoreServiceTemplatesSource(IRestClient restClient, IContentConfiguration config, ISitecoreServiceTemplatesXmlParser xmlParser)
    : ISitecoreServiceTemplatesSource
{
    public async Task<IReadOnlyList<SitecoreTemplate>> GetTemplatesAsync(ExecutionMode mode, Action<string> trace, bool verbose)
    {
        Guard.NotNull(trace, nameof(trace));

        if (verbose) trace($"Paths from which to load templates: {config.TemplatePaths.Dump()}.");
        var templateUrls = config.TemplatePaths.ConvertAll(
            p => new UriBuilder(config.Host)
                .AppendPathSegment($"{config.Version}/template/.aspx")
                .AddQueryParameters(("xml", "1"), ("templates", p))
                .GetHttpUri());

        var xmls = await Task.WhenAll(templateUrls.ConvertAll(RequestTemplatesAsync));
        var finalXml = new XElement("templates", xmls.SelectMany(x => x.Elements("template")));
        if (verbose) trace("All template XMLs fetched successfully.");

        return xmlParser.Parse(finalXml, verbose ? trace : DisabledTrace);

        async Task<XElement> RequestTemplatesAsync(HttpUri url)
        {
            try
            {
                trace($"Loading templates from URL '{url}'.");
                var response = await restClient.ExecuteAsync(mode, new RestRequest(url));

                if (!response.StatusCode.IsSucccess())
                    throw new Exception($"Request for Sitecore templates returned unexpected {response} with body: {response.Content.DecodeToString()}");

                return XElement.Load(new MemoryStream(response.Content));
            }
            catch (Exception ex)
            {
                throw new Exception($"Failed loading Sitecore templates from URL '{url}'.", ex);
            }
        }
    }

    public static void DisabledTrace(string message) { }
}
