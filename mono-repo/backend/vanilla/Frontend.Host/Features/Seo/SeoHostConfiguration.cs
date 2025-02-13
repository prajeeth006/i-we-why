namespace Frontend.Host.Features.Seo
{
    public interface ISeoHostConfiguration
    {
        bool IsEnabled { get; }
    }
    internal sealed class SeoHostConfiguration : ISeoHostConfiguration
    {
        public const string FeatureName = "Host.Features.SEO";
        public bool IsEnabled { get; set; }
    }
}
