using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Crm.BonusBalance;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Crm.BonusData;

public sealed class BonusBalanceTests
{
    [Fact]
    public void ShouldBeDeserializedCorrectly()
    {
        const string json = @"{
                  ""productWiseBonusInfo"": [
                    {
                      ""key"": ""BINGO"",
                      ""value"": {
                        ""bonuses"": [
                          {
                            ""applicableProducts"": [
                              ""BINGO""
                            ],
                            ""bonusAmount"": 1200,
                            ""bonusCode"": ""BALBINGO101"",
                            ""bonusId"": 0,
                            ""bonusIssueId"": 64837028,
                            ""currency"": ""EUR"",
                            ""isBonusActive"": ""true"",
                            ""gvbInfo"": [
                              {
                                ""key"": ""BINGO"",
                                ""value"": null
                              }
                            ]
                          }
                        ],
                        ""cumulativeBonusAmount"": 1200,
                        ""currency"": ""EUR"",
                        ""multiProduct"": false
                      }
                    },
                    {
                      ""key"": ""POKER"",
                      ""value"": {
                        ""bonuses"": [
                          {
                            ""applicableProducts"": [
                              ""POKER""
                            ],
                            ""bonusAmount"": 1800,
                            ""bonusCode"": ""BALPOKER101"",
                            ""bonusId"": 0,
                            ""bonusIssueId"": 64837021,
                            ""currency"": ""EUR"",
                            ""isBonusActive"": ""true"",
                            ""gvbInfo"": [
                              {
                                ""key"": ""POKER"",
                                ""value"": null
                              }
                            ]
                          }
                        ],
                        ""cumulativeBonusAmount"": 1800,
                        ""currency"": ""EUR"",
                        ""multiProduct"": false
                      }
                    },
                    {
                      ""key"": ""MULTI"",
                      ""value"": {
                        ""bonuses"": [
                          {
                            ""applicableProducts"": [
                              ""CASINO""
                            ],
                            ""bonusAmount"": 1200,
                            ""bonusCode"": ""BALBON101"",
                            ""bonusId"": 0,
                            ""bonusIssueId"": 64837019,
                            ""currency"": ""EUR"",
                            ""isBonusActive"": ""true"",
                            ""gvbInfo"": [
                              {
                                ""key"": ""CASINO"",
                                ""value"": {
                                  ""mobileGames"": [],
                                  ""nonMobileGames"": [],
                                  ""bonusChannelsInfo"": [
                                    {
                                      ""Key"": ""#APPLICABLE_MOBILE_CHANNELS#"",
                                      ""Value"": ""MOBILEAPP,MOBILEWEB""
                                    }
                                  ]
                                }
                              }
                            ]
                          },
                          {
                            ""applicableProducts"": [
                              ""CASINO  "",
                              ""BINGO""
                            ],
                            ""bonusAmount"": 1500,
                            ""bonusCode"": ""BALCASINO101"",
                            ""bonusId"": 0,
                            ""bonusIssueId"": 64837020,
                            ""currency"": ""EUR"",
                            ""isBonusActive"": ""false"",
                            ""gvbInfo"": [
                              {
                                ""key"": ""CASINO"",
                                ""value"": {
                                  ""mobileGames"": [
                                    {
                                      ""key"": ""BlackJack"",
                                      ""value"": [
                                        {
                                          ""Key"": ""ALL"",
                                          ""Value"": ""ALL""
                                        }
                                      ]
                                    }
                                  ],
                                  ""nonMobileGames"": [
                                    {
                                      ""key"": ""BlackJack"",
                                      ""value"": [
                                        {
                                          ""Key"": ""ALL"",
                                          ""Value"": ""ALL""
                                        }
                                      ]
                                    },
                                    {
                                      ""key"": ""TablePoker"",
                                      ""value"": [
                                        {
                                          ""Key"": ""Caribbean Poker"",
                                          ""Value"": ""CaribbeanPoker""
                                        },
                                        {
                                          ""Key"": ""Progressive Caribbean Poker"",
                                          ""Value"": ""ProgressiveCaribbeanPoker""
                                        }
                                      ]
                                    }
                                  ]
                                }
                              }
                            ]
                          }
                        ],
                        ""cumulativeBonusAmount"": 2700,
                        ""currency"": ""EUR"",
                        ""multiProduct"": false
                      }
                    }
                  ]
                }";

        // Act
        var bonusBalance = PosApiSerializationTester.Deserialize<BonusBalanceResponse>(json).GetData();

        bonusBalance.Should().BeEquivalentTo(
            new Dictionary<string, ProductBonusInfo>
            {
                ["BINGO"] = new ProductBonusInfo(new[] { new Bonus(12, true, new List<string> { "BINGO" }) }),
                ["POKER"] = new ProductBonusInfo(new[] { new Bonus(18, true, new List<string> { "POKER" }) }),
                ["MULTI"] = new ProductBonusInfo(new[]
                {
                    new Bonus(12, true, new List<string> { "CASINO" }),
                    new Bonus(15, false, new List<string> { "CASINO", "BINGO" }),
                }),
            });
    }
}
