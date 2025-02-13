using System.Diagnostics.CodeAnalysis;
using FluentAssertions;
using Frontend.Host.Features.HtmlInjection;
using Frontend.Vanilla.Core.Caching.Isolation;
using Frontend.Vanilla.Core.Net;
using Frontend.Vanilla.DomainSpecificLanguage;
using Frontend.Vanilla.Features.Globalization.LanguageResolvers;
using Frontend.Vanilla.Features.HtmlInjection;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Host.Tests.Features.HtmlInjection;

public class HeadTagsRendererTests
{
    [Theory]
    [MemberData(nameof(GetRenderTestCases), "v4", "dynacon-head-tags", false)]
    [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "I need description for the test runner output.")]
    internal async Task HeadTagsRendererRenderTests(
        string description,
        bool isInternal,
        bool isDisabled,
        IDictionary<string, HeadTags> conditionalHeadTags,
        string expectedHtml)
    {
        await RendererRenderTests<HeadTagsRenderer>(
            isInternal,
            isDisabled,
            conditionalHeadTags,
            expectedHtml);
    }

    [Theory]
    [MemberData(nameof(GetRenderTestCases), "v4", "dynacon-footer-script-tags", true)]
    [SuppressMessage("Usage", "xUnit1026:Theory methods should use all of their parameters", Justification = "I need description for the test runner output.")]
    internal async Task FooterScriptTagsRendererRenderTests(
        string description,
        bool isInternal,
        bool isDisabled,
        IDictionary<string, HeadTags> conditionalHeadTags,
        string expectedHtml)
    {
        await RendererRenderTests<FooterScriptTagsRenderer>(
            isInternal,
            isDisabled,
            conditionalHeadTags,
            expectedHtml);
    }

    private async Task RendererRenderTests<T>(
        bool isInternal,
        bool isDisabled,
        IDictionary<string, HeadTags> conditionalHeadTags,
        string expectedHtml)
        where T : HtmlTagsRenderer
    {
        var htmlInjectionConfiguration = new HtmlInjectionConfiguration { DslHeadTags = conditionalHeadTags };

        var htmlInjectionControlOverride = new Mock<IHtmlInjectionControlOverride>();
        htmlInjectionControlOverride.Setup(c => c.IsDisabled(HtmlInjectionKind.HeadTags)).Returns(isDisabled);

        var internalRequestEvaluator = new Mock<IInternalRequestEvaluator>();
        internalRequestEvaluator.Setup(e => e.IsInternal()).Returns(isInternal);

        var headerTagLogger = new Mock<ILogger<IHeadTagsRenderer>>();
        var footerTagLogger = new Mock<ILogger<IFooterScriptTagsRenderer>>();
        var loggerMock = new Mock<ILogger<HtmlTagsRenderer>>();
        var currentLanguageResolver = new Mock<ICurrentLanguageResolver>();
        var labelIsolatedDistributedCache = new Mock<ILabelIsolatedDistributedCache>();
        var httpClientFactory = new Mock<IHttpClientFactory>();

        HtmlTagsRenderer headTagsRenderer = null!;

        if (typeof(T) == typeof(HeadTagsRenderer))
            headTagsRenderer = new HeadTagsRenderer(
                htmlInjectionControlOverride.Object,
                htmlInjectionConfiguration,
                internalRequestEvaluator.Object,
                currentLanguageResolver.Object,
                labelIsolatedDistributedCache.Object,
                httpClientFactory.Object,
                loggerMock.Object,
                headerTagLogger.Object);
        else if (typeof(T) == typeof(FooterScriptTagsRenderer))
            headTagsRenderer = new FooterScriptTagsRenderer(
                htmlInjectionControlOverride.Object,
                htmlInjectionConfiguration,
                internalRequestEvaluator.Object,
                currentLanguageResolver.Object,
                labelIsolatedDistributedCache.Object,
                httpClientFactory.Object,
                loggerMock.Object,
                footerTagLogger.Object);
        else
            throw new Exception($"Unexpected type: {typeof(T).FullName}");

        var source = new CancellationTokenSource();
        var token = source.Token;
        var html = await headTagsRenderer!.RenderAsync(token);

        html.Should().Be(expectedHtml);
    }

    public static IEnumerable<object[]> GetRenderTestCases(
        string version,
        string tagGroupName,
        bool isFooter)
    {
        var defaultConditionalHeadTags = new Dictionary<string, HeadTags>
        {
            {
                "test",
                CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                {
                    { "group1", new Dictionary<string, string> { { "link1", "<link1>" } } },
                    { "group2", new Dictionary<string, string> { { "link2", "<link2>" } } },
                })
            },
            {
                "test_2",
                CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                {
                    { "group3", new Dictionary<string, string> { { "script1", "<script1>" } } },
                    { "footer", new Dictionary<string, string> { { "script2", "<script2>" } } },
                })
            },
        };

        object[] GetTestCase(
            string description,
            IDictionary<string, HeadTags> conditionalHeadTags,
            string expectedHtml,
            bool isInternal = false,
            bool isDisabled = false)
        {
            return new object[] { description, isInternal, isDisabled, conditionalHeadTags, expectedHtml };
        }

        yield return GetTestCase(
            "disabled test without internals (comments)",
            defaultConditionalHeadTags,
            "",
            false,
            true);

        yield return GetTestCase(
            "disabled test with internals (comments)",
            defaultConditionalHeadTags,
            $"<!-- {version} --><!-- disabled:{tagGroupName} -->",
            true,
            true);

        yield return GetTestCase(
            "links and scripts #1",
            defaultConditionalHeadTags,
            isFooter
                ? "<script2>"
                : "<link1><link2><script1>");

        yield return GetTestCase(
            "null group, null header value test",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" } } },
                        { "group2", new Dictionary<string, string>() },
                    })
                },
                {
                    "test_two",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "footer", new Dictionary<string, string> { { "link2", "<link2>" } } },
                    })
                },
            },
            isFooter ? "<link2>" : "<link1>");

        yield return GetTestCase(
            "with internals (comments)",
            defaultConditionalHeadTags,
            isFooter
                ? $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:footer --><script2><!-- end:group:footer --><!-- end:{tagGroupName} -->"
                : $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:group1 --><link1><!-- end:group:group1 --><!-- start:group:group2 --><link2><!-- end:group:group2 --><!-- start:group:group3 --><script1><!-- end:group:group3 --><!-- end:{tagGroupName} -->",
            true);

        yield return GetTestCase(
            "null group with internals (comments)",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string>() },
                    })
                },
                {
                    "test_opa",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "footer", new Dictionary<string, string>() },
                    })
                },
            },
            isFooter
                ? $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:footer --><!-- end:group:footer --><!-- end:{tagGroupName} -->"
                : $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:group1 --><!-- end:group:group1 --><!-- end:{tagGroupName} -->",
            true);

        yield return GetTestCase(
            "condition false",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(false, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" } } },
                        { "group2", new Dictionary<string, string> { { "script1", "<script1>" } } },
                        { "footer", new Dictionary<string, string> { { "script3", "<script3>" } } },
                    })
                },
                {
                    "test_daaa",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link2", "<link2>" } } },
                        { "group2", new Dictionary<string, string> { { "script2", "<script2>" } } },
                        { "footer", new Dictionary<string, string> { { "link3", "<link3>" } } },
                    })
                },
            },
            isFooter
                ? "<link3>"
                : "<link2><script2>");

        yield return GetTestCase(
            "multiple with internals (comments)",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" }, { "script1", "<script1>" } } },
                        { "group2", new Dictionary<string, string> { { "link2", "<link2>" }, { "script2", "<script2>" } } },
                        { "footer", new Dictionary<string, string> { { "link3", "<link3>" }, { "script3", "<script3>" } } },
                    })
                },
            },
            isFooter
                ? $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:footer --><link3><script3><!-- end:group:footer --><!-- end:{tagGroupName} -->"
                : $"<!-- {version} --><!-- start:{tagGroupName} --><!-- start:group:group1 --><link1><script1><!-- end:group:group1 --><!-- start:group:group2 --><link2><script2><!-- end:group:group2 --><!-- end:{tagGroupName} -->",
            true);

        yield return GetTestCase(
            "multiple without internals (comments)",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" }, { "script1", "<script1>" } } },
                        { "group2", new Dictionary<string, string> { { "link2", "<link2>" }, { "script2", "<script2>" } } },
                        { "footer", new Dictionary<string, string> { { "link3", "<link3>" }, { "script3", "<script3>" } } },
                    })
                },
            },
            isFooter
                ? "<link3><script3>"
                : "<link1><script1><link2><script2>");

        yield return GetTestCase(
            "duplicate in group test",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" }, { "link2", "<link2>" } } },
                        { "group2", new Dictionary<string, string> { { "link2", "<link2>" }, { "script2", "<script2>" } } },
                        { "footer", new Dictionary<string, string> { { "link3", "<link3>" }, { "script3", "<script3>" } } },
                    })
                },
            },
            isFooter
                ? "<link3><script3>"
                : "<link1><link2><script2>");

        yield return GetTestCase(
            "duplicate in other group test",
            new Dictionary<string, HeadTags>
            {
                {
                    "test",
                    CreateHeadTags(true, new Dictionary<string, IDictionary<string, string>>
                    {
                        { "group1", new Dictionary<string, string> { { "link1", "<link1>" }, { "script1", "<script1>" } } },
                        { "group2", new Dictionary<string, string> { { "link1", "<link1>" }, { "script2", "<script2>" } } },
                        {
                            "footer",
                            new Dictionary<string, string> { { "link3", "<link3>" }, { "link4", "<link3>" }, { "script4", "<script3>" }, { "script3", "<script3>" } }
                        },
                    })
                },
            },
            isFooter
                ? "<link3><script3>"
                : "<link1><script1><script2>");
    }

    private static HeadTags CreateHeadTags(bool isTrue, Dictionary<string, IDictionary<string, string>> tags)
    {
        var expression = new Mock<IDslExpression<bool>>();
        expression.Setup(x => x.Evaluate()).Returns(isTrue);

        return new HeadTags
        {
            Condition = expression.Object,
            Tags = tags,
        };
    }
}
