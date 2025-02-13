using System;
using System.ComponentModel.DataAnnotations;

namespace Frontend.Vanilla.Features.UrlTransformation
{
    internal class UrlTransformationConfiguration : IUrlTransformationConfiguration
    {
        public const string FeatureName = "VanillaFramework.Features.UrlTransformation";

        public UrlTransformationConfiguration(UrlTranslation bg, UrlTranslation cs, UrlTranslation da, UrlTranslation de, UrlTranslation el, UrlTranslation en, UrlTranslation es, UrlTranslation esCl, UrlTranslation esMx, UrlTranslation esXl, UrlTranslation fr, UrlTranslation hr, UrlTranslation hu, UrlTranslation it, UrlTranslation nl, UrlTranslation pl, UrlTranslation pt, UrlTranslation ptBr, UrlTranslation ro, UrlTranslation ru, UrlTranslation sk, UrlTranslation sl, UrlTranslation sv, UrlTranslation tr, UrlTranslation enCa, int maxTokenLength, string[] seoUrlMatchers, UrlTransformation[] urlTransformations, bool urlMalformedWarning, bool forceHttps, string urlSanitizer, bool isEnabled)
        {
            Bg = bg;
            Cs = cs;
            Da = da;
            De = de;
            El = el;
            En = en;
            Es = es;
            EsCl = esCl;
            EsMx = esMx;
            EsXl = esXl;
            Fr = fr;
            Hr = hr;
            Hu = hu;
            It = it;
            Nl = nl;
            Pl = pl;
            Pt = pt;
            PtBr = ptBr;
            Ro = ro;
            Ru = ru;
            Sk = sk;
            Sl = sl;
            Sv = sv;
            Tr = tr;
            EnCa = enCa;
            MaxTokenLength = maxTokenLength;
            SeoUrlMatchers = seoUrlMatchers;
            UrlTransformations = urlTransformations;
            UrlMalformedWarning = urlMalformedWarning;
            ForceHttps = forceHttps;
            UrlSanitizer = urlSanitizer;
            IsEnabled = isEnabled;
        }
        #region Locales

        [Required]
        public UrlTranslation Bg { get; set; }

        [Required]
        public UrlTranslation Cs { get; set; }

        [Required]
        public UrlTranslation Da { get; set; }

        [Required]
        public UrlTranslation De { get; set; }

        [Required]
        public UrlTranslation El { get; set; }

        [Required]
        public UrlTranslation En { get; set; }

        [Required]
        public UrlTranslation Es { get; set; }

        [Required]
        public UrlTranslation EsCl { get; set; }

        [Required]
        public UrlTranslation EsMx { get; set; }

        [Required]
        public UrlTranslation EsXl { get; set; }

        [Required]
        public UrlTranslation Fr { get; set; }

        [Required]
        public UrlTranslation Hr { get; set; }

        [Required]
        public UrlTranslation Hu { get; set; }

        [Required]
        public UrlTranslation It { get; set; }

        [Required]
        public UrlTranslation Nl { get; set; }

        [Required]
        public UrlTranslation Pl { get; set; }

        [Required]
        public UrlTranslation Pt { get; set; }

        [Required]
        public UrlTranslation PtBr { get; set; }

        [Required]
        public UrlTranslation Ro { get; set; }

        [Required]
        public UrlTranslation Ru { get; set; }

        [Required]
        public UrlTranslation Sk { get; set; }

        [Required]
        public UrlTranslation Sl { get; set; }

        [Required]
        public UrlTranslation Sv { get; set; }

        [Required]
        public UrlTranslation Tr { get; set; }

        [Required]
        public UrlTranslation EnCa { get; set; }

        #endregion Locales

        [Required]
        public int MaxTokenLength { get; set; }

        [Required]
        public string[] SeoUrlMatchers { get; set; } = Array.Empty<string>();

        [Required]
        public UrlTransformation[] UrlTransformations { get; set; } = Array.Empty<UrlTransformation>();

        [Required]
        public bool UrlMalformedWarning { get; set; }

        [Required]
        public bool ForceHttps { get; set; }

        [Required]
        public string UrlSanitizer { get; set; } = string.Empty;

        [Required]
        public bool IsEnabled { get; set; } = false;
    }
}
