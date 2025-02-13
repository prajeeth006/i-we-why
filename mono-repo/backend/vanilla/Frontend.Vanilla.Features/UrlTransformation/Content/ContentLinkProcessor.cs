using Frontend.Vanilla.Content.Model;
using System;

namespace Frontend.Vanilla.Features.UrlTransformation.Content
{
    internal sealed class ContentLinkProcessor : BaseProcessor<ContentLink>
    {
        public ContentLinkProcessor(IUrlTranslator urlTranslator, IUrlTransformationConfiguration config)
            : base(urlTranslator, config)
        {
        }

        protected override ContentLink Build(ContentLink original, Uri translated) => new ContentLink(translated, original.Text, original.Attributes);

        protected override Uri Parse(ContentLink field) => field.Url;
    }
}
