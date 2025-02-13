using System;
using System.Collections.Generic;
using FluentAssertions;
using Frontend.Vanilla.Features.ContentMessages;
using Frontend.Vanilla.Features.Cookies;
using Moq;
using Xunit;

namespace Frontend.Vanilla.Features.Tests.ContentMessages;

public class ClosedContentMessagesCookieTests
{
    private readonly IClosedContentMessagesCookie target;
    private readonly Mock<ICookieHandler> cookieHandler;

    public ClosedContentMessagesCookieTests()
    {
        cookieHandler = new Mock<ICookieHandler>();
        target = new ClosedContentMessagesCookie(cookieHandler.Object);
    }

    private void RunGetValuesTest(
        string key,
        IEnumerable<ClosedMessageInfo> expectedMessages,
        string sessionCookie = null,
        string persistentCookie = null,
        string loginCookie = null)
    {
        if (sessionCookie != null)
            cookieHandler.Setup(o => o.GetValue(ClosedContentMessagesCookie.CookieNames.Session)).Returns(sessionCookie);
        if (persistentCookie != null)
            cookieHandler.Setup(o => o.GetValue(ClosedContentMessagesCookie.CookieNames.Persistent)).Returns(persistentCookie);
        if (loginCookie != null)
            cookieHandler.Setup(o => o.GetValue(ClosedContentMessagesCookie.CookieNames.Login)).Returns(loginCookie);

        // Act
        var result = target.GetValues(key);

        result.Should().BeEquivalentTo(expectedMessages);
    }

    [Fact]
    public void GetValues__ShouldGetFromAllCookies()
        => RunGetValuesTest(
            key: "k",
            sessionCookie: "k=message1",
            persistentCookie: "k=message2",
            loginCookie: "k=message3",
            expectedMessages: new[]
            {
                new ClosedMessageInfo("message1", true, false),
                new ClosedMessageInfo("message2", false, false),
                new ClosedMessageInfo("message3", false, true),
            });

    [Fact]
    public void GetValues_ShouldGetOnlyForParticularKey()
        => RunGetValuesTest(
            key: "k",
            sessionCookie: "k=message1&x=message2",
            expectedMessages: new[] { new ClosedMessageInfo("message1", true, false) });

    [Fact]
    public void GetValues_ShouldSplit_IfMultipleValues()
        => RunGetValuesTest(
            key: "k",
            sessionCookie: "k=message1|message2",
            expectedMessages: new[] { new ClosedMessageInfo("message1", true, false), new ClosedMessageInfo("message2", true, false) });

    [Fact]
    public void GetValues_ShouldDecodeValue()
        => RunGetValuesTest(
            key: "k",
            sessionCookie: "k=my+message",
            expectedMessages: new[] { new ClosedMessageInfo("my message", true, false) });

    private void RunSetValuesTest(
        string key,
        IEnumerable<ClosedMessageInfo> messagesToSet,
        string expectedSessionCookie = null,
        string expectedPersistentCookie = null,
        string expectedLoginCookie = null)
    {
        // Act
        target.SetValues(key, messagesToSet);

        VerifyCookie(ClosedContentMessagesCookie.CookieNames.Persistent, expectedPersistentCookie, expectedExpires: TimeSpan.FromDays(365));
        VerifyCookie(ClosedContentMessagesCookie.CookieNames.Session, expectedSessionCookie, expectedExpires: null);
        VerifyCookie(ClosedContentMessagesCookie.CookieNames.Login, expectedLoginCookie, expectedExpires: TimeSpan.FromDays(365));

        void VerifyCookie(string cookieName, string expectedValue, TimeSpan? expectedExpires)
        {
            cookieHandler.Verify(o => o.Set(cookieName, expectedValue, expectedExpires == null ? null : new CookieSetOptions { MaxAge = expectedExpires }),
                expectedValue == null ? Times.Never() : Times.Once());
        }
    }

    [Fact]
    public void SetValues_ShouldSetValueByKey()
        => RunSetValuesTest(
            key: "k",
            messagesToSet: new[] { new ClosedMessageInfo("message1", true, false) },
            expectedSessionCookie: "k=message1");

    [Fact]
    public void SetValues_ShouldEncodeValue()
        => RunSetValuesTest(
            key: "k",
            messagesToSet: new[] { new ClosedMessageInfo("my message", true, false) },
            expectedSessionCookie: "k=my%20message");

    [Fact]
    public void SetValues_ShouldCollapseDuplicates()
        => RunSetValuesTest(
            key: "k",
            messagesToSet: new[] { new ClosedMessageInfo("message1", true, false), new ClosedMessageInfo("MESSage1", true, false) },
            expectedSessionCookie: "k=message1");

    [Fact]
    public void SetValues_ShouldSetMultipleValuesByKey()
        => RunSetValuesTest(
            "k",
            messagesToSet: new[] { new ClosedMessageInfo("message1", true, false), new ClosedMessageInfo("message2", true, false) },
            expectedSessionCookie: "k=message1|message2");

    [Fact]
    public void SetValues_ShouldNotModifyOtherKeyedValues()
    {
        cookieHandler.Setup(o => o.GetValue("clsd-s")).Returns("w=other");
        RunSetValuesTest(
            key: "k",
            messagesToSet: new[] { new ClosedMessageInfo("message1", true, false) },
            expectedSessionCookie: "w=other&k=message1");
    }

    [Fact]
    public void SetValues_ShouldSetAllCookies()
        => RunSetValuesTest(
            key: "k",
            messagesToSet: new[]
            {
                new ClosedMessageInfo("session", true, false),
                new ClosedMessageInfo("persistent", false, false),
                new ClosedMessageInfo("login", false, true),
            },
            expectedSessionCookie: "k=session",
            expectedPersistentCookie: "k=persistent",
            expectedLoginCookie: "k=login");

    [Fact]
    public void SetValues_ShouldNotSetCookie_IfNotModified()
    {
        cookieHandler.Setup(o => o.GetValue("clsd-s")).Returns("k=message1|message2");
        RunSetValuesTest(
            key: "k",
            messagesToSet: new[] { new ClosedMessageInfo("message2", true, false), new ClosedMessageInfo("MESsage1", true, false) },
            expectedSessionCookie: null);
    }

    [Fact]
    public void SetValues_ShouldRemoveKeyedValue_IfEmptyValue()
    {
        cookieHandler.Setup(o => o.GetValue("clsd-s")).Returns("k=message1|message2&w=other");
        RunSetValuesTest(
            key: "k",
            messagesToSet: Array.Empty<ClosedMessageInfo>(),
            expectedSessionCookie: "w=other");
    }

    [Fact]
    public void SetValues_ShouldRemoveCookie_IfEmptyWholeCookie()
    {
        cookieHandler.Setup(o => o.GetValue("clsd-s")).Returns("k=message1|message2");

        target.SetValues("k", Array.Empty<ClosedMessageInfo>());
        cookieHandler.Verify(o => o.Delete("clsd-s", null), Times.Once);
    }

    [Fact]
    public void SetValues_ShouldNotWriteAnyCookie_IfEverythingEmpty()
        => RunSetValuesTest(key: "k", messagesToSet: Array.Empty<ClosedMessageInfo>());

    [Fact]
    public void RemoveValuesOnLogin_ShouldRemoveLoginCookie()
    {
        target.RemoveValuesOnLogin(); // Act

        cookieHandler.Verify(o => o.Delete(ClosedContentMessagesCookie.CookieNames.Login, null), Times.Once);
    }
}
