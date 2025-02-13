using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using FluentAssertions;
using Frontend.Vanilla.Core.System;
using Frontend.Vanilla.ServiceClients.Infrastructure.Caching;
using Frontend.Vanilla.ServiceClients.Security;
using Frontend.Vanilla.Testing.Fakes;
using Frontend.Vanilla.Testing.FluentAssertions;
using Frontend.Vanilla.Testing.Moq;
using Moq;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using Xunit;

namespace Frontend.Vanilla.ServiceClients.Tests.Infrastructure.Caching;

public class UserDataCacheTests : IDisposable
{
    private IUserDataCache target;
    private Mock<IUserDataContainerManager> userDataContainerManager;
    private TestClock clock;

    private ExecutionMode mode;
    private PosApiAuthTokens authTokens;
    private UserDataContainer container;
    private UserDataItem otherItem;
    private Foo foo;

    public UserDataCacheTests()
    {
        userDataContainerManager = new Mock<IUserDataContainerManager>();
        clock = new TestClock();
        target = new UserDataCache(userDataContainerManager.Object, clock);

        mode = TestExecutionMode.Get();
        authTokens = new PosApiAuthTokens("user-token", "session-token");
        otherItem = new UserDataItem("whatever", clock.UtcNow.AddHours(-1));
        container = new UserDataContainer(new Dictionary<string, UserDataItem> { { "other", otherItem } });
        foo = new Foo();

        userDataContainerManager.Setup(m => m.GetContainerAsync(mode, authTokens)).ReturnsAsync(container);
    }

    public class Foo
    {
        public string Name { get; set; }
        public DayOfWeek Enum { get; set; }
    }

    [Fact]
    public async Task GetAsync_ShouldReturnCachedValue()
    {
        container.Items["key"] = new UserDataItem("json", clock.UtcNow.AddHours(1)) { DeserializedValue = foo };

        var result = await target.GetAsync(mode, authTokens, "key", typeof(Foo)); // Act

        result.Should().BeSameAs(foo);
    }

    [Fact]
    public async Task GetAsync_ShouldDeserializeValue_IfOnlyJson()
    {
        var json = JToken.Parse(@"{
                Name: 'Chuck Norris',
                Enum: 'Friday'
            }");
        container.Items["key"] = new UserDataItem(json, clock.UtcNow.AddHours(1));

        var result = await target.GetAsync(mode, authTokens, "key", typeof(Foo)); // Act

        result.Should().BeEquivalentTo(
            new Foo
            {
                Name = "Chuck Norris",
                Enum = DayOfWeek.Friday,
            });
        container.Items.Should().ContainKey("key").WhoseValue.DeserializedValue.Should().BeSameAs(result);
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfNothingCached()
    {
        var result = await target.GetAsync(mode, authTokens, "key", typeof(Foo)); // Act
        result.Should().BeNull();
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfExpired()
    {
        container.Items["key"] = new UserDataItem("json", clock.UtcNow.AddHours(-1)) { DeserializedValue = foo };

        var result = await target.GetAsync(mode, authTokens, "key", typeof(Foo)); // Act

        result.Should().BeNull();
        container.Items.Should().ContainKey("key").WhoseValue.DeserializedValue.Should().BeSameAs(foo); // Should not clean yet
    }

    [Fact]
    public async Task GetAsync_ShouldReturnNull_IfDeserializationFails()
    {
        container.Items["key"] = new UserDataItem("gibberish-json", clock.UtcNow.AddHours(1));

        Func<Task> act = () => target.GetAsync(mode, authTokens, "key", typeof(Foo));

        (await act.Should().ThrowAsync<Exception>()).WithMessage($"Failed deserializing {typeof(Foo)} from JSON: gibberish-json.")
            .Which.InnerException.Should().BeAssignableTo<JsonException>();
    }

    [Fact]
    public async Task SetAsync_ShouldSerializeValueAndStoreInContainer()
    {
        foo.Name = "Chuck Norris";
        foo.Enum = DayOfWeek.Friday;

        // Act
        await target.SetAsync(mode, authTokens, "key", foo, TimeSpan.FromSeconds(666));

        var item = container.Items.Should().ContainKey("key").WhoseValue;
        item.DeserializedValue.Should().BeSameAs(foo);
        item.Json.Should().BeJson(@"{
                Name: 'Chuck Norris',
                Enum: 'Friday'
            }");
        item.Expires.Should().Be(clock.UtcNow.AddSeconds(666));
        container.IsModified.Should().BeTrue();
    }

    public class NotSerializable
    {
        public string Value => throw new Exception("GTFO");
    }

    [Fact]
    public async Task SetAsync_ShouldThrow_IfFailedValueSerialization()
    {
        var value = new NotSerializable();

        var act = () => target.SetAsync(mode, authTokens, "key", value, new TimeSpan(666));

        (await act.Should().ThrowAsync<Exception>()).WithMessage($"Failed serializing {typeof(NotSerializable)} to JSON.")
            .WithInnerException<JsonException>()
            .WithInnerMessage("GTFO");
        userDataContainerManager.VerifyWithAnyArgs(m => m.GetContainerAsync(default, null), Times.Never);
    }

    [Fact]
    public async Task RemoveAsync_ShouldRemoveValueFromContainer()
    {
        container.Items["key"] = new UserDataItem("json", clock.UtcNow.AddHours(1));

        // Act
        await target.RemoveAsync(mode, authTokens, "key");

        container.Items.Should().NotContainKey("key");
        container.IsModified.Should().BeTrue();
    }

    [Fact]
    public async Task RemoveAsync_ShouldNotRemoveValueFromContainer_IfNotExist()
    {
        // Act
        await target.RemoveAsync(mode, authTokens, "key");

        container.Items.Should().NotContainKey("key");
        container.IsModified.Should().BeFalse();
    }

    public void Dispose()
    {
        userDataContainerManager.VerifyWithAnyArgs(m => m.GetContainerAsync(default, null), Times.AtMostOnce);
        container.Items.Should().ContainKey("other").WhoseValue.Should().BeSameAs(otherItem);
        container.IsDisposed.Should().BeFalse();
    }
}
