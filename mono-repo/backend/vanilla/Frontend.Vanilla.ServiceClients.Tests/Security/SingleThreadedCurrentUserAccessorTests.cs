using System;
using System.Security.Claims;
using System.Security.Principal;
using System.Threading;
using FluentAssertions;
using Frontend.Vanilla.Core.Abstractions;
using Frontend.Vanilla.ServiceClients.Security;
using Moq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Security;

public class SingleThreadedCurrentUserAccessorTests
{
    private ICurrentUserAccessor target;
    private IThread thread;
    private ClaimsPrincipal testUser;

    public SingleThreadedCurrentUserAccessorTests()
    {
        thread = Mock.Of<IThread>();
        target = new SingleThreadedCurrentUserAccessor(thread);
        testUser = new ClaimsPrincipal();
    }

    [Fact]
    public void Get_ShouldReturnCurrentPrincipalCastedAsClaims_Initially()
    {
        thread.CurrentPrincipal = testUser;

        var result = target.User; // Act

        result.Should().BeSameAs(testUser);
    }

    [Fact]
    public void Get_ShouldReturnLocalField_IfAlreadySet()
    {
        target.User = testUser;

        var result = target.User; // Act

        result.Should().BeSameAs(testUser);
        Mock.Get(thread).VerifyGet(t => t.CurrentPrincipal, Times.Never);
    }

    [Fact]
    public void Get_ShouldThrow_IfNotClaimsPrincipal()
    {
        thread.CurrentPrincipal = Mock.Of<IPrincipal>();

        Func<object> act = () => target.User;

        act.Should().Throw<InvalidCastException>()
            .Which.Message.Should().Contain(nameof(Thread) + "." + nameof(Thread.CurrentPrincipal));
    }

    [Fact]
    public void Set_ShouldSetCurrentPrincipal()
    {
        target.User = testUser; // Act
        thread.CurrentPrincipal.Should().BeSameAs(testUser);
    }

    [Fact]
    public void Set_ShouldThrow_IfNullArgument()
    {
        Action act = () => target.User = null;

        act.Should().Throw<ArgumentNullException>();
        Mock.Get(thread).VerifySet(t => t.CurrentPrincipal = It.IsAny<IPrincipal>(), Times.Never);
    }
}
