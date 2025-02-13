using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Core.System;
using System;
using System.Linq;
using System.Net;
using System.Threading;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.UrlTransformation.Content
{
    internal abstract class BaseProcessor<T> : IJustInTimeContentProcessor
        where T : class
    {
        private readonly IUrlTranslator urlTranslator;
        private readonly IUrlTransformationConfiguration config;

        public BaseProcessor(IUrlTranslator urlTranslator, IUrlTransformationConfiguration config)
        {
            this.urlTranslator = urlTranslator;
            this.config = config;
        }

        public Task<Content<IDocument>> ProcessAsync(ExecutionMode mode, SuccessContent<IDocument> content, ContentLoadOptions options, IContentLoader loader, Action<object>? trace)
        {
            if (mode.AsyncCancellationToken != null)
            {
                try
                {
                    foreach (var field in content.Document.Data.Fields.Where(x => x.Value is T))
                    {
                        var value = field.Value as T;
                        var link = Parse(value!);

                        if (config.IsEnabled && link != null && link.IsSportRequest())
                        {
                            var path = Path(link);
                            var translated = urlTranslator.Translate(path, GetLogging(content.Document), mode.AsyncCancellationToken ?? CancellationToken.None);

                            if (!string.Equals(path, translated, StringComparison.OrdinalIgnoreCase))
                            {
                                var translatedValue = Build(value!, Replace(link, path, translated));

                                content = content.WithFieldsOverwritten((field.Key, translatedValue));
                            }
                        }
                    }

                    return Task.FromResult((Content<IDocument>)content);
                }
                catch (Exception ex)
                {
                    trace?.Invoke("Failed to translate url");
                    trace?.Invoke(ex);
                }
            }

            return Task.FromResult((Content<IDocument>)content);
        }

        public Uri Replace(Uri uri, string match, string replacement)
        {
            var result = WebUtility.UrlDecode(uri.ToString()).Replace(match, replacement);

            return new UriBuilder(result)
            {
                Port = -1,
            }.Uri;
        }

        protected abstract Uri Parse(T field);

        protected abstract T Build(T original, Uri translated);

        private string Path(Uri uri)
        {
            return uri.IsAbsoluteUri ? uri.PathAndQuery : uri.OriginalString;
        }

        public string GetSource(IDocument document)
        {
            return document?.Data?.Metadata?.Id?.Path ?? string.Empty;
        }

        public string GetCulture(IDocument document)
        {
            return document?.Data?.Metadata?.Id?.Culture.ToString() ?? string.Empty;
        }

        public string GetLogging(IDocument document)
        {
            return $"Sitecore;Path={GetSource(document)};Lang={GetCulture(document)};";
        }
    }
}
