using System.Globalization;
using Frontend.Vanilla.Core.System.Text;

namespace Frontend.Vanilla.Features.Globalization.LanguageResolvers;

internal static class CultureInfoHelper
{
    public static CultureInfo? Find(string? name)
    {
        // Explicit check b/c empty string is a valid CultureInfo
        if (name.IsNullOrWhiteSpace())
            return null;

        try
        {
            var culture = new CultureInfo(name, useUserOverride: false);

            // Windows 10 and above creates CultureInfo for any valid string e.g. xx-YY -> sanitize it
            // https://social.msdn.microsoft.com/Forums/vstudio/en-US/70f01bf8-290b-43e3-a2ae-08870220c3c8/cultureinfogetcultureinfo-behavior-change-on-windows-10?forum=netfxbcl
            return !culture.CultureTypes.HasFlag(CultureTypes.UserCustomCulture) ? culture : null;
        }
        catch (CultureNotFoundException)
        {
            return null;
        }
    }

    public static void SetCurrent(CultureInfo culture)
    {
        CultureInfo.CurrentCulture = culture;
        CultureInfo.CurrentUICulture = culture;
    }
}
