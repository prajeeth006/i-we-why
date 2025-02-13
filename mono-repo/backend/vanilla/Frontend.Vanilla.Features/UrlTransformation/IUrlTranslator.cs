using System.Threading;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal interface IUrlTranslator
    {
        string Translate(string url, string urlSource, CancellationToken cancellationToken);
        string Translate(string url, string urlSource, string sourceLanguage, string targetLanguage, CancellationToken cancellationToken);
    }
}
