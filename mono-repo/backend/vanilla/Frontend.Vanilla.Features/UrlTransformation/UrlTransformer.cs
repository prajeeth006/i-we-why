using System.Text.RegularExpressions;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class UrlTransformer : IUrlTransformer
    {
        private readonly IUrlTransformationConfiguration urlsConfiguration;

        public UrlTransformer(IUrlTransformationConfiguration urlsConfiguration)
        {
            this.urlsConfiguration = urlsConfiguration;
        }

        public string Transform(string url)
        {
            foreach (var transformation in urlsConfiguration.UrlTransformations)
            {
                if (Regex.IsMatch(url, transformation.Matcher, RegexOptions.IgnoreCase))
                {
                    return Regex.Replace(url, transformation.Matcher, transformation.Output, RegexOptions.IgnoreCase);
                }
            }

            return url;
        }
    }
}
