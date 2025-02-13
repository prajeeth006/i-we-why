using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Microsoft.Extensions.Logging;
using System;
using System.Collections.Generic;
using System.Text;

namespace Frontend.Gantry.Shared.Core.Services.Kafka
{
    public interface IGetKeyRTMSKafka
    {
        string GetKeyForRTMSMessage<T>(T rtmsMessageDetailsMessage);
    }
    public class GetKeyRTMSKafka : IGetKeyRTMSKafka
    {
        private readonly ILogger<GetKeyRTMSKafka> _log;

        public GetKeyRTMSKafka(ILogger<GetKeyRTMSKafka> log)
        {
            _log = log;
        }

        public string GetKeyForRTMSMessage<T>(T rtmsMessageDetailsMessage)
        {
            string messageKey = string.Empty;
            try
            {
                if (rtmsMessageDetailsMessage is RtmsMessageDetailsMessage rtmsDetailsMessage)
                {
                    if (!string.IsNullOrEmpty(rtmsDetailsMessage.target?.shop))
                    {
                        if (!string.IsNullOrEmpty(rtmsDetailsMessage.target.brand))
                            messageKey = rtmsDetailsMessage.target.brand;
                        if (!string.IsNullOrEmpty(rtmsDetailsMessage.target?.shop))
                            messageKey = messageKey + "_PresenceMessage" + "_" + rtmsDetailsMessage.target.shop;
                    }
                    else
                    {
                        if (rtmsDetailsMessage.target?.groups != null &&
                            rtmsDetailsMessage.msg is {payload: not null} and {payload.screenGroups: not null})
                        {
                            if (!string.IsNullOrEmpty(rtmsDetailsMessage.target.brand))
                                messageKey = rtmsDetailsMessage.target.brand;

                            if (!string.IsNullOrEmpty(rtmsDetailsMessage.target?.groups[0]))
                                messageKey = messageKey + "_" + rtmsDetailsMessage.target?.groups[0];
                            if (rtmsDetailsMessage.msg.payload.screenGroups[0].screenId.HasValue)
                                messageKey = messageKey + "_" + rtmsDetailsMessage.msg.payload.screenGroups[0].screenId;
                            if (!string.IsNullOrEmpty(rtmsDetailsMessage.msg.payload.screenGroups[0].viewGroup))
                                messageKey = messageKey + "_" + rtmsDetailsMessage.msg.payload.screenGroups[0].viewGroup;
                            if (rtmsDetailsMessage.msg.payload.screenGroups[0].viewId.HasValue)
                                messageKey = messageKey + "_" + rtmsDetailsMessage.msg.payload.screenGroups[0].viewId;
                        }
                    }
                }

                if (rtmsMessageDetailsMessage is RtmsSportsChannelMessageDetails rtmsSportsDetailsMessage)
                {
                    if (rtmsSportsDetailsMessage.target?.groups != null &&
                        rtmsSportsDetailsMessage.msg is {payload: not null} and {payload.decoderGroups: not null})
                    {
                        if (!string.IsNullOrEmpty(rtmsSportsDetailsMessage.target.brand))
                            messageKey = rtmsSportsDetailsMessage.target.brand;
                        if (!string.IsNullOrEmpty(rtmsSportsDetailsMessage.target?.groups[0]))
                            messageKey = messageKey + "_" + rtmsSportsDetailsMessage.target?.groups[0];
                        if (!string.IsNullOrEmpty(rtmsSportsDetailsMessage.msg.payload.decoderGroups[0].decoderID))
                            messageKey = messageKey + "_" +
                                         rtmsSportsDetailsMessage.msg.payload.decoderGroups[0].decoderID;
                    }
                }
            }
            catch (Exception e)
            {
                _log.LogError($"Not able to generate Key for the RTMS Kafka Message: {e.Message}", e);
            }

            return messageKey;

        }
    }
}
