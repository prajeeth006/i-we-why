using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Gantry.Shared.Core.BusinessLogic
{
    public interface IBrandUrl
    {
        string GetBrandUrl(string siteCoreItemDetailsMessageParam, IDictionary<string, string> brandUrlMapper, string displayManagerScreenPathWithoutLabelName);
        string GetBrandUrl(PresenceMessage siteCoreItemDetailsMessageParam, IDictionary<string, string> brandUrlMapper);
    }

    public class BrandUrl : IBrandUrl
    {
        private readonly ILogger<BrandUrl> _log;

        public BrandUrl(ILogger<BrandUrl> log)
        {
            _log = log;
        }

        public string? GetBrandUrl(string siteCoreItemDetailsMessageParam, IDictionary<string, string> brandUrlMapper, string displayManagerScreenPathWithoutLabelName)
        {
            try
            {
                string result = null;
                var siteCoreItemDetailsMessage = JsonConvert.DeserializeObject<SiteCoreItemDetailsMessage>(
                    siteCoreItemDetailsMessageParam,
                    new JsonSerializerSettings
                    {
                        NullValueHandling = NullValueHandling.Ignore
                    });

                string? labelName = siteCoreItemDetailsMessage?.Path?.ToLowerInvariant().Replace(displayManagerScreenPathWithoutLabelName?.ToLowerInvariant(), string.Empty).Replace(ConstantsSiteCoreItemPaths.SitecoreContentPath, string.Empty).Split('/').Where(p => p != string.Empty).ToList().First();

                if (labelName != null && brandUrlMapper != null && brandUrlMapper.TryGetValue(labelName.ToLower(), out string labelUrl))
                {
                    result = labelUrl;
                }

                return result;
            }
            catch (Exception e)
            {
                _log.LogError(e, e.Message);
                return null;
            }
        }

        public string GetBrandUrl(PresenceMessage presenceMessage, IDictionary<string, string> brandUrlMapper)
        {
            string result = null;

            string? labelName = presenceMessage?.Sender.brand;

            if (labelName != null && brandUrlMapper != null && brandUrlMapper.TryGetValue(labelName.ToLower(), out string labelUrl))
            {
                result = labelUrl;
            }

            return result;
        }
    }
}