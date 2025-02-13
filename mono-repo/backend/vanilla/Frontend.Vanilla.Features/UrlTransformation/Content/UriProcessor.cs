using System;

namespace Frontend.Vanilla.Features.UrlTransformation.Content
{
    internal sealed class UriProcessor : BaseProcessor<Uri>
    {
        internal UriProcessor(IUrlTranslator urlTranslator, IUrlTransformationConfiguration config)
            : base(urlTranslator, config)
        {
        }

        protected override Uri Build(Uri original, Uri translated) => translated;

        protected override Uri Parse(Uri field) => field;
    }
}
