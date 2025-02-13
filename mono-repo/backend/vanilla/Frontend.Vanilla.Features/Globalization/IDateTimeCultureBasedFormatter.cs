using System;
using System.Globalization;
using Frontend.Vanilla.ServiceClients.Claims;
using Frontend.Vanilla.ServiceClients.Security;

namespace Frontend.Vanilla.Features.Globalization;

internal interface IDateTimeCultureBasedFormatter
{
    string Format(DateTime dateTime, string? format = "g");
}

internal sealed class DateTimeCultureBasedFormatter(ILanguageService languageService, ICurrentUserAccessor currentUserAccessor) : IDateTimeCultureBasedFormatter
{
    public string Format(DateTime dateTime, string? format = "g")
    {
        var cultureInfo = CultureInfo.CurrentCulture;
        var userCulture = currentUserAccessor.User.FindFirst(PosApiClaimTypes.CultureName);
        if (userCulture != null)
            cultureInfo = new CultureInfo(userCulture.Value);

        if (languageService.UseBrowserLanguage)
        {
            cultureInfo = new CultureInfo(languageService.BrowserPreferredCulture!);
        }

        return dateTime.ToString(format, cultureInfo);
    }
}
