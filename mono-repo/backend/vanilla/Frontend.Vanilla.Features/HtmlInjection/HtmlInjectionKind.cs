using System;

namespace Frontend.Vanilla.Features.HtmlInjection;

[Flags]
internal enum HtmlInjectionKind
{
    None = 0,
    SitecoreHtmlHeadTags = 1 << 0,
    HeadTags = 1 << 1,
    AbTesting = 1 << 2,
    Gtm = 1 << 3,
    All = int.MaxValue,
}
