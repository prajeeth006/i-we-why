using Frontend.Gantry.Shared.Core.BusinessLogic;
using NUnit.Framework;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Frontend.Gantry.Shared.Core.Services.Kafka;
using Microsoft.Extensions.Logging;
using Moq;
using Frontend.Gantry.Shared.Core.Models.Services.Kafka;
using Decoder = Frontend.Gantry.Shared.Core.Models.Services.Kafka.Decoder;

namespace Frontend.Gantry.Tests.core.BusinessLogic
{
    class GetKeyForRTMSKafkaMessageTests
    {
        private GetKeyRTMSKafka _getKeyRtmsKafka;
        [SetUp]
        public void SetUp()
        {
            _getKeyRtmsKafka = new GetKeyRTMSKafka(
                new Mock<ILogger<GetKeyRTMSKafka>>().Object);
        }

        [Test]
        public void getMessageKeyRTMSKafka()
        {
            RtmsMessageDetailsMessage rtmsMessageDetailsMessage = new RtmsMessageDetailsMessage();
            rtmsMessageDetailsMessage.msg = new Message()
            {
                type = "SCREEN_CTRL",
                payload = new Payload
                {
                    screenGroups = new List<ScreenGroup>
                    {
                        new ScreenGroup
                        {
                            screenTypeId = null,
                            templateUrl = null,
                            screenId = 1,
                            viewId = 2,
                            viewGroup = "QUAD"
                        }
                    }
                }
            };
            rtmsMessageDetailsMessage.target = new Target
            {
                brand = "CORAL",
                location = null,
                shop = null,
                device = null,
                groups = new string[]
                {
                    "GANTRY21"
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsMessageDetailsMessage);

            Assert.AreEqual("CORAL_GANTRY21_1_QUAD_2", messageKey);
        }

        [Test]
        public void getMessageKeyRTMSKafkaShouldNotThrowException()
        {
            RtmsMessageDetailsMessage rtmsMessageDetailsMessage = new RtmsMessageDetailsMessage();
            rtmsMessageDetailsMessage.msg = new Message()
            {
                type = "SCREEN_CTRL",
                payload = new Payload
                {
                    screenGroups = new List<ScreenGroup>
                    {
                        new ScreenGroup
                        {
                            screenTypeId = null,
                            templateUrl = null,
                            screenId = null,
                            viewId = null,
                            viewGroup = ""
                        }
                    }
                }
            };
            rtmsMessageDetailsMessage.target = new Target
            {
                brand = "",
                location = null,
                shop = null,
                device = null,
                groups = new string[]
                {
                    ""
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsMessageDetailsMessage);

            Assert.AreEqual("", messageKey);
        }
        [Test]
        public void getMessageKeyRTMSKafkaForSportsChannel()
        {
            RtmsSportsChannelMessageDetails rtmsSportsChannelMessageDetails = new RtmsSportsChannelMessageDetails
            {
                eid = null,
                time = 0,
                source = null,
                ack = false,
                target = new Target
                {
                    brand = "CORAL",
                    location = null,
                    shop = null,
                    device = null,
                    groups = new string[]
                    {
                        "GANTRY 3*3"
                    }
                },
                msg = new SportsChannelMessage
                {
                    type = null,
                    payload = new SportsChannelPayload
                    {
                        traceID = null,
                        decoderGroups = new Decoder[]
                        {
                            new Decoder
                            {
                                decoderID = "12345",
                                channel = null
                            }
                        }
                    }
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsSportsChannelMessageDetails);

            Assert.AreEqual("CORAL_GANTRY 3*3_12345", messageKey);
        }

        [Test]
        public void getMessageKeyRTMSKafkaForSportsChannelShouldNotThrowException()
        {
            RtmsSportsChannelMessageDetails rtmsSportsChannelMessageDetails = new RtmsSportsChannelMessageDetails
            {
                eid = null,
                time = 0,
                source = null,
                ack = false,
                target = new Target
                {
                    brand = "",
                    location = null,
                    shop = null,
                    device = null,
                    groups = new string[]
                    {
                        ""
                    }
                },
                msg = new SportsChannelMessage
                {
                    type = null,
                    payload = new SportsChannelPayload
                    {
                        traceID = null,
                        decoderGroups = new Decoder[]
                        {
                            new Decoder
                            {
                                decoderID = "",
                                channel = null
                            }
                        }
                    }
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsSportsChannelMessageDetails);

            Assert.AreEqual("", messageKey);
        }

        [Test]
        public void getPresenceMessageKeyRTMSKafkaShouldNotThrowException()
        {
            RtmsMessageDetailsMessage rtmsMessageDetailsMessage = new RtmsMessageDetailsMessage();
            rtmsMessageDetailsMessage.msg = new Message()
            {
                type = "SCREEN_CTRL",
                payload = new Payload
                {
                    screenGroups = new List<ScreenGroup>
                    {
                        new ScreenGroup
                        {
                            screenTypeId = null,
                            templateUrl = null,
                            screenId = null,
                            viewId = null,
                            viewGroup = ""
                        }
                    }
                }
            };
            rtmsMessageDetailsMessage.target = new Target
            {
                brand = "",
                location = null,
                shop = null,
                device = null,
                groups = new string[]
                {
                    ""
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsMessageDetailsMessage);

            Assert.AreEqual("", messageKey);
        }
        [Test]
        public void getPresenceMessageKeyRTMSKafka()
        {
            RtmsMessageDetailsMessage rtmsMessageDetailsMessage = new RtmsMessageDetailsMessage();
            rtmsMessageDetailsMessage.msg = new Message()
            {
                type = "SCREEN_CTRL",
                payload = new Payload
                {
                    screenGroups = new List<ScreenGroup>
                    {
                        new ScreenGroup
                        {
                            screenTypeId = null,
                            templateUrl = null,
                            screenId = null,
                            viewId = null,
                            viewGroup = ""
                        }
                    }
                }
            };
            rtmsMessageDetailsMessage.target = new Target
            {
                brand = "CORAL",
                location = null,
                shop = "8091",
                device = null,
                groups = new string[]
                {
                    ""
                }
            };
            string messageKey = _getKeyRtmsKafka.GetKeyForRTMSMessage(rtmsMessageDetailsMessage);

            Assert.AreEqual("CORAL_PresenceMessage_8091", messageKey);
        }
    }
}
