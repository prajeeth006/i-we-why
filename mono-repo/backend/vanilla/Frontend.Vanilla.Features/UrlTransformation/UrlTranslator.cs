using Frontend.Vanilla.Core.System.Text;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class UrlTranslator(
        IUrlTransformationLocalizationProvider localizationProvider,
        IUrlTransformationConfiguration urlsConfiguration,
        IUrlTransformer transformer,
        IStaticUrlTransformer staticTransformer,
        ILogger<UrlTranslator> logger)
        : IUrlTranslator
    {
        public string Translate(string url, string urlSource, CancellationToken cancellationToken) => Translate(
            url,
            urlSource,
            localizationProvider.DefaultLocale,
            localizationProvider.CurrentLocale,
            cancellationToken);

        public string Translate(string url, string urlSource, string sourceLanguage, string targetLanguage, CancellationToken cancellationToken)
        {
            // TODO add config to skip if not Sports (header product) and running on sf.
            if (string.IsNullOrWhiteSpace(url))
            {
                return url;
            }

            try
            {
                // old to new url mapping
                var (transformed, query) = transformer.Transform(url).SplitPath();

                if (urlsConfiguration.UrlMalformedWarning && string.Compare(transformed, url, true) != 0)
                {
                    var parsed = urlSource.Split(';').Where(x => !string.IsNullOrWhiteSpace(x));

                    var props = new Dictionary<string, string?>
                    {
                        { "requestedUrl", url },
                        { "transformedUrl", transformed },
                        { "requestorName", parsed.FirstOrDefault() },
                    };

                    foreach (var data in parsed.Skip(1).Select(x => x.Split(new[] { '=' }, 2)))
                    {
                        props.Add($"requestor{data[0]}", data.Skip(1).FirstOrDefault() ?? string.Empty);
                    }

                    using (logger.BeginScope(props))
                    {
                        logger.LogWarning(
                            $"UrlTranslator: Malformed url, possible replacement for source{Environment.NewLine}" +
                            $"SourceUrl={url}{Environment.NewLine}" +
                            $"TransformedUrl={transformed}{query}{Environment.NewLine}{Environment.NewLine}" +
                            $"ExtraData{Environment.NewLine}{urlSource}");
                    }
                }

                transformed = staticTransformer.Transform(transformed, sourceLanguage, targetLanguage);

                return transformed + query;
            }
            catch (Exception ex)
            {
                logger.LogError(ex, "Failed to translate url: {@urlToTranslate}", url);
            }

            return url;
        }
    }
}
