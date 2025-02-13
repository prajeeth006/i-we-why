namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal interface IStaticUrlTransformer
    {
        string Transform(string url, string sourceLanguage, string targetLanguage);
    }
}
