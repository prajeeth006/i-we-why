using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon;
using Frontend.Vanilla.Configuration.DynaCon.Context;
using Frontend.Vanilla.Core.Rest;
using Frontend.Vanilla.Features.LabelResolution;
using Frontend.Vanilla.Features.Tests.Fakes;
using Frontend.Vanilla.Features.WebAbstractions;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Xunit;
using JetBrains.Annotations;
using Microsoft.AspNetCore.Http;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.LabelResolution;

public class LabelResolverTests
{
    private ILabelResolver target;
    private Mock<IHttpContextAccessor> httpContextAccessor;
    private Mock<ICurrentContextHierarchy> currentCtxHierarchy;
    private HttpContext context;

    public LabelResolverTests()
    {
        httpContextAccessor = new Mock<IHttpContextAccessor>();
        currentCtxHierarchy = new Mock<ICurrentContextHierarchy>();
        target = new LabelResolver(httpContextAccessor.Object, currentCtxHierarchy.Object);

        context = new DefaultHttpContext();
        context.Request.Host = new HostString("www.premium.com", 66);
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => context);
        SetupContext(new Dictionary<string, IReadOnlyDictionary<string, string>>
        {
            [LabelResolver.Label] = new Dictionary<string, string>
            {
                { "bwin.de", "germany" },
                { "sh.bwin.de", "germany" },
                { "premium.com", null },
                { "nj.betmgm.com", null },
                { "ns.cluster.dev.k8s.env.works", null },
                { "header.com", null },
                { "query.com", null },
                { "cookie.com", null },
            },
            ["Product"] = new Dictionary<string, string>
            {
                { "Whatever", "Value" },
            },
        });
    }

    [Theory]
    [InlineData("www.premium.com", 80, LabelResolutionMode.HostnameEnd, null, "premium.com")]
    [InlineData("www.premium.com", 66, LabelResolutionMode.HostnameEnd, null, "premium.com")] // Should ignore port
    [InlineData("casino.bwin.de", 443, LabelResolutionMode.HostnameEnd, null, "bwin.de")]
    [InlineData("casino.sh.bwin.de", 80, LabelResolutionMode.HostnameEnd, null, "sh.bwin.de")] // Should order correctly
    [InlineData("casino.sh.bwin.de", 80, LabelResolutionMode.HostnameEnd, "premium.com", "premium.com")] // Should favour request header
    [InlineData("nj.betmgm.com.ns.cluster.dev.k8s.bwin.de", 443, LabelResolutionMode.HostnameEnd, null, "bwin.de")]
    [InlineData("premium.com.dev.k8s.env.works", 443, LabelResolutionMode.HostnameStart, null, "premium.com")]
    internal void ShouldResolveCorrectly(string host, int port, LabelResolutionMode mode, [CanBeNull] string requestHeaderLabel, string expectedLabel)
    {
        if (requestHeaderLabel is not null)
        {
            context.Request.Headers.TryAdd(LabelResolver.LabelRequestHeader, requestHeaderLabel);
        }

        context.Request.Host = new HostString(host, port);

        var label = target.Get(mode);
        label.Should().Be(expectedLabel);
    }

    [Fact]
    public void ShouldThrow_IfHostNotInList()
    {
        context.Request.Host = new HostString("www.gvc.com", 66);

        Action act = () => target.Get();

        act.Should().Throw()
            .Which.Message.Should().ContainAll("www.gvc.com", "'ns.cluster.dev.k8s.env.works', 'nj.betmgm.com', 'premium.com', 'sh.bwin.de', 'header.com', 'cookie.com', 'query.com', 'bwin.de'"); // Should be same order as used for matching
    }

    [Fact]
    public void ShouldThrow_IfNoHttpContext()
    {
        httpContextAccessor.SetupGet(a => a.HttpContext).Returns(() => null);

        Action act = () => target.Get();

        act.Should().Throw<NoHttpContextException>();
    }

    [Theory, BooleanData]
    public void ShouldThrow_IfNullOrEmptyLabels(bool nullLabels)
    {
        SetupContext(nullLabels
            ? new Dictionary<string, IReadOnlyDictionary<string, string>>()
            : new Dictionary<string, IReadOnlyDictionary<string, string>> { { LabelResolver.Label, new Dictionary<string, string>() } });

        Action act = () => target.Get();

        act.Should().Throw().Which.Message.Should().StartWith("No labels");
    }

    private void SetupContext(Dictionary<string, IReadOnlyDictionary<string, string>> hierarchy)
        => currentCtxHierarchy.SetupGet(h => h.Value).Returns(new VariationContextHierarchy(hierarchy, ConfigurationSource.Service));
}
