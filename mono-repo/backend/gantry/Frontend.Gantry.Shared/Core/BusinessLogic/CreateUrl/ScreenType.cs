using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Microsoft.Extensions.Logging;
using System;
using Frontend.Vanilla.Core.System.Uris;
using System.Web;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl
{
    public interface IScreenType
    {
        string SetScreenType(GantryScreens? gantryScreen, string? url);
    }

    public class ScreenType : IScreenType
    {
        private readonly ILogger<ScreenType> _log;

        public ScreenType(ILogger<ScreenType> log)
        {
            _log = log;
        }

        public string SetScreenType(GantryScreens? gantryScreen, string? url)
        {
            try
            {
                string result = string.Empty;

                if (!string.IsNullOrWhiteSpace(url)) // && gantryScreen != null
                {
                    UriBuilder builder = new UriBuilder(url);

                    string screenType = gantryScreen?.screenType?.ToLower() == ConstantsPropertyValues.Quad.ToLower()
                        ? ConstantsPropertyValues.Quad.ToLower() :
                        gantryScreen?.screenType?.ToLower() == ConstantsPropertyValues.Half.ToLower()
                            ? ConstantsPropertyValues.Half.ToLower() :
                            gantryScreen?.screenType?.ToLower() == ConstantsPropertyValues.Single.ToLower() 
                                ? ConstantsPropertyValues.Full.ToLower() : ConstantsPropertyValues.Full.ToLower();

                    builder.AddQueryParametersIfValueNotWhiteSpace((ConstantsPropertyValues.ScreenType, screenType));

                    result = builder.Uri?.ToString();
                }

                return result;
            }

            catch (Exception e)
            {
                _log.LogError(e.Message, e);
                return null;
            }

        }
    }
}
