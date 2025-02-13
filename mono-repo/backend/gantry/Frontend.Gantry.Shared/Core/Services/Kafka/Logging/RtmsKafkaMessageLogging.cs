using System.Collections.Generic;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;

namespace Frontend.Gantry.Shared.Core.Services.Kafka.Logging
{
    public interface IRtmsKafkaMessageLogging
    {
        Dictionary<string, object> GetCustomLoggingProperties(RtmsMessageDetailsMessage rtmsMessageDetailsMessage);
        Dictionary<string, object> GetCustomLoggingProperties(RtmsSportsChannelMessageDetails rtmsMessageDetailsMessage);
    }

    public class RtmsKafkaMessageLogging : IRtmsKafkaMessageLogging
    {
        public Dictionary<string, object> GetCustomLoggingProperties(RtmsMessageDetailsMessage rtmsMessageDetailsMessage)
        {
            var customProps = new Dictionary<string, object>();

            if (rtmsMessageDetailsMessage?.target != null && rtmsMessageDetailsMessage.msg != null)
            {
                AddCustomLoggingProperties(rtmsMessageDetailsMessage, customProps);

                customProps.Add("rtmsMessageDetailsMessage.message.Type", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.msg.type) ?
                    rtmsMessageDetailsMessage.source : string.Empty);

                //Ravi:Add screen group for only first object. As per SOC its okay with them now.
                customProps.Add("rtmsMessageDetailsMessage.message.Payload.ScreenGroups.screenTypeId", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].screenTypeId : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.TemplateUrl", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].templateUrl : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.ScreenId", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].screenId.ToString() : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.viewId", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].viewId?.ToString() : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.viewGroup", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].viewGroup?.ToString() : string.Empty);
                //ContentMediaType Property Commenting as this is part of march release 
                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.ContentMediaType", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].ContentMediaType : string.Empty);
                //ContentProvider Property Commenting as this is part of march release 
                customProps.Add("rtmsMessageDetailsMessage.message.payload.screenGroups.ContentProvider", rtmsMessageDetailsMessage?.msg?.payload?.screenGroups?.Count > 0 ? rtmsMessageDetailsMessage.msg.payload.screenGroups[0].ContentProvider : string.Empty);

            }
            return customProps;
        }

        public Dictionary<string, object> GetCustomLoggingProperties(RtmsSportsChannelMessageDetails rtmsMessageDetailsMessage)
        {
            var customProps = new Dictionary<string, object>();

            if (rtmsMessageDetailsMessage?.target != null && rtmsMessageDetailsMessage.msg != null)
            {
                AddCustomLoggingProperties(rtmsMessageDetailsMessage, customProps);

                customProps.Add("rtmsMessageDetailsMessage.message.Type", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.msg.type) ?
                    rtmsMessageDetailsMessage.msg.type : string.Empty);

                //Ravi:Add screen group for only first object. As per SOC its okay with them now.
                customProps.Add("rtmsMessageDetailsMessage.message.Payload.decoderGroups.Channel", rtmsMessageDetailsMessage?.msg?.payload?.decoderGroups?.Length > 0 ? rtmsMessageDetailsMessage.msg.payload.decoderGroups[0].channel : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.decoderGroups.DecoderID", rtmsMessageDetailsMessage?.msg?.payload?.decoderGroups?.Length > 0 ? rtmsMessageDetailsMessage.msg.payload.decoderGroups[0].decoderID : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.message.payload.traceID", !string.IsNullOrEmpty(rtmsMessageDetailsMessage?.msg?.payload?.traceID) ? rtmsMessageDetailsMessage.msg?.payload?.traceID : string.Empty);
            }
            return customProps;
        }

        private Dictionary<string, object> AddCustomLoggingProperties(BaseRtmsMessageDetails rtmsMessageDetailsMessage, Dictionary<string, object> customProps)
        {
            if (rtmsMessageDetailsMessage?.target != null)
            {
                customProps.Add("rtmsMessageDetailsMessage.target.Brand", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.target.brand) ?
                    rtmsMessageDetailsMessage.target.brand : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.target.Location", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.target.location) ?
                    rtmsMessageDetailsMessage.target.location : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.target.Shop", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.target.shop) ?
                    rtmsMessageDetailsMessage.target.shop : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.target.Device", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.target.device) ?
                    rtmsMessageDetailsMessage.target.device : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.target.Groups", rtmsMessageDetailsMessage?.target.groups?.Length > 0 ?
                    rtmsMessageDetailsMessage.target.groups[0] : string.Empty);

                customProps.Add("traceId", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.eid) ?
                    rtmsMessageDetailsMessage.eid : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.Time", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.time.ToString()) ?
                    rtmsMessageDetailsMessage.time.ToString() : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.Source", !string.IsNullOrEmpty(rtmsMessageDetailsMessage.source) ?
                    rtmsMessageDetailsMessage.source : string.Empty);

                customProps.Add("rtmsMessageDetailsMessage.target.Acknowledgement", rtmsMessageDetailsMessage.ack);
            }

            return customProps;
        }

    }
}
