using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.JsonConverters
{
    public class SiteCoreDisplayRuleItemConverter : JsonConverter
    {
        bool _canWrite = true;
        public override bool CanWrite
        {
            get { return _canWrite; }
        }
        public override void WriteJson(JsonWriter writer, object value, JsonSerializer serializer)
        {
            SiteCoreDisplayRuleItemDetails writeValue = (SiteCoreDisplayRuleItemDetails)value;
            JObject jo;
            _canWrite = false;
            jo = JObject.FromObject(writeValue);
            _canWrite = true;
            jo.WriteTo(writer);
        }

        public override object? ReadJson(JsonReader reader, Type objectType, object existingValue, JsonSerializer serializer)
        {
            SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails = null;
            if (reader.TokenType == JsonToken.Null)
                return siteCoreDisplayRuleItemDetails;

            var siteCoreItemDetailsMessageInArray = JsonConvert.DeserializeObject<SiteCoreDisplayRuleItemDetailsInArray>(
                JObject.Load(reader).ToString(),
                new JsonSerializerSettings
                {
                    NullValueHandling = NullValueHandling.Ignore
                });

            if (siteCoreItemDetailsMessageInArray != null)
            {
                siteCoreDisplayRuleItemDetails = new SiteCoreDisplayRuleItemDetails
                {
                    Brand = siteCoreItemDetailsMessageInArray.BrandName?.FirstOrDefault(),
                    DeviceId = siteCoreItemDetailsMessageInArray.DeviceId?.FirstOrDefault(),
                    TargetItemId = siteCoreItemDetailsMessageInArray.TargetItemId?.FirstOrDefault(),
                    TargetItemPath = siteCoreItemDetailsMessageInArray.TargetItemPath?.FirstOrDefault(),
                    ShopId = siteCoreItemDetailsMessageInArray.Shop?.FirstOrDefault(),
                    ScreenInShop = int.TryParse(siteCoreItemDetailsMessageInArray.ScreenInShop?.FirstOrDefault(), out int result) ? result : (int?) null,
                    GroupsNames = siteCoreItemDetailsMessageInArray.ScreenGroup?.Where(x => !string.IsNullOrEmpty(x)).ToArray() ?? new string[] { },
                    Location = siteCoreItemDetailsMessageInArray.ShopLocation?.FirstOrDefault(),
                    TemplateName = siteCoreItemDetailsMessageInArray.TemplateName?.FirstOrDefault(),
                    Updated = siteCoreItemDetailsMessageInArray.Updated?.FirstOrDefault(),
                    CategoryCode = siteCoreItemDetailsMessageInArray.CategoryCode?.FirstOrDefault(),
                    ClassName = siteCoreItemDetailsMessageInArray.ClassName?.FirstOrDefault(),
                    EventId= siteCoreItemDetailsMessageInArray.EventId?.FirstOrDefault(),
                    MarketIds = siteCoreItemDetailsMessageInArray.MarketIds != null && siteCoreItemDetailsMessageInArray.MarketIds.Any(x=>!string.IsNullOrEmpty(x)) ? 
                                 JsonConvert.DeserializeObject<List<Market>>(siteCoreItemDetailsMessageInArray.MarketIds?.FirstOrDefault()): null,
                    TypeId= siteCoreItemDetailsMessageInArray.TypeId?.FirstOrDefault(),
                    TypeName= siteCoreItemDetailsMessageInArray.TypeName?.FirstOrDefault(),
                    IsStaticPromotion = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsStaticPromotion?.FirstOrDefault()),
                    IsMultiView = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsMultiView?.FirstOrDefault()),
                    IsCarousel = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsCarousel?.FirstOrDefault()),
                    IsQuadUpdated = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsQuadUpdated?.FirstOrDefault()),
                    CarouselDuration = Convert.ToInt16(siteCoreItemDetailsMessageInArray.CarouselDuration?.FirstOrDefault()),
                    DisplayOrder = Convert.ToInt16(siteCoreItemDetailsMessageInArray.DisplayOrder?.FirstOrDefault()),
                    IsSportsChannel = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsSportsChannel?.FirstOrDefault()),
                    DecoderID = siteCoreItemDetailsMessageInArray?.decoderID?.FirstOrDefault(),
                    EventMarketPairs = siteCoreItemDetailsMessageInArray?.eventMarketPairs?.FirstOrDefault(),
                    TypeIds = siteCoreItemDetailsMessageInArray?.typeIds?.FirstOrDefault(),
                    GantryScreens = siteCoreItemDetailsMessageInArray.GantryScreens != null && siteCoreItemDetailsMessageInArray.GantryScreens.Any(x => !string.IsNullOrEmpty(x)) ?
                        JsonConvert.DeserializeObject<List<GantryScreens>>(siteCoreItemDetailsMessageInArray.GantryScreens?.FirstOrDefault()) : null,
                    contentItemId = siteCoreItemDetailsMessageInArray.contentItemId?.FirstOrDefault(),
                    IsManualCreateTemplate = Convert.ToBoolean(siteCoreItemDetailsMessageInArray.IsManualCreateTemplate?.FirstOrDefault()),
                };
            }

            
            return siteCoreDisplayRuleItemDetails;
        }

        public override bool CanConvert(Type objectType)
        {
            return objectType == typeof(SiteCoreDisplayRuleItemDetails);
        }   
    }
}