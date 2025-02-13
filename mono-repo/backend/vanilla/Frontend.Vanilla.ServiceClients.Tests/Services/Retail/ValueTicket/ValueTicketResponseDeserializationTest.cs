using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.ServiceClients.Services.Retail.ValueTicket;
using Frontend.Vanilla.Testing.ServiceClients;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Services.Retail.ValueTicket;

public class ValueTicketResponseDeserializationTest
{
    [Theory]
    [MemberData(nameof(GetDeserializationTestCases))]
#pragma warning disable xUnit1026 // Theory methods should use all of their parameters
    public void DeserializationTest(string description, string json)
#pragma warning restore xUnit1026 // Theory methods should use all of their parameters
    {
        var response = PosApiSerializationTester.Deserialize<ValueTicketResponse>(json);
        response.Should().NotBeNull();
    }

    public static IEnumerable<object[]> GetDeserializationTestCases()
    {
        object[] GetTestCase(string description, string json) => new object[] { description, json };

        yield return GetTestCase("AMLDecisionHistoryDetails.IsManualTicketLocking can be null", GetJsonText(
            isManualTicketLockingNull: true));
        yield return GetTestCase("AMLDecisionHistoryDetails.AmlDecisionDate can be null", GetJsonText(
            amlDecisionDateIsNull: true));
        yield return GetTestCase("AMLDecisionHistoryDetails.ChangeValueTicketDate can be null", GetJsonText(
            changeValueTicketDateIsNull: true));
        yield return GetTestCase("LockingDetails.LockingTime can be null", GetJsonText(
            lockingTimeIsNull: true));
        yield return GetTestCase("LockingDetails.ManualLock can be null", GetJsonText(
            isManualLockNull: true));
        yield return GetTestCase("UnlockingDetails.UnlockingTime can be null", GetJsonText(
            isUnlockingTimeNull: true));
    }

    private static string GetJsonText(
        bool isManualTicketLockingNull = false,
        bool amlDecisionDateIsNull = false,
        bool changeValueTicketDateIsNull = false,
        bool lockingTimeIsNull = false,
        bool isManualLockNull = false,
        bool isUnlockingTimeNull = false) => $@"
{{
  ""valueTicketId"": ""V-021000NR98TLDR2L"",
  ""valueTicketStatus"": ""PRINTED"",
  ""currency"": ""GBP"",
  ""amount"": 1267,
  ""accountName"": ""ld_shop_8453_01"",
  ""brandId"": ""LADBROKEUK"",
  ""shopId"": ""8453"",
  ""terminalId"": ""01"",
  ""terminalIdPaidOut"": null,
  ""printedDate"": ""2012-04-23T18:25:43.511Z"",
  ""paidOuDate"": null,
  ""agentName"": null,
  ""comments"": ""cleared"",
  ""amlDecisionHistoryDetails"": [
    {{
      ""isManualTicketLocking"": true,
      ""lockingReasonAML"": "" Responsible Gambling Issue"",
      ""shopAgentName"": ""Arpit Mehra"",
      ""changeValueTicketDate"": ""2012-04-23T18:25:43.511Z"",
      ""amlAgentName"": null,
      ""amlPreviousStatus"": null,
      ""amlCurrentStatus"": ""BLOCKED"",
      ""comments"": null,
      ""amlDecisionDate"": ""2012-04-23T18:25:43.511Z""
    }},
    {{
      ""isManualTicketLocking"": {(isManualTicketLockingNull ? "null" : "true")},
      ""lockingReasonAML"": null,
      ""shopAgentName"": ""Arpit Mehra"",
      ""changeValueTicketDate"": {(changeValueTicketDateIsNull ? "null" : "\"2012-04-23T18:25:43.511Z\"")},
      ""amlAgentName"": ""Arpit Mehra"",
      ""amlPreviousStatus"": ""BLOCKED"",
      ""amlCurrentStatus"": ""CLEARED"",
      ""comments"": ""cleared"",
      ""amlDecisionDate"": {(amlDecisionDateIsNull ? "null" : "\"2012-04-23T18:25:43.511Z\"")}
    }}
  ],
  ""lockingDetails"": {{
    ""status"": ""BLOCKED"",
    ""lockingReason"": "" Responsible Gambling Issue"",
    ""lockingUser"": ""Arpit Mehra"",
    ""lockingTime"": {(lockingTimeIsNull ? "null" : "1614697252")},
    ""manualLock"": {(isManualLockNull ? "null" : "true")}
  }},
  ""unlockingDetails"": {{
    ""status"": ""CLEARED"",
    ""unlockingReason"": null,
    ""unlockingUser"": ""Arpit Mehra"",
    ""unlockingTime"": {(isUnlockingTimeNull ? "null" : "1614697294")}
  }},
  ""status"": ""SUCCESS"",
  ""errorCode"": null,
  ""errorMsg"": null,
  ""claimType"": null,
  ""errorDesc"": """",
  ""amlCurrentStatus"": ""CLEARED"",
  ""success"": true,
  ""errorDetails"": null
}}
";
}
