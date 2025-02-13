using Frontend.Vanilla.Content;
using Frontend.Vanilla.Content.Loading;
using Frontend.Vanilla.Content.Model;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.Features.UrlTransformation.Content;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal sealed class UrlTransformationContentProcessor(
        IUrlTranslator urlTranslator,
        IUrlTransformationConfiguration config,
        ILogger<UrlTransformationContentProcessor> logger)
        : IPreCachingContentProcessor
    {
        public Task<Content<IDocument>> ProcessAsync(
            ExecutionMode mode,
            SuccessContent<IDocument> content,
            ICollection<IJustInTimeContentProcessor> jitProcessors,
            Action<object>? trace)
        {
            try
            {
                if (content.Document.Data.Fields.Any(x => x.Value is ContentLink))
                {
                    jitProcessors.Add(new ContentLinkProcessor(urlTranslator, config));
                }

                if (content.Document.Data.Fields.Any(x => x.Value is Uri))
                {
                    jitProcessors.Add(new UriProcessor(urlTranslator, config));
                }
            }
            catch (Exception ex)
            {
                logger.LogError("[UrlTransformation] - Failed url translation of content: " + ex);
            }

            return Task.FromResult(content as Content<IDocument>);
        }
    }
}
