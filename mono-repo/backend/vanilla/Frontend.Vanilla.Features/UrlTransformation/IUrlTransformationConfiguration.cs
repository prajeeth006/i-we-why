namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal interface IUrlTransformationConfiguration
    {
        #region Locales

        [Locale]
        UrlTranslation Bg { get; }

        [Locale]
        UrlTranslation Cs { get; }

        [Locale]
        UrlTranslation Da { get; }

        [Locale]
        [Locale("de-at")]
        UrlTranslation De { get; }

        [Locale]
        UrlTranslation El { get; }

        [Locale]
        UrlTranslation En { get; }

        [Locale]
        UrlTranslation Es { get; }

        [Locale("es-cl")]
        UrlTranslation EsCl { get; }

        [Locale("es-mx")]
        UrlTranslation EsMx { get; }

        [Locale("es-xl")]
        UrlTranslation EsXl { get; }

        [Locale]
        UrlTranslation Fr { get; }

        [Locale]
        UrlTranslation Hr { get; }

        [Locale]
        UrlTranslation Hu { get; }

        [Locale]
        UrlTranslation It { get; }

        [Locale]
        UrlTranslation Nl { get; }

        [Locale]
        UrlTranslation Pl { get; }

        [Locale]
        UrlTranslation Pt { get; }

        [Locale("pt-br")]
        UrlTranslation PtBr { get; }

        [Locale]
        UrlTranslation Ro { get; }

        [Locale]
        UrlTranslation Ru { get; }

        [Locale]
        UrlTranslation Sk { get; }

        [Locale]
        UrlTranslation Sl { get; }

        [Locale]
        UrlTranslation Sv { get; }

        [Locale]
        UrlTranslation Tr { get; }

        [Locale("en-ca")]
        UrlTranslation EnCa { get; }

        #endregion Locales

        int MaxTokenLength { get; }

        bool UrlMalformedWarning { get; }

        bool ForceHttps { get; }

        string UrlSanitizer { get; }

        string[] SeoUrlMatchers { get; }

        UrlTransformation[] UrlTransformations { get; }

        bool IsEnabled { get; }
    }
}
