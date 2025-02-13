using System;
using System.Collections.Generic;
using System.Linq;
using FluentAssertions;
using Frontend.Vanilla.Configuration.DynaCon.Multitenancy;
using Frontend.Vanilla.Core.System.Text;
using Frontend.Vanilla.Testing;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Frontend.Vanilla.Testing.Xunit;
using Microsoft.Extensions.Logging;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Configuration.DynaCon.Tests.Multitenancy;

public class TenantManagerTests
{
    private ITenantManager target;
    private Mock<ICurrentTenantResolver> currentTenantResolver;
    private Mock<ITenantFactory> tenantFactory;
    private TestClock clock;
    private TestLogger<TenantManager> log;

    private ITenant bwinTenant;
    private ITenant partyTenant;

    public TenantManagerTests()
    {
        currentTenantResolver = new Mock<ICurrentTenantResolver>();
        tenantFactory = new Mock<ITenantFactory>();
        clock = new TestClock();
        log = new TestLogger<TenantManager>();
        target = new TenantManager(currentTenantResolver.Object, tenantFactory.Object, clock, log);

        bwinTenant = Mock.Of<ITenant>();
        partyTenant = Mock.Of<ITenant>();
        currentTenantResolver.Setup(r => r.ResolveName()).Returns("bwin.com");
        tenantFactory.Setup(f => f.Create("bwin.com")).Returns(bwinTenant);
        tenantFactory.Setup(f => f.Create("party.net")).Returns(partyTenant);
    }

    [Fact]
    public void ShouldCreateTenantsLazily()
    {
        // Act 1
        var tenant = target.GetCurrentTenant();

        tenant.Should().BeSameAs(bwinTenant);
        target.GetActiveTenants().Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, ITenant> { { "bwin.com", bwinTenant } });

        // Act 2
        currentTenantResolver.Setup(r => r.ResolveName()).Returns("party.net");
        tenant = target.GetCurrentTenant();

        tenant.Should().BeSameAs(partyTenant);
        target.GetActiveTenants().Should().BeEquivalentTo(new Dictionary<TrimmedRequiredString, ITenant> { { "bwin.com", bwinTenant }, { "party.net", partyTenant } });
    }

    [Fact]
    public void ShouldCacheValueThreadSafely()
    {
        // Act
        ConcurrencyTest.Run(10, i => target.GetCurrentTenant().Should().BeSameAs(bwinTenant));

        tenantFactory.VerifyWithAnyArgs(f => f.Create(null), Times.Once);
        currentTenantResolver.Verify(r => r.ResolveName(), Times.Exactly(10));
    }

    [Fact]
    public void ShouldCacheCaseInsensitive()
    {
        target.GetCurrentTenant();
        currentTenantResolver.Setup(r => r.ResolveName()).Returns("Bwin.COM");

        // Act
        target.GetCurrentTenant().Should().BeSameAs(bwinTenant);
    }

    [Fact]
    public void ShouldUpdateLastAccessTimeOnEachCall()
    {
        // Act 1
        var tenant = target.GetCurrentTenant();

        tenant.LastAccessTime.Should().Be(clock.UtcNow);

        // Act 2
        clock.UtcNow += TimeSpan.FromSeconds(66);
        tenant = target.GetCurrentTenant();

        tenant.LastAccessTime.Should().Be(clock.UtcNow);
    }

    public enum FailedTestCase
    {
        /// <summary>
        /// CurrentTenantResolution
        /// </summary>
        CurrentTenantResolution,

        /// <summary>
        /// TenantCreation
        /// </summary>
        TenantCreation,
    }

    [Theory, EnumData(typeof(FailedTestCase))]
    public void ShouldLogExceptionToPreserveItForDiagnostics(FailedTestCase testCase)
    {
        var ex = new Exception("Oups");

        switch (testCase)
        {
            case FailedTestCase.CurrentTenantResolution:
                currentTenantResolver.Setup(r => r.ResolveName()).Throws(ex);

                break;
            case FailedTestCase.TenantCreation:
                tenantFactory.SetupWithAnyArgs(f => f.Create(null)).Throws(ex);

                break;
        }

        Func<object> act = target.GetCurrentTenant;

        act.Should().Throw().Which.InnerException.Should().BeSameAs(ex);
        log.Logged.Single().Verify(LogLevel.Critical, ex);
    }
}
