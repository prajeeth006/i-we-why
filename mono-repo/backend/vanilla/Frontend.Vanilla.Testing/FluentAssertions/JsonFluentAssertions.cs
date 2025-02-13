using System;
using System.Linq;
using FluentAssertions.Primitives;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;

namespace Frontend.Vanilla.Testing.FluentAssertions;

/// <summary>
///     Fluent assertions for verifying a JSON string or a token.
/// </summary>
internal static class JsonFluentAssertions
{
    public static void BeJson<TSubject, TAssertions>(this ReferenceTypeAssertions<TSubject, TAssertions> assertions, string expectedJson)
        where TAssertions : ReferenceTypeAssertions<TSubject, TAssertions>
    {
        var expectedToken = ParseJson(expectedJson, ex => $"Parameter {nameof(expectedJson)} is not well-formed JSON: {ex}");
        assertions.BeJson(expectedToken);
    }

    public static void BeJson<TSubject, TAssertions>(this ReferenceTypeAssertions<TSubject, TAssertions> assertions, JToken expectedJson)
        where TAssertions : ReferenceTypeAssertions<TSubject, TAssertions>
    {
        assertions.NotBeNull();

        switch (assertions.Subject)
        {
            case JToken json:
                VerifyJson(json, expectedJson);

                break;

            case string rawJson:
                var actualJson = ParseJson(rawJson, ex => $"Expected {typeof(string)} value to be well-formed JSON but it's not: {ex}");
                VerifyJson(actualJson, expectedJson);

                break;

            default:
                throw FailureHelper.CreateError($"Expected object of type {typeof(JToken)} or {typeof(string)} as raw JSON but found {assertions.Subject.GetType()}.");
        }
    }

    private static void VerifyJson(JToken actualJson, JToken expectedJson)
    {
        if (JToken.DeepEquals(actualJson, expectedJson))
            return;

        actualJson = SortObjectProperties(actualJson);
        expectedJson = SortObjectProperties(expectedJson);

        // Dind out first difference for convenience
        var expectedLines = expectedJson.ToString().Split(new[] { Environment.NewLine }, StringSplitOptions.None);
        var actualLines = actualJson.ToString().Split(new[] { Environment.NewLine }, StringSplitOptions.None);

        var diffIndex = Enumerable.Range(0, expectedLines.Length)
            .First(i => expectedLines[i] != actualLines[i]);

        throw FailureHelper.CreateError(
            $"JSON tokens differ at line {diffIndex + 1}.",
            $"Expected line : {expectedLines[diffIndex]?.Trim()}{Environment.NewLine}"
            + $"Actual line   : {actualLines[diffIndex]?.Trim()}",
            $"Expected full JSON: {expectedJson}",
            $"Actual full JSON: {actualJson}");
    }

    private static JToken ParseJson(string str, Func<Exception, string> errorMsgBuilder)
    {
        try
        {
            // Deserialize datetimes as raw strings so that '2011-09-14T10:33:02Z' doesn't equal to '/Date(1315996382000)/'
            return JsonConvert.DeserializeObject<JToken>(str, new JsonSerializerSettings { DateParseHandling = DateParseHandling.None });
        }
        catch (Exception ex)
        {
            throw FailureHelper.CreateError(errorMsgBuilder(ex), $"Raw value: {str}");
        }
    }

    private static JToken SortObjectProperties(JToken token)
    {
        if (token?.Type != JTokenType.Object)
            return token;

        var result = new JObject();
        foreach (var prop in ((JObject)token).Properties().OrderBy(p => p.Name))
            result.Add(prop.Name, SortObjectProperties(prop.Value));

        return result;
    }
}
