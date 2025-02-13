using Frontend.Vanilla.Features.Cookies;
using Frontend.Vanilla.Features.UI;

namespace Frontend.Vanilla.Features.Theming;

/// <summary>
/// Determines theme information.
/// </summary>
public interface IThemeResolver
{
    /// <summary>
    /// Theme name.
    /// </summary>
    string GetTheme();
}

internal sealed class ThemeResolver(ICookieHandler cookieHandler, IUserInterfaceConfiguration userInterfaceConfiguration)
    : IThemeResolver
{
    public static string CookieName => "dark-mode";

    public string GetTheme()
    {
        var value = cookieHandler.GetValue(CookieName);
        var darkModeEnabled = value is "1" or "2";

        return darkModeEnabled ? $"{userInterfaceConfiguration.Theme}-dark" : userInterfaceConfiguration.Theme;
    }
}
