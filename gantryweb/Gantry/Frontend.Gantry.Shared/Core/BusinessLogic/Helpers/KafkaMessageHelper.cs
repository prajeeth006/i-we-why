using Frontend.Gantry.Shared.Content;
using Frontend.Gantry.Shared.Core.Common.Constants;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Frontend.Gantry.Shared.Core.Models.Services.SiteCore;
using System;
using System.Collections.Generic;

namespace Frontend.Gantry.Shared.Core.BusinessLogic.Helpers
{
    public static class KafkaMessageHelper
    {
        public  static RtmsMessageDetailsMessage CreateRtmsMessage(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails, string url, GantryScreens gantryScreen)
        {
            var message = new RtmsMessageDetailsMessage
            {
                eid = siteCoreDisplayRuleItemDetails.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails, new []{ gantryScreen.screenTypeId }),
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
                                viewId = gantryScreen.viewId
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

        public static List<ScreenGroup> CreateScreenGroupsForMultiViewUrls(IList<MultiViewUrl> urls, int? ScreenInShop)
        {
            List<ScreenGroup> screenGroups = null;
            
            if (urls?.Count > 0)
            {
                screenGroups = new List<ScreenGroup>();

                foreach (var url in urls)
                {
                    screenGroups.Add(new ScreenGroup
                    {
                        screenId = ScreenInShop,
                        templateUrl = url.Url?.ToString(),
                        viewGroup = ConstantsPropertyValues.Quad,
                        viewId = url.DisplayOrder
                    });
                }
            }

            return screenGroups;
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

        private static Target SetUpTarget(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails,string[] groupNames)
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


        //Old Gantry no need in new Gantry
        public static RtmsMessageDetailsMessage CreateRtmsMessage(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails, IList<MultiViewUrl> urls)
        {
            var message = new RtmsMessageDetailsMessage
            {
                eid = siteCoreDisplayRuleItemDetails?.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails, null),
                msg = new Message
                {
                    payload = new Payload
                    {
                        screenGroups = CreateScreenGroupsForMultiViewUrls(urls, siteCoreDisplayRuleItemDetails.ScreenInShop)
                    }
                }
            };

            return message;
        }

        //Old Gantry no need in new Gantry
        public static RtmsMessageDetailsMessage CreateRtmsMessage(SiteCoreDisplayRuleItemDetails siteCoreDisplayRuleItemDetails, string url)
        {
            var message = new RtmsMessageDetailsMessage
            {
                eid = siteCoreDisplayRuleItemDetails.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails),
                msg = new Message
                {
                    payload = new Payload
                    {
                        screenGroups = new List<ScreenGroup>
                        {
                            new ScreenGroup
                            {
                                templateUrl = url,
                                screenId = siteCoreDisplayRuleItemDetails.ScreenInShop,
                                viewGroup = siteCoreDisplayRuleItemDetails.IsQuadUpdated ? ConstantsPropertyValues.Quad : ConstantsPropertyValues.Single,
                                viewId = siteCoreDisplayRuleItemDetails.IsQuadUpdated ? siteCoreDisplayRuleItemDetails.DisplayOrder : null
                            }
                        }
                    }
                }
            };

            return message;
        }

        //Old Gantry no need in new Gantry
        public static RtmsSportsChannelMessageDetails CreateRtmsSportsChannelMessageDetails(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails, ISportsChannels sportsChannels)
        {
            var message = new RtmsSportsChannelMessageDetails
            {
                eid = siteCoreDisplayRuleItemDetails?.DisplayRuleItemId ?? Guid.NewGuid().ToString(),
                target = SetUpTarget(siteCoreDisplayRuleItemDetails),
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

        //Old Gantry no need in new Gantry
        private static Target SetUpTarget(SiteCoreDisplayRuleItemDetails? siteCoreDisplayRuleItemDetails)
        {
            var target = new Target();

            if (siteCoreDisplayRuleItemDetails == null)
            {
                return target;
            }

            target.brand = siteCoreDisplayRuleItemDetails.Brand ?? ConstantsPropertyValues.Star;
            target.device = siteCoreDisplayRuleItemDetails.DeviceId ?? ConstantsPropertyValues.Star;
            target.shop = siteCoreDisplayRuleItemDetails.ShopId ?? ConstantsPropertyValues.Star;
            target.location = siteCoreDisplayRuleItemDetails.Location ?? ConstantsPropertyValues.DisplayPc;
            target.groups = siteCoreDisplayRuleItemDetails.GroupsNames;

            return target;
        }
    }
}