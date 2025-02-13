using Frontend.Vanilla.Core.System.Text;
using System.Linq;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class StaticUrlTransformer : IStaticUrlTransformer
    {
        private readonly char urlSeparator = '/';

        private readonly IUrlTransformationLocalizationProvider localizationProvider;

        public StaticUrlTransformer(IUrlTransformationLocalizationProvider localizationProvider)
        {
            this.localizationProvider = localizationProvider;
        }

        public string Transform(string url, string sourceLanguage, string targetLanguage)
        {
            if (sourceLanguage == targetLanguage)
            {
                return url;
            }

            var source = localizationProvider.GetLocalizations(sourceLanguage);
            var target = localizationProvider.GetLocalizations(targetLanguage);
            var map = source.ToDictionary(pair => pair.Value, pair => target[pair.Key]);

            map.Add(sourceLanguage.ToLowerInvariant(), targetLanguage.ToLowerInvariant());

            var (path, query) = url.SplitPath();

            var segments = path.Split(urlSeparator).Select(segment =>
            {
                if (map.TryGetValue(segment, out string? translated))
                {
                    return translated;
                }

                return segment;
            });

            return string.Join(urlSeparator.ToString(), segments) + query;
        }
    }
}
