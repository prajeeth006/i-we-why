namespace Frontend.Host.Features.UrlTransformation
{
    public interface IPrettyUrlsHostConfiguration
    {
        bool IsEnabled { get; }
    }
    internal sealed class PrettyUrlsHostConfiguration : IPrettyUrlsHostConfiguration
    {
        public const string FeatureName = "Host.Features.PrettyUrls";
        public bool IsEnabled { get; set; }
    }
}
