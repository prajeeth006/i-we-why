using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System;
using System.Collections.Generic;
using Frontend.Gantry.Shared.Core.Common;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using Frontend.Gantry.Shared.Core.BusinessLogic.CreateUrl;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Helpers
{
    public static class KafkaMessageHelper
    {
        public static RtmsMessageDetailsMessage CreateRtmsMessage(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails, string url, GantryScreens gantryScreen)
        {
            var message = new RtmsMessageDetailsMessage
            {
                eid = siteCoreDisplayRuleItemDetails.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails, new[] { gantryScreen.screenTypeId }),
                msg = new Message
                {
                    payload = new Payload
                    {
                        screenGroups = new List<ScreenGroup>
                        {
                            new ScreenGroup
                            {
                                templateUrl = url,
                                screenId = gantryScreen.screenId,
                                viewGroup = gantryScreen.viewGroup,
                                viewId = gantryScreen.viewId,
                                ContentMediaType = siteCoreDisplayRuleItemDetails?.ContentMediaType,
                                ContentProvider = siteCoreDisplayRuleItemDetails?.ContentProvider
                            }
                        }
                    }
                }
            };

            return message;
        }

        public static RtmsMessageDetailsMessage CreateRtmsMessage(PresenceMessage presenceMessage)
        {
            var message = new RtmsMessageDetailsMessage
            {
                eid = presenceMessage.Sid,
                target = presenceMessage.Sender,
                msg = new Message
                {
                    payload = new Payload()
                }
            };

            return message;
        }

        
        public static RtmsSportsChannelMessageDetails CreateRtmsSportsChannelMessageDetails(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails, ISportsChannels sportsChannels, string[] groupNames)
        {
            var message = new RtmsSportsChannelMessageDetails
            {
                eid = siteCoreDisplayRuleItemDetails?.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails, groupNames),
                msg = new SportsChannelMessage
                {
                    payload = new SportsChannelPayload
                    {
                        decoderGroups = new Decoder[]
                        {
                            new Decoder(){decoderID = siteCoreDisplayRuleItemDetails?.DecoderID, channel = sportsChannels?.ChannelId}
                        } //Added decoder groups here.
                    }

                }
            };

            return message;
        }

        private static Target SetUpTarget(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails, string[] groupNames)
        {
            var target = new Target();

            if (siteCoreDisplayRuleItemDetails == null)
            {
                return target;
            }

            // TODO: Can the properties be null here?
            target.brand = siteCoreDisplayRuleItemDetails.Brand ?? ConstantsPropertyValues.Star;
            target.device = siteCoreDisplayRuleItemDetails.DeviceId ?? ConstantsPropertyValues.Star;
            target.shop = siteCoreDisplayRuleItemDetails.ShopId ?? ConstantsPropertyValues.Star;
            target.location = siteCoreDisplayRuleItemDetails.Location ?? ConstantsPropertyValues.DisplayPc;
            target.groups = groupNames;

            return target;
        }


       
        public static bool ValidationProduceMessageToKafka(RtmsMessageDetailsMessage rtmsMessageDetailsMessage)
        {
            if (string.IsNullOrEmpty(rtmsMessageDetailsMessage?.eid))
            {
                return false;
            }

            if (string.IsNullOrEmpty(rtmsMessageDetailsMessage?.target?.brand))
            {
                return false;
            }

            return true;
        }

        public static bool ValidateScreenGroups(SiteCoreDisplayRuleItemDetails screenGroup, string replacedPlaceHolderInUrl)
        {
            if (screenGroup == null)
                return false;

            if ((screenGroup.ViewGroup == ConstantsPropertyValues.Single) && !string.IsNullOrEmpty(replacedPlaceHolderInUrl) && !string.IsNullOrEmpty(screenGroup.ContentMediaType) && !string.IsNullOrEmpty(screenGroup.ContentProvider) && screenGroup.ScreenInShop != null)
            {
                return true;
            }

            if (string.IsNullOrEmpty(screenGroup.ViewGroup) || string.IsNullOrEmpty(screenGroup.ContentMediaType) || string.IsNullOrEmpty(replacedPlaceHolderInUrl) || screenGroup.ScreenInShop == null || screenGroup.ViewId == null || string.IsNullOrEmpty(screenGroup.ContentProvider))
            {
                return false;
            }
            return true;
        }

        public static bool ValidationSiteCoreRtmsMessage(RtmsMessageDetailsMessage rtmsMessageDetailsMessage)
        {
            bool checkRtmsMessage = ValidationProduceMessageToKafka(rtmsMessageDetailsMessage);
            if (!checkRtmsMessage)
            {
                return false;
            }
            if (rtmsMessageDetailsMessage?.msg != null)
            {
                var getMessage = rtmsMessageDetailsMessage?.msg?.payload?.screenGroups;
                if (getMessage != null && getMessage.Any())
                {
                    if (getMessage?.FirstOrDefault()?.viewGroup == ConstantsPropertyValues.Single)
                    {
                        var checkEmptyValues = getMessage.Where(x => string.IsNullOrEmpty(x.screenTypeId) || string.IsNullOrEmpty(x.viewGroup) || string.IsNullOrEmpty(x.templateUrl) || string.IsNullOrEmpty(x.ContentMediaType) || string.IsNullOrEmpty(x.ContentProvider) || x.screenId == null).ToList();
                        if (checkEmptyValues.Any())
                        {
                            return false;
                        }
                    }
                    else
                    {
                        var checkEmptyValues = getMessage?.Where(x => string.IsNullOrEmpty(x.screenTypeId) || string.IsNullOrEmpty(x.viewGroup) || string.IsNullOrEmpty(x.templateUrl) || string.IsNullOrEmpty(x.ContentMediaType) || string.IsNullOrEmpty(x.ContentProvider) || x.screenId == null || x.viewId == null).ToList();
                        if (checkEmptyValues?.Count != 0)
                        {
                            return false;
                        }
                    }
                }
            }
            return true;
        }

    }
}
