using System.Collections.Generic;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal interface IUrlTransformationLocalizationProvider
    {
        string CurrentLocale { get; }

        string DefaultLocale { get; }

        string Sanitize(string input);

        IDictionary<string, string> GetLocalizations(string? language = null);

        IEnumerable<string> GetSeoMatchers();

        string GetTranslated(string key);
    }
}
